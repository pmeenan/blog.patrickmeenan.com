---
title: "New field browser performance and profiling tooling - rumcap"
date: 2026-07-05T18:07:12.000-04:00
heroImage: "./devtools-view.png"
---

Ever since browser vendors started exposing advanced performance telemetry APIs directly to the page, such as the [Performance Timeline](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceTimeline), [Long Animation Frames (LoAF)](https://developer.mozilla.org/en-US/docs/Web/API/Long_Animation_Frame_Timing_API), and the [JS Self-Profiling API](https://developer.mozilla.org/en-US/docs/Web/API/JS_Self-Profiling_API), I’ve been waiting for tooling that can capture, store, and actually visualize all of this data in the wild. We can gather incredibly detailed information about what is happening on a user's machine, but until now, doing anything with that data in production was a massive challenge.

When I introduced [Waterfall Tools](https://waterfall-tools.com/) a few months ago, the goal was to build a client-based canvas rendering engine for synthetic test waterfalls. But it also laid the perfect groundwork for a field-data viewer. We just needed a way to package, compress, and feed that rich field data into it.

Today, I’m excited to introduce **rumcap**: a file format and helper library designed specifically to collect, compress, and visualize in-browser performance data.

## Half the Size of Gzipped JSON

The headline feature of `rumcap` is its compression efficiency. 

When you capture raw performance timelines, resource entries, call stacks, and JS profile samples, the raw data structure is highly repetitive. You have the same domains, similar resource paths, repeated function names, and overlapping execution call stacks. If you just grab these events as JSON and gzip them, you still end up with relatively large payloads.

`rumcap` addresses this by applying domain-specific serialization and indexing. It deduplicates and indexes strings (URLs, script names, function names) and structures the execution trace nodes hierarchically before encoding. 

The result? A `.rumcap` binary file is typically **half the size of the equivalent raw events gzipped**. By profiling standards, the files are incredibly tiny, making rich telemetry viable for real-user monitoring (in the neighborhood of 10 KB for a typical page view with full request data and JS self-profiling enabled).

## Rich Visualization in Waterfall Tools

To support this new format, `waterfall-tools` has been updated with native `rumcap` support. Depending on what data you capture, you can now render three distinct views side-by-side:

1. **Waterfall View**: A classic network waterfall timeline showing all resources, including visual markings for key performance metrics (FCP, LCP) and Long Animation Frames (LoAF).

![Waterfall View](./waterfall-view.png "The Waterfall view rendering resource requests in the classic performance waterfall.")

2. **DevTools View**: Chrome's DevTools performance panel with data for the requests, page-level timings, call stacks, user-timing events, and more.

![DevTools View](./devtools-view.png "A Chrome DevTools performance panel with full call stacks and request data.")

3. **Perfetto View**: A fully embedded Perfetto trace viewer for slicing and dicing the JS profile samples alongside main thread activities.

![Perfetto View](./perfetto-view.png "An embedded Perfetto trace view of the JS profile, request data and other timing events.")

If your profile includes JS self-profiling data, you can inspect the exact call stacks side-by-side with resource requests and LoAF blocks to instantly identify what script blocked the thread. Additionally, it fully supports [User Timing marks and measures](https://developer.mozilla.org/en-US/docs/Web/API/User_Timing_API), as well as custom stacked event durations, so you can easily map your own trace instrumentation into the timeline.

## What rumcap is NOT (and What it is)

It is important to be clear about scope: **rumcap is not a full end-to-end RUM stack.** 

It does **not** provide:
- A full analytics/beaconing library (which projects like Boomerang are already great at).
- A collection backend or aggregation infrastructure.
- A visualization dashboard.
- The logic to decide *when* to trigger profiling (since JS self-profiling does have runtime overhead, you definitely shouldn't capture a full trace on every single page view).

Instead, `rumcap` provides the missing link: a compact file format, an encoder/decoder library, and the visualization tools. The goal is to make it easy for existing RUM providers and in-house performance infrastructure to start collecting and displaying developer-friendly trace views.

## Minimal Integration Example

Integrating `rumcap` to capture events and profile JS on your page is designed to be as simple as possible. Here is an example showing how to initialize the encoder, start JS self-profiling, and export the final payload at onload:

```html
<script type="module">
  import { Encoder, entrySink, environmentSnapshot } from '/js/rumcap.js';

  const encoder = new Encoder();
  encoder.setEnvironment(environmentSnapshot());

  // Connect PerformanceObservers directly to the encoder sink
  const sink = entrySink(encoder);
  const entryTypes = [
    'navigation', 'resource', 'paint', 'largest-contentful-paint', 
    'layout-shift', 'event', 'first-input', 'longtask', 
    'long-animation-frame', 'element', 'mark', 'measure'
  ];
  for (const type of entryTypes) {
    try { new PerformanceObserver(sink).observe({ type, buffered: true }); } catch (e) {}
  }

  // Start JS Self-Profiling if supported
  let profiler;
  if (window.Profiler) {
    profiler = new window.Profiler({ sampleInterval: 10, maxBufferSize: 30000 });
  }

  window.addEventListener('load', () => {
    setTimeout(async () => {
      if (profiler) {
        try {
          const profile = await profiler.stop();
          encoder.addProfilerChunk(profile, profiler.sampleInterval);
        } catch (e) {}
      }

      const bytes = await encoder.finish();
      // navigator.sendBeacon('/rum', bytes);
      console.log('Captured rumcap size (bytes):', bytes.byteLength);
    }, 1000);
  });
</script>
```

## Interactive Samples

You can see how these views come together by trying out these sample captures in the Waterfall Tools viewer (all captured at 6x CPU throttling to show more interesting events):

- [cnn.com](https://waterfall-tools.com/?src=https%3A%2F%2Ffiles.patrickmeenan.com%2Fwt%2Fchrome-www-cnn-com-cpu6x.rcap)
- [Vercel's v0 landing page](https://waterfall-tools.com/?src=https%3A%2F%2Ffiles.patrickmeenan.com%2Fwt%2Fchrome-v0-app-cpu6x.rcap)
- [Etsy](https://waterfall-tools.com/?src=https%3A%2F%2Ffiles.patrickmeenan.com%2Fwt%2Fchrome-www-etsy-com-cpu6x.rcap)
- [Google Finance](https://waterfall-tools.com/?src=https%3A%2F%2Ffiles.patrickmeenan.com%2Fwt%2Fchrome-www-google-com-cpu6x.rcap)

## Open Source & Libraries

All parts of both projects are free, open-source, with Apache 2.0 licenses and available on GitHub and npm:

- **rumcap**: Available on [GitHub](https://github.com/pmeenan/rumcap) and [npm](https://www.npmjs.com/package/rumcap).
- **waterfall-tools**: Available on [GitHub](https://github.com/pmeenan/waterfall-tools), [npm](https://www.npmjs.com/package/waterfall-tools), and via the live web application at [waterfall-tools.com](https://waterfall-tools.com/).

Feel free to play around with the tools, inspect your own pages, and share your feedback on GitHub (issues and PR's happily accepted)!
