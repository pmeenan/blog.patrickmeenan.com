---
title: "Optimization impact"
date: 2009-05-05T15:03:00.010-04:00
originalUrl: https://blog.patrickmeenan.com/2009/05/optimization-impact.html
---

As I look through the tests that come through [WebPagetest](http://www.webpagetest.org/) I've been wondering if all of the optimization checks really make sense or if we should really be focusing on just the top 3 or 4 things that have the largest impact and not worrying about the smaller things. A LOT of the pages I see come through don't even have the basics in place and they may be overwhelmed by the checklists, etc (and by the time you start worrying about a few bytes from cookies, that may not be the real bottleneck for your site and you may be wasting optimization time).  
  
This was particularly tweaked as YSlow 2 was released and added more automated checks from the [34 best practices](http://developer.yahoo.com/performance/rules.html). Are people going to be trying for an A and over-optimizing or optimizing the wrong part of their site? Are people at the beginning of the curve going to be overwhelmed about what they have to do and miss the opportunity for a large payoff for minimal effort?  
  
Ryan Doherty wrote a really good article where he did a step-by-step optimization of a fake social network portal in "[Optimizing openSpaceBook](http://www.ryandoherty.net/2008/10/12/optimizing-openspacebook/)". He did miss persistent connections and I'd argue that even minifying probably wasn't necessary but he hit the big hitters and documented the improvement from each. I decided to take that framework and walk through optimizing a real-world site going through the steps from easiest to implement to the most difficult and just focusing on the changes that would result in large gains.  
  
My proposed optimization path that everyone should take at a minimum (and that should be universally beneficial) is:  

1.  Enable Persistent Connections: This is a simple configuration setting on most web servers, requires no changes to the site and has almost no risk (the only risk is if you are running a site at close to capacity you may not be able to keep the connections open for long).
2.  Properly Compress your Content: This includes both gzipping your html/javascript/css and properly compressing your images (jpegs can often be saved at a lower quality with no sacrifice in quality - we use Photoshop quality level 50 as the baseline at AOL). For the gzip compression it is again usually just a matter of configuration on the web server to enable it. If you pay for bandwidth this can also save you real money on hosting costs.
3.  Allow the Browser to Cache your Static Content: Now we're starting to stray into possibly requiring code changes and this won't have any impact on the initial load time bot for repeat visits the savings can be significant.
4.  Reduce the Number of HTTP Requests: This one is a bit more ambiguous but the most important cases for this are to collapse your CSS and JS down to a single file of each and to use image sprites for your page element graphics. This definitely requires more work than the other 3 optimizations but the payoff is usually well worth it.

I'd argue that these 4 optimizations will get you 90+% of the improvement for most of the sites and anything left is going to be very specific to each individual site (javascript optimizations, etc).  
  
I decided to take a corporate portal and walk through an optimization exercise much like Ryan did to see what the benefit was for each step. It didn't take long to find one that was in pretty bad shape - I decided to look at a portal for a national web design company and it turns out that their home page pretty much failed everything except for the persistent connections so I cloned their site, broke the persistent connections and started optimizing.  
  
First, the baseline - With everything broken I measured the site and this is what it looked like:  
  

First View

  
  
  

Repeat View

  
If you ever see one of your repeat view waterfalls with a lot of yellow on it it means you REALLY need to do a better job of letting the browser cache your page. All of those requests are wasted round trips.  
  
And the numbers from the baseline:  

Load Time

Start Render

Requests

Bytes In

First View

18.446s

8.174s

87

500 KB

Repeat View

13.176s

7.281s

87

20 KB

  
You'll notice that the repeat view is not much faster than the first view even though it only downloads 20KB of data - that's because of the 87 requests which are really slowing things down.  
  
  
Step 1: Enable Persistent Connections (keepalives)  
  
A quick tweak to the Apache configuration to turn on the keepalives and we eliminate one round trip from each of the requests. The waterfall essentially looks the same, just without the little orange bits at the beginning of each request but look at what happened to the times:  

Load Time

Start Render

Requests

Bytes In

First View

10.591s

4.922s

87

503 KB

Repeat View

7.431s

4.336s

87

23 KB

  
That's close to a 50% improvement in load times with 5 minutes worth of work and NO changes to the page itself.  
  
  
Step 2: Compression  
  
Again, just a quick tweak to the Apache configuration to enable gzip compression and re-compress a few of the jpeg images and we get:  

Load Time

Start Render

Requests

Bytes In

First View

9.698s

4.610s

87

354 KB

Repeat View

7.558s

4.351s

87

26 KB

  
We got another second or so in first view times and saved 150KB of bandwidth for the site. This particular page did not have a lot of text or javascript and the images were already in pretty good shape so the improvement wasn't as big as it would be on several sites I have seen but the effort required is minimal and there is no downside to doing it.  
  
  
Step 3: Cache Static Content  
  
This will not have any impact on the first view performance but if users ever come back to your site it can have a huge impact on the performance of your site. We are starting to cross the line into "may require some application work" though to make sure it is safe for your static assets to be cached for long periods. If so, then actually enabling it is again just a configuration setting on the server.  
  
Here is what the waterfall looks like for the repeat view after we let the browser cache everything:  
  
There are only 2 requests (and one of those is generated by javascript and canceled right away). More importantly, here are what the times look like:  

Load Time

Start Render

Requests

Bytes In

First View

9.751s

4.533s

87

361 KB

Repeat View

0.788s

0.753s

2

0 KB

  
As expected, no impact to the first view times, but the repeat view times got 90% faster.  
  
  
Step 4: Reduce the number of HTTP requests  
  
Now we're finally into the realm of having to do actual development work on the page. This page only had a few javascript files (5) but there were a TON of individual images for the various page elements. Combining the javascript and css files is a pretty trivial effort (and there are even modules that can do it for you). Changing the page to use image sprites instead of discrete images is a lot more work but WELL worth it (best if you can just plan to do this before you build a site but also worth it when retrofitting).  
  
Here is what the waaterfall looked like after combining the files together:  
  
  
And the numbers:  

Load Time

Start Render

Requests

Bytes In

First View

3.910s

1.079s

15

344 KB

Repeat View

0.773s

0.819s

2

0 KB

  
That's another 60% improvement in the first view times (and I only did the easy combining - it could have been refined even more).  
  
  
Wrap-Up  
  
As you can see, with just 4 core rules you can take a page from 18 seconds to load all the way down to 4 seconds (an 80% improvement). If that doesn't demonstrate the 80/20 rule, I don't know what does. Are the other best practices worth implementing/checking? I'd strongly content that it's good to know them but once you actually implement even these 4 basic rules you're either going to be fast enough or you're going to be doing some more advanced testing and analysis to see what is making the site slow (probably by manually looking at the waterfalls and looking for the bottlenecks).  
  
I'm not making any changes yet but I'm strongly considering changing the checklist on WebPagetest to focus on these 4 rules as critical to implement and then provide the other details more as informational checks but not present them as prominently as they currently are.  
  
Thoughts? Leave a comment here or discuss them in the [WebPagetest Forums](http://www.webpagetest.org/forums/)