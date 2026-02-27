---
title: "2010 State of Optimization - The Short Version"
date: 2010-12-01T17:02:00.000-05:00
originalUrl: https://blog.patrickmeenan.com/2010/12/2010-state-of-optimization-short.html
---

Stoyan's (always excellent) [Performance Calendar](http://calendar.perfplanet.com/2010/) went live today with an [article I provided](http://calendar.perfplanet.com/2010/the-state-of-web-performance-optimization-2010/) looking at the state of performance optimization in 2010 compared to 2008 (based on the tests run on [WebPagetest](http://www.webpagetest.org/)).  I highly recommend reading the article when you get a chance - there's lots of data and graphs.  One thing that struck me was how poorly even the most basic optimizations were being followed.  I thought it would be interesting to summarize it all into a single easy-to-understand table. So, without further ado....  
  
**Percent of sites that got a passing grade for the basic optimization checks:**  
  

Optimization

Percent of pages with a passing grade (2010)

Keep-alive Enabled

85%

Compress Text

43%

Compress Images

39%

Cache Static Content

15%

Combine JS/CSS

47%

CDN Usage

12%

  
These aren't the advanced optimizations - they're the most basic. Only 15% of pages are effectively leveraging the browser cache! (and "passing" is pretty generous here - a score of 80 or better).