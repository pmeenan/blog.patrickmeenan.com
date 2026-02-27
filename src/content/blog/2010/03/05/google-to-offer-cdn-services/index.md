---
title: "Google to offer CDN services?"
date: 2010-03-05T16:32:00.000-05:00
originalUrl: https://blog.patrickmeenan.com/2010/03/google-to-offer-cdn-services.html
---

Sadly no, not that I'm aware of but it would make total sense and maybe if there is enough interest they would consider it.  This is one of those "wouldn't it be nice if..." posts but there is also a fair bit of thought that went into the how's and why's.  
  
Google has been pushing to make the web faster on various fronts from [Chrome](http://www.google.com/chrome) to [SPDY](http://www.chromium.org/spdy/spdy-whitepaper) to [Page Speed](http://code.google.com/speed/page-speed/) to [Google DNS](http://googleblog.blogspot.com/2009/12/introducing-google-public-dns.html) and have been saying that they would like the Internet to be as [fast as turning the pages in a magazine](http://code.google.com/speed/).  Once you get past a lot of the optimizations, there really is no way around the problem - to get faster you need to use a CDN for static content because the speed of light isn't getting any faster and it doesn't matter how fast your Internet connection is, the real performance killer is latency.  
  
I've thought a fair bit about how I think they could do it and it should fit really well into their model as well as their suite of offerings.  I'm thinking they could offer a zero-config version that looks a lot like how [coral cache](http://www.coralcdn.org/) works.  Basically just prepend .cdn.google.com with your origin and the traffic would go through Google's CDN (www.webpagetest.org.cdn.google.com for example).  That way everything needed to fetch the origin content is already embedded in the request and the site owner doesn't need to do anything.  For custom urls they could make it part of Google apps and let you configure custom CNAME's and origin servers.  
  
From an infrastructure perspective it really doesn't get any easier than that (assuming you're not trying to bill people for bandwidth utilization and storage).  They'd obviously need to put some protections in place to prevent it from turning into a massive download farm (limit mime types and file sizes?).  Most  CDN providers are trying to focus on the more lucrative "bits" anyway (streaming, etc) so taking away the static content portion of the market wouldn't completely obliterate the market and it would probably be the single most impactful thing they could do to speed up the web at large.  
  
There would also be other benefits that may not be as obvious.  They could get significantly more bang by deploying SPDY if they also owned the other end of the connection for a lot of the requests (so anything going through the Google CDN would be significantly faster in chrome).  It also seems like a much more cost-effective strategy than [laying fiber in communities](http://www.google.com/appserve/fiberrfi)  and would be a perfect fit for their current application model (basically just a software deployment and it would work).   
  
Just like with Google Analytics I expect there would be a huge number of sites that would switch over and start using it and by having a standard way to do it I would expect to start seeing things like Wordpress plugins that automatically servs all of your static content through the Google CDN making it an automatic speed-up.  
  
Other than the obvious elephant in the room around the costs and infrastructure to run it, am I missing something?  It really should be that easy and voila - faster web for everyone.