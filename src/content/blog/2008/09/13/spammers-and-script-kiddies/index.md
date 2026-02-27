---
title: "Spammers and Script Kiddies"
date: 2008-09-13T18:09:00.003-04:00
originalUrl: https://blog.patrickmeenan.com/2008/09/spammers-and-script-kiddies.html
---

Sigh, webpagetest.org apparently got some visibility somewhere in the spam and script kiddie/vulnerability scanner communities.  
  
A week or so ago I started getting some "link spam" where a group of people had automated bots to kick off "tests" of their link farms. All of the hyperlinks out from webpagetest are "nofollow" links though so I'm still not sure what they hoped to gain from it. ModSecurity to the rescue and I have all of the current spam attempts locked down and cleared out the previous runs from the history.  
  
Then today it looks like I started getting some activity from some automated compromise scans. The access logs were starting to get all sorts of bizarre requests that weren't legit, some coming from the same source IP, some from bot nets. They weren't successful since webpagegtest is completely custom code but it is on a shared host with a joomla board that I run for my neighborhood which is probably what made them try to compromise it (again, good old ModSecurity and latest patches to keep things safe).  
  
It does make me question the benefit of using public libraries though. All it takes is a vulnerability in a version of the library and everyone who used it can get compromised pretty quickly (and it gets added to the script kiddie scanners prpetty quick). At least with custom code, someone would have to be explicitly targeting your site to compromise it which unless you're running a high-profile site it's a lot less likely (in which case you also have a team responsible for keeping things secure).  
  
I honestly don't see how sites run by amateurs survive (well, they probably don't which is why there are so many compromised hosts out there being used for staging attacks). I was debating adding forum support directly to the webpagetest host but at this point it's probably not worth the effort and risk since those are usually swiss cheese on security.  
  
Anyway, if you get a 403 "Access Denied" message when you're trying to do something, just shoot me a note. It's probably because I tightened down the screws a little too tight and caught you by accident.