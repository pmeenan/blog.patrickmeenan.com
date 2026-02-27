---
title: "Help make the web a faster place"
date: 2008-07-09T15:52:00.006-04:00
originalUrl: https://blog.patrickmeenan.com/2008/07/help-make-web-faster-place.html
---

Back on June 24th [Eric Goldsmith](http://www.ericgoldsmith.com/) presented [pagetest](http://www.webpagetest.org/) at the [Velocity conference](http://en.oreilly.com/velocity2008/public/content/home). It was well received and he learned some critical presentation lessons (the most important being not to put up an url for something you're going to demo on the first slide with an audience full of geeks with laptops). See if you can identify the traffic spike from the conference presentation:  
  
  
Normally something like 3000 page views wouldn't be a problem but there were a few hundred tests initiated all within the 30 minutes of the presentation window and each test takes close to a minute to complete (though several can be run in parallel). Hopefully people were patient because the queue did clear within an hour or so but there was quite a backlog for a while. I'll be adding a little ajax to the page to at least give people an indication of how many tests are ahead of them in the queue and set some expectations for how long the results will take.  
  
As you can see, the traffic has maintained a boost after the conference and seems to be spreading more by word of mouth and blogs. It also looks like there are a fair number of die-hard users actively tweaking their pages. One interesting thing to browse is the [test history](http://pagetest.patrickmeenan.com:8080/testlog.html#end) link from the main page where you can see what tests were run for various pages. Some look to be pretty well optimized and are testing various options and some are hideous (even some really high-profile sites).  
  
I'm also fairly impressed by the variety of locations that testing is coming from (particularly given that it's all in English):  
  
  
  
Finally, on the short-list for upcoming features is better png optimization checking. We're going to be embedding optiPng into pagetest and providing byte-size improvements like we do with jpeg and gzip compression.