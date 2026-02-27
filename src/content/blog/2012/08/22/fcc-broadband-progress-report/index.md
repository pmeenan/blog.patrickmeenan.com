---
title: "FCC Broadband Progress Report"
date: 2012-08-22T10:39:00.000-04:00
originalUrl: https://blog.patrickmeenan.com/2012/08/fcc-broadband-progress-report.html
---

The FCC released their [eighth broadband progress report](http://hraunfoss.fcc.gov/edocs_public/attachmatch/FCC-12-90A1.pdf) yesterday.  
The most interesting part for me is when you get to page 45 and they start talking about actual adoption (in the US), as in the speeds that people are actually subscribing to, not what is available or offered.  Their buckets aren't all that granular and the data they used to build the report comes from June 2011 but they give you a good idea of what the spread looks like:  
64.0% - At Least 768 kbps/200 kbps  
40.4% - At Least 3 Mbps/768 kbps  
27.6% - At Least 6 Mbps/1.5 Mbps  
  
Effectively that means that 36% of the households where broadband is available do not subscribe to fixed-line broadband.  If we use the 64% that subscribe to at least some form of fixed-line broadband offering we get:  
37% - Less than 3 Mbps/768 kbps  
63% - At Least 3 Mbps/768 kbps  
43% - At Least 6 Mbps/1.5 Mbps  
  
With WebPagetest's default 1.5 Mbps/768 kbps DSL profile falling in the 37% of the population it is probably hitting somewhere around the 75th percentile.  Time to increase it to something closer to the median (say switch to the 5/1 Mbps Cable)?  
I've generally been a fan of skewing lower because you will be making things faster for more of your users and you might be missing big problems if you don't test at the slower speeds but I'm open to being convinced otherwise.