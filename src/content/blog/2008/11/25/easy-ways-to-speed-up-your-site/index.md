---
title: "Easy ways to speed up your site"
date: 2008-11-25T08:00:00.005-05:00
originalUrl: https://blog.patrickmeenan.com/2008/11/easy-ways-to-speed-up-your-site.html
---

[Pagetest](http://www.webpagetest.org/) has been online for 8 months now with close to 26,000 pages tested. I generally look through the test log daily and see what the results look like and it's been pretty frustrating because a significant number of the sites being tested could easily be twice as fast without changing the content or code but I have no way to reach out to the owner and tell them. The test results are probably a bit overwhelming for most people and they don't know where to start. so, with that.....  
  
  
If you do nothing else for performance make sure you at least do these:  
  
  
Persistent Connections - There is absolutely no reason that a site should not be using persistent connections yet I see them come through testing every day. Assuming you are not using a CDN and most of the content for your page is served from your server you can get close to a 50% improvement in performance just by enabling them. Here is a sample from a test that was run recently (site chopped out to protect the innocent):  
  
  
I cropped it down but the whole site continued, opening new connections for 102 requests. The orange section of each request is the time used to open the connection and all but 2 would be eliminated just by enabling persistent connections. In this case the "start render" time (time when the user first sees something on the page) would go from 3.8 seconds down to roughly 2 seconds and the time to fully load the page would go down from 16 seconds to closer to 9 seconds. This sample was even from an Apache server so there's really no reason for not having them enabled.  
  
GZIP (aka Free Money) - Just like with the persistent connections, enabling GZIP for text responses (html, css, js) is literally just a server configuration and there is very little reason for not doing it. Early versions of IE didn't react well to JS being compressed but it's easy enough to exclude them and not a good enough reason to penalize everyone else.  
  
GZIP not only helps the end user get the pages faster but it also saves you significant bytes and if you pay for your network bandwidth, not having it enabled is throwing away free money.  
  
It's not just the small sites that have this problem either. My favorite example is [www.cnn.com](http://www.cnn.com/) which serves 523KB of uncompressed text. They could save 358KB of that just by enabling gzip compression and since most of the text for a page is all in the base page or js and css referenced in the head it all has to get downloaded before the user sees anything:  
  
The blue bars in the waterfall are where the browser isi downloading uncompressed text for CNN.  
  
Combining CSS and JS files - In case it's not obvious from the two waterfalls shown so far, it's not uncommon for a site to reference several different js and css files. There are several solutions available that will let you keep the files separate but download them all in a single request. David Artz has a pretty good write-up on mod\_concat and some of the other options [here](http://www.artzstudio.com/2008/08/using-modconcat-to-speed-up-render-start/). This does require modifying the html to reference the combined URL instead of each file individually but that is a very worthwhile effort given the massive improvement in the loading of your site.  
  
The JS and CSS files usually get downloaded before anything is shown to the user and JS in particular has a nasty habit of only being downloaded one at a time so anything you can do to reduce the number of each that you are loading will have a huge impact to the user.