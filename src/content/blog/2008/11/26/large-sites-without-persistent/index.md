---
title: "Large sites without persistent connections"
date: 2008-11-26T19:57:00.005-05:00
originalUrl: https://blog.patrickmeenan.com/2008/11/large-sites-without-persistent.html
---

Sort of as a follow-up to the last article, over the last couple of days there were some particularly interesting sites that are just failing horribly:  
  
Verizon's DNS error hijack - Verizon recently decided to start monetizing fat-fingered urls by taking over DNS failures and redirecting them to a search page. I'm using their default DNS servers (for now) for the online pagetest so some tests of invalid urls have returned the Verizon search page which ends up being a great example of a page that should be WAY faster than it is. Here are the full results of a test run I kicked off on purpose: [http://performance.webpagetest.org:8080/result/PX8/](http://performance.webpagetest.org:8080/result/PX8/)  
  
They fail pretty horribly for not using persistent connections but it's also a perfect example for image sprites and the html and css aren't gzipped either. The whole thing really should have been done in 2 or 3 requests and could be completely loading in under a second instead of a little over 3. None of those images have an expires header either so even repeat views take just as long.  
  
Yahoo Japan - This one is mostly interesting because Yahoo is notoriously good at site optimization but somehow they seem to have missed the Japanese portal. They do pretty good on everything except for the persistent connections and gzip. Here are the full results: [http://performance.webpagetest.org:8080/result/PXA/](http://performance.webpagetest.org:8080/result/PXA/)  
That js is particularly bad as it's 85KB but can be reduced to 22 with gzip but the biggest crime is the persistent connections. They could cut the load time almost in half just by enabling persistent connections.