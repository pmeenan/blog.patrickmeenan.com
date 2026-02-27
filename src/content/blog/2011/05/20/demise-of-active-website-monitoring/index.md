---
title: "The Demise of Active Website Monitoring"
date: 2011-05-20T13:57:00.000-04:00
originalUrl: https://blog.patrickmeenan.com/2011/05/demise-of-active-website-monitoring.html
---

It hasn't happened yet but it's a question of _when_, not _if_ active monitoring of websites for availability and performance will be obsolete.  My prediction is that it will happen in the next 5 years though if everything lines up it could be as soon as 2 years away.  
  
By **active monitoring** I am referring to testing a website on a regular interval and potentially from several locations to see if it is working and how long it takes to load (and bundled in with that the alarming, reporting, etc. that goes with it).  
  
Active monitoring has some pretty strong benefits over any alternatives right now:  

*   Rich debugging information (resource-level timing, full access to headers and network-level diagnostics)
*   Consistency - the test conditions do not vary from one test to the next so there is minimal "noise"
*   Predictability - you control the frequency and timing of the tests
*   Low-latency alerting - you can get notified within minutes of an event/issue (assuming it is detected)

But it's not all sunshine and roses:  

*   You only have visibility into the systems/pages that you test (which is usually a TINY fraction of what your users actually use)
*   It's expensive.  You usually end up picking a few key pages/systems to monitor to keep costs under control
*   The more you test, the more load you put on the systems you are monitoring (capacity that should be going to serve your users)
*   You can only test from a "representative" set of locations, not everywhere your users actually visit from.  This may not seem important if you only serve content from one location, but do you use a CDN?  Do you serve ads or use 3rd-party widgets that are served from a CDN?  If so then there is no way that you are actually able to test every path your users use to get your content
*   The performance is never representative of what the users see.  Usually monitoring is done from backbone connections that are close to CDN POPs.  Even if you spring for testing on real end-user connections ($$$$) you have to pick a small subset of connection types.  You users visit from office connections, home ISP connections, mobile, satellite and over various different connections even within the house.

**So, none of this is new, why now and what is going to replace it?**  
  
There are several different advances that are converging that will make it possible to collect, report and act on REAL end user data (**R**eal **U**ser **M**onitoring - RUM).  There are several issues with using data from the field but between advances in the browsers and Big Data they are on the verge of being solved:  
  
First off, getting the rich diagnostic information from the field.  Monitoring is useless if you can't identify the cause of a problem and historically you have had very little insight into what is going on inside of a browser.  That all started to change last year when the [W3C Web Performance Working Group](http://www.w3.org/2010/webperf/) formed.  They are working on defining standards for browser to expose rich diagnostic/timing information to the pages.  The first spec that has been implemented is the [Navigation Timing](http://w3c-test.org/webperf/specs/NavigationTiming/) standard which exposes information at a page-level about the timings of various browser actions.  The Navigation Timing spec has already been implemented in IE9 and Chrome and will be coming soon in the other major browsers.  Even more interesting will be the [Resource Timing](http://w3c-test.org/webperf/specs/ResourceTiming/) standard which will expose information about every resource that is loaded.  
  
HTML5 also opens up the possibility to store data in local storage in the case where a failure can't be reported (to allow for it to be reported later) and for pages that leverage the Application Cache you can even run completely offline and detect failures to reach the site in the first place.  
  
OK, so we will be able to get the rich diagnostics from the field (and collect data from the real user sessions so you get coverage on everything the users do on your site, from everywhere they visit, etc) - that's a lot of data, what do you do with it?  
  
Big Data to the rescue.  Data storage and analysis for huge data sets has started to explode.  Primarily driven by [hadoop](http://hadoop.apache.org/) but there are tons of commercial companies and services entering the space.  It's already possible to store, process and analyze petabytes (and more) very efficiently and things are only going to improve.  We are quickly evolving towards a world where we _collect everything_ and then slice and dice it later.  That's pretty much exactly what you need to do with field data to investigate trends or dig into issues.  
  
**Why 2-5 years and not now?**  
  
Adoption. Browsers that support the new standards will take a while to reach critical mass (and the Resource timing spec isn't defined yet).  There are also no services or toolkits yet that do good field monitoring so it will take a while for those to evolve and mature.   
  
I'm curious to see if the traditional beacon services (omniture, comscore, etc) step into this space, if the traditional monitoring providers adapt or if a new breed of startups catches them all off guard.  I am a little surprised that most of the participation in the standards process is coming from the browser vendors themselves trying to anticipate how the data would be used - I'd expect to see more of the monitoring services playing an active role if it was on their radar.