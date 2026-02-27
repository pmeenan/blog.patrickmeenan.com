---
title: "Shopping on the web from Amsterdam"
date: 2010-05-26T15:08:00.001-04:00
originalUrl: https://blog.patrickmeenan.com/2010/05/shooping-on-web-from-amsterdam.html
---

Europe is definitely a hotspot for interest in web performance ([WebPagetest](http://www.webpagetest.org/test) sees almost as much traffic from there as the US).  A huge "thank you" goes out to [Aaron Peters](http://www.aaronpeters.nl/en/) who volunteered to expand our European testing footprint with a location in Amsterdam.  
  
For an inaugural run, he ran some tests of the top online merchants in The Netherlands (according to [Twinkle magazine](http://twinklemagazine.nl/)) and from the looks of it there's quite a market need for [Web Performance Optimization](http://www.stevesouders.com/blog/2010/05/07/wpo-web-performance-optimization/) experts in the area.  
  
(click on any of the urls to go to the test results for that page)  
  
[thomascook.nl](http://www.webpagetest.org/result/100525_c1c7e6af35d11e62f62a91c234f0c441/) - wow!  poster-child material.  Failures across the board with no persistent connections, caching, compression, nothing.  It's actually amazing that it managed to load in 12 seconds at all.  
  
[www.wehkamp.nl](http://www.webpagetest.org/result/100525_75cfe22d14d3404b878fa8cb5bc67bb3/) - Non too bad on the standard things but a crazy number of javascript and css files in the head (and no caching) so a pretty poor user experience.  A couple of tweaks could cut the load time in half and significantly speed up the start render time.  
  
[www.arke.nl](http://www.webpagetest.org/result/100525_e028dd52e367d987d7c5527ddd4b1fc1/) - Apparently caching is passé - yet another site that doesn't like to use expires headers but what really surprised be was the 222KB of css that is being delivered without any compression.  Both the sheer amount of CSS and the fact that it isn't compressed are pretty scary.  
  
[www.bol.com](http://www.webpagetest.org/result/100525_e34d1d56d69b465be0ad5c8b32549e16) - Pretty much just got the keep-alives right.  No compression, no caching, and a bunch of js/css files that need to be merged.  
  
[www.transavia.com](http://www.webpagetest.org/result/100525_7596458abe85f3bdc79abf68d6c0f220/) - Yay, someone is actually compressing their javascript!  Just a shame they have so much of it (150KB compressed) and in so many different files and wow, a 209KB png that should easily be an 8-bit (and MUCH smaller image).  
  
[www.oad.nl](http://www.webpagetest.org/result/100525_6af7403ebbe86a6c576e152657c8d18b/) - And now we're back to the really low bar of failures across the board (including persistent connections) and a couple of 404's for good measure.  
  
[www.dell.nl](http://www.webpagetest.org/result/100525_7027cdaa97ef0908a1e85f2df7fc237c/) - Dell did a reasonable job (though to be fair, it's probably a global template) and it's not a very rich landing page but they could still get quite a bit of improvement with image sprites and delaying the javascript.  
  
[www.cheaptickets.nl](http://www.webpagetest.org/result/100525_2f66eb6a06b6ad430de9f84f2bb10e4a/) - Do I sound like a broken record yet?  Other than persistent connections - epic fail!  
  
[www.d-reizen.nl](http://www.webpagetest.org/result/100526_e5dc9c92759d26dab982084a0f921584/) - In DESPERATE need of some [SpriteMe](http://spriteme.org/) love (in addition to the usual suspects).  
  
  
The sad part is that with just a couple of minutes of work every one of these sites could load in half the time and present a MUCH better user experience.  We've already seen time and time again that conversions, sales, etc all increase substantially with improved page performance and as I see over and over again, the vast majority of sites aren't even taking the five-minutes to handle the absolute basics (most of which can be done just with configuration changes).