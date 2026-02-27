---
title: "Testing for Frontend SPOF"
date: 2011-10-11T14:30:00.000-04:00
originalUrl: https://blog.patrickmeenan.com/2011/10/testing-for-frontend-spof.html
---

Steve Souders had a great [blog post](http://www.stevesouders.com/blog/2010/06/01/frontend-spof/) last year that talked about Frontend Single Points Of Failure (SPOF).  Given the continuing rise in 3rd-party widgets on pages it is becoming increasingly important and I realized that there weren't any good tools for testing for it.  Seemed like the perfect opportunity to piece something together so that's exactly what I did.  
  
**Testing for Frontend SPOF**  
  
Probably the most critical part of testing a failure of a 3rd-party widget is to make sure you get the failure mode correct.  When these things fail, the servers usually become unreachable and requests time out.  It is important to replicate that behavior and not have the requests fail quickly, otherwise you will see what your site looks like without the content but the experience won't be right (the real experience is Sooooooo much worse).  
  
I looked around for a well-known public blackhole server but couldn't find one so I went ahead and set one up (feel free to use it for your testing as well):  
  
blackhole.webpagetest.org (aka 72.66.115.13)  
  
A blackhole server is a server that can be routed to but all traffic gets dropped on the floor so it behaves exactly like we want when testing the failure mode for 3rd-party widgets.  
  
With the blackhole server up and running you can now use it for testing manually or through tools like Webpagetest.  
  
**Browsing the broken web**  
  
For the purposes of this example I'll be "breaking" the twitter, Facebook and Google buttons as well as the Google API server (jquery, etc) and Google Analytics.  
  
Now that we have a blackhole server, breaking the web is just a matter of populating some entries in your hosts file (C:\\Windows\\System32\\drivers\\etc\\hosts on windows).  Go ahead and add these entries and save the updated hosts file:  
  

  

72.66.115.13 ajax.googleapis.com     

72.66.115.13 apis.google.com         

72.66.115.13 www.google-analytics.com

72.66.115.13 connect.facebook.net    

72.66.115.13 platform.twitter.com    

  
...and go browse the web.  It shouldn't take you long to find a site that is infuriatingly painful to browse.  Congratulations, you just experienced a Frontend SPOF - now go fix it so your users don't have to feel the same pain (assuming it is a site you control, otherwise just yell at the owner).  
  
**Testing it with [WebPagetest](http://www.webpagetest.org/)**  
  
It's a lot easier to discover broken content just by browsing using the hosts file method, but if you find something and need to make the case to someone to get it fixed, nothing works better than a WebPagetest video.  
  
First, test the site as you normally would but make sure to check the "capture video" option (and it's probably not a bad idea to also give it a friendly label).  
  
Next, to capture the broken version of the site you will need to use a script (largely just copy and paste).  You need to send the broken domains to the blackhole and then visit the page you are trying to test:  
  
  

setDnsName ajax.googleapis.com blackhole.webpagetest.org

setDnsName apis.google.com blackhole.webpagetest.org

setDnsName www.google-analytics.com blackhole.webpagetest.org

setDnsName connect.facebook.net blackhole.webpagetest.org

setDnsName platform.twitter.com blackhole.webpagetest.org

navigate your.url.com

  
Just paste the script into the script box (with the correct URL to be tested), make sure capture video is checked and that you have a friendly label on the test.  
  
Finally, go look at the test history, select the tests that you ran and click compare (the history works best if you log into the site before submitting your tests).  
  
And what would be the fun in it without an example.  Here is what happens to Business Insider when Twitter goes down (yeah, THAT never happens): [http://www.webpagetest.org/video/view.php?id=111011\_4e0708d3caa23b21a798cc01d0fdb7882a735a7d](http://www.webpagetest.org/video/view.php?id=111011_4e0708d3caa23b21a798cc01d0fdb7882a735a7d)  
  
Yeah, so it's normally pretty slow but when Twitter goes down the user stares at a blank white screen for 20 seconds!  At that point, Business Insider itself may as well be down.  Luckily it can easily be solved just by loading the twitter button asynchronously.