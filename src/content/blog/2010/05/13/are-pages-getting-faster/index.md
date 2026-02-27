---
title: "Are pages getting faster?"
date: 2010-05-13T16:30:00.000-04:00
originalUrl: https://blog.patrickmeenan.com/2010/05/are-pages-getting-faster.html
---

Last year I did some [bulk analysis](http://www.webpagetest.org/forums/showthread.php?tid=22) on the test data from [WebPagetest](http://www.webpagetest.org/) to get a snapshot of what the distribution of results looked like.  It's about time to update the data and compare how the distributions have changed over time.  It will take a while to crunch the data and generate pretty charts but before going there I thought it would be interesting to see how individual pages have changed  over the last year...  
  
**How sites have changed over the last year**  
  
I looked for any pages that were tested in the last 4 months that also had been tested prior to 4/30/09 and it turns out there were 1279 pages with tests from both time periods.  I'll see about making the raw (anonymized) data available but the aggregate results are pretty interesting.   
  
Median values were used to eliminate the influence of pages with huge swings:  
  
**Load Time:** +0.533 s  
**Time to first byte:** +0.117 s  
**Time to start render:** +0.179 s  
  
Hmm, that's unfortunate - in aggregate, sites got slower.  
  
Given that these are sites that were tested on WebPagetest in the first place, you'd think someone was actually working on optimizing them (or they were large, popular sites that people were randomly testing - but I doubt there were 1200 of those).  
  
Let's see if we can dig into some of the page stats and see what's going on...  
  
**Page Size:** +48 KB  
**Requests:** +4  
**Connections:** +1  
**DNS Lookups:** +1  
  
Looks like in general the back-end got a little bit slower (the first byte times) and the pages got a little heavier with more requests. Nothing really surprising here but it does seem that optimization is either not keeping up with the increased richness of the pages or (more likely) optimizing the pages has not yet made it's way into the dev cycle.  
  
On the plus side, there's lots of room for improvement.