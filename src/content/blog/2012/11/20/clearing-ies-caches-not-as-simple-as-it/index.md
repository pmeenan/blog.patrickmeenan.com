---
title: "Clearing IE's Caches - Not as simple as it appears"
date: 2012-11-20T10:26:00.002-05:00
originalUrl: https://blog.patrickmeenan.com/2012/11/clearing-ies-caches-not-as-simple-as-it.html
---

I've spent the last week or so getting the IE testing in WebPagetest up to snuff for IE 10.  I didn't want to launch the testing until everything was complete because there were some issues that impacted the overall timings and I didn't want people to start drawing conclusions about browser comparisons until the data was actually accurate.  
  
The good news is that all of the kinks have been ironed out and I will be bringing up some Windows 8 + IE 10 VM's over the Thanksgiving holidays (have some new hardware on the way because the current servers are running at capacity).  
  
In the hopes that it helps other people doing browser testing I wanted to document the hoops that WebPagetest goes through to ensure that "First View" (uncached) tests are as accurate as possible.  

## Clearing The Caches

It's pretty obvious, but the first thing you need to make sure you are doing when you are going to do first view tests is to clear the browser caches.  In the good old days this pretty much just meant the history, cookies and object caches but browsers have evolved a lot over the years and they store all sorts of other data and heuristic information that helps them load pages faster and to properly test first view page loads you need to nuke all of them.  

  

For Chrome, Firefox and Safari it is actually pretty easy to clear out all of the data.  You can just delete the contents of the profile directory which is where each browser stores all of the per-user data and you essentially get a clean slate.  There are a few shared caches that you also want to make sure to clear out:

  

**DNS Cache** - WebPagetest clears this by calling DnsFlushResolverCache in dnsapi.dll and falling back to running "ipconfig /flushdns" from a shell.

  

**Flash Storage** - Delete the "\\Macromedia\\Flash Player\\#SharedObjects" directory

  

**Silverlight Storage** - Delete the "\\Microsoft\\Silverlight" directory

  

That will be enough to get the non-IE browsers into a clean state but IE is a little more difficult since it is pretty tightly interwoven into the OS as we [learned a few years back](http://en.wikipedia.org/wiki/United_States_v._Microsoft).

  

The first one to be aware of is the OS certificate store.  Up until a few months ago WebPagetest wasn't clearing that out and it was causing the HTTPS negotiations to be faster than they would be in a truly first view scenario.  On Windows 7, all versions of IE will do CRL and/or OCSP validation of certificates used for SSL/TLS negotiation.  That validation can be EXTREMELY expensive ( several round trips for each validation) and the results were being cached in the OS certificate store.  This made the HTTPS performance in IE appear faster than it really was for true first view situations.

  

To clear the OS certificate stores we run a pair of commands:

  

certutil.exe -urlcache \* delete

certutil.exe -setreg chain\\\\ChainCacheResyncFiletime @now

  

IE 10 introduced another cache where it keeps track of the different domains that a given page references so it can pre-resolve and pre-connect to them (Chrome has similar logic but it gets cleared when you nuke the profile directory).  No matter how you clear the browser caches (even through the UI), the heuristic information persists and the browser would pre-connect for resources on a first view.

  

When I was testing out the IE 10 implementation the very first run of a given URL would look as you would expect (ignore the really long DNS times - that's just an artifact of my dev VM):

  

[![](http://www.webpagetest.org/thumbnail.php?test=121115_EK_e2ef9c54bb4a0600f13729ca28f48908&run=1&file=1_waterfall.png)](http://www.webpagetest.org/thumbnail.php?test=121115_EK_e2ef9c54bb4a0600f13729ca28f48908&run=1&file=1_waterfall.png)

  

But EVERY subsequent test for the same URL, even across manual cache clears, system reboots, etc would look like this:

  

[![](http://www.webpagetest.org/thumbnail.php?test=121115_EK_e2ef9c54bb4a0600f13729ca28f48908&run=3&file=3_waterfall.png)](http://www.webpagetest.org/thumbnail.php?test=121115_EK_e2ef9c54bb4a0600f13729ca28f48908&run=3&file=3_waterfall.png)

  

That's all well and good (great actually) for web performance but a bit unfortunate if you are trying to test the uncached experience because DNS, socket connect (and I assume SSL/TLS negotiation) is basically free and removed from the equation.  It's also really unfortunate if you are comparing browsers and you're not clearing it out because it will be providing an advantage to IE (unless you are also maintaining the heuristic caches in the other browsers).

  

Clearing out this cache is what has been delaying the IE 10 deployment on WebPagetest and I'm happy to say that I finally have it under control.  The data is being stored in a couple of files under "\\Microsoft\\Windows\\WebCache".  It would be great if we could just delete the files but they are kept persistently locked by some shared COM service that IE leverages.

  

My current solution to this is to terminate the processes that host the COM service (dllhost.exe and taskhostex.exe) and then delete the files.  If you are doing it manually then you also need to suspend the parent process or stop the COM+ service before terminating the processes because they will re-spawn almost immediately.  If anyone has a better way to do it I'd love feedback (the files are mapped into memory so NtDeleteFile doesn't work either).

  

## Browser Initialization

Once you have everything in a pristine state with completely cleared profiles and caches you still have a bit more work to do because you want to test the browser's "first view" performance, not "first run" performance.  Each of the browsers will do some initialization work to set up their caches for the first time and you want to make sure that doesn't impact your page performance testing.  

  

Some of the initialization happens on first access, not browser start up so you can't just launch the browser and assume that everything is finished.  WebPagetest used to start out with about:blank and then navigate to the page being tested but we found that some browsers would pay a penalty for initializing their caches when they parsed the first HTML that came in and they would block.  I believe Sam Saffron was the first to point out the issue when Chrome was not fetching sub-resources as early as it should be (on a page where the head was being flushed out early).  In the case of the IE connection heuristics it would also pay a particularly expensive penalty at the start of the page load when it realized that I had trashed the cache.

  

In order to warm up the various browser engines and make sure that everything is initialized before a page gets tested WebPagetest navigates to a custom blank HTML page at startup.  In the WebPagetest case that page is served from a local server on the test machine but it is also up on webpagetest.org: [http://www.webpagetest.org/blank.html](http://www.webpagetest.org/blank.html) if you want to see what it does.  It's a pretty empty html page that has a style and a script block just to make sure everything is warmed up.

  

## Wrap-up

Hopefully this information will be helpful to others who are doing browser performance testing.  

  

You should also be careful taking browser-browser comparisons as gospel.  As you can see, there are a lot of things you need to do to get to an apples-to-apples comparison and even then it isn't necessarily what users experience.  Browsers are adding more heuristics, pre-connecting and even pre-rendering of pages into the mix and most of the work in getting to a clean "first view" defeats a lot of those techniques.