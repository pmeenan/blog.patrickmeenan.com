---
title: "How does your site stack up?"
date: 2009-06-11T08:19:00.002-04:00
originalUrl: https://blog.patrickmeenan.com/2009/06/how-does-your-site-stack-up.html
---

I pulled together the results of the tests that have been run on [WebPagetest](http://www.webpagetest.org/) over the past year and did a bunch of aggregate analysis. There were over 24,000 unique urls tested in that time so the data is a pretty wide sampling across different types of sites. You can see the full details here: [http://www.webpagetest.org/forums/thread-22.html](http://www.webpagetest.org/forums/thread-22.html)  
  
One of the particularly useful things you can do is look at your own test results and compare them in the distribution graphs to see where you land. For example, are you slower than 95% of the sites that were tested? How do the number of requests and bytes stack up? How about the optimizations?  
  
Looking at straight averages across all of the tests:  
  
Load Time: 10.1 seconds  
Time to First Byte: 1.1 seconds  
Time to Start Render: 3.8 seconds  
  
Page Size: 510 KB  
Number of Requests: 50  
Number of Redirects: 1  
  
Perhaps more interesting are observations on the distributions:  
  

Page Measurements  

  
Load Time: 35% of the sites tool longer than 10 seconds to load (and there's a pretty long tail that goes out to 60 seconds with 5% of the sites taking longer than 30 seconds). On the positive side, 33% of the sites loaded in under 5 seconds.  
  
Time to First Byte: Looked surprisingly good with 76% of sites coming in under 500ms. More confirmation that the back-end on most sites works well and the work needs to be done on the front-end (content). That said, 9% took over 2 seconds so there are some sites that still have some back-end work to do.  
  
Time to Start Render: There is a lot of room for improvement and this is probably one of the most useful measurements (and unique to Pagetest). The user doesn't see anything display before this point so it doesn't matter how fast the back-end is if there is a lot of js and css code loading in the head that prevents the page from rendering (even worse is not much code but lots of files). 60% of the sites take over 2 seconds to start rendering with 20% of the sites taking over 5. If you're going to focus on optimizing anything, this is the first number you should be looking at.  
  
Page Size: I feel sorry for anyone still using dial-up. 30% of the sites were over 500KB.  
  
Number of Requests: This is usually the most impactful measurement because most of the time in making a request is wasted and not actually downloading content so the more requests on the page the more time that is being wasted not downloading content. 33% of the sites have 50 or more requests with 12% having 100 or more (with a really scary tail out to 400).  
  
Number of Redirects: 66% of the sites had no redirects and in general things looked really good. The 2% of sites with over 8 redirects should probably look at reducing them though.  
  

Optimizations  

  
I won't go through all of them but I will hit the high points.  
  
Most sites are doing a good job with persistent connections. Only 5% of the sites are not leveraging keep-alives at all.  
  
On compression, 50% of the sites could save 50% or more of their text bytes by enabling gzip compression. This helps both the end user and saves bytes on the wire which goes directly to bandwidth costs the site owners have to pay.  
  
The biggest impact for most sites comes in combining several js and css files into a singlee file (of each type). This goes directly to the start render time and 20-30% of the sites have a large number of files to combine.  
  
The last one I'll touch on is caching of static assets. A full 25% of the sites don't use any expires or cache-control headers at all. That makes the repeat view of the site almost as slow as the first view (and makes a lot of unneeded requests to the site). If you don't want people to keep coming back, this is a sure way to encourage that :-)  
  
There are a ton of charts and a lot more data in the [full analysis](http://www.webpagetest.org/forums/thread-22.html) so if you want more information head over there. I also have an excel spreadsheet of the raw data available at the end of the analysis if you want to run any different kinds of analysis on it.