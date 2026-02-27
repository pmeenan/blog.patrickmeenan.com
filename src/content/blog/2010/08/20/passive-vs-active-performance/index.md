---
title: "Passive vs Active performance monitoring"
date: 2010-08-20T15:09:00.000-04:00
originalUrl: https://blog.patrickmeenan.com/2010/08/passive-vs-active-performance.html
---

One of the things that has always bothered me about actively monitoring a site's performance (hitting it on a regular interval from an automated browser) is that you are only getting results for the specific page(s) you are monitoring from the locations and browsers you are using for the monitoring.  To get better coverage you need to do more testing which increases the amount of artificial traffic hitting your site (and still ends up not being a very realistic coverage of what your end users are seeing).  
  
Passive monitoring on the other hand involves putting a beacon of some kind on your page that reports the performance of every page that every visitor loads (without artificial traffic).  You get complete coverage of what real users are doing on your pages and what their real experiences are.  
  
There are some real benefits to active testing, particularly the controlled environment which produces consistent results (while passive monitoring requires a lot of traffic otherwise individual user configurations will skew the results on a given day).  Active monitoring also gives you a wealth of information that you can't get from field data (information on every request and details on exactly what is causing a problem).  
  
Active testing is easier - you just find a company that offers the service, subscribe and start receiving reports and alerts.  For passive monitoring you need to instrument your pages and build the infrastructure to collect and analyze the results (or find a company that will do it for you but then you are potentially adding another external [Frontend SPOF](http://www.stevesouders.com/blog/2010/06/01/frontend-spof/) to your page). [Boomerang](http://yahoo.github.com/boomerang/doc/) is a great place to start for passive monitoring but you still need the reporting infrastructure behind it.  
  
Can we do better?  Would something like a mix of passive and active monitoring work better where active tests are initiated based on information collected from the passive monitoring (like the top pages for that day or pages that are showing slower or faster performance than "normal")?  
  
Several people have asked for [WebPagetest](http://www.webpagetest.org/) to be able to do recurring, automated testing and I'm debating adding the capability (particularly for private instances) but I'm not convinced it is the right way to go (for performance, not availability monitoring). Is the amount of artificial traffic generated (and testing infrastructure) worth it?  Are the results meaningful on a regular basis or will it just end up being another set of reports that people stop paying attention to after a week?  
  
I'd love to hear from other users on how they monitor their sites and what they have found that works well so shoot some comments back and lets get a discussion on it going.