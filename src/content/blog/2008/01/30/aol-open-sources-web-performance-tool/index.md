---
title: "AOL Open sources web performance tool"
date: 2008-01-30T16:28:00.000-05:00
originalUrl: https://blog.patrickmeenan.com/2008/01/aol-open-sources-web-performance-tool.html
---

For my inaugural post I wanted to point out a tool that AOL has not only released to the public but fully open sourced. I'm particularly excited because I wrote it but I think it also has the potential to be really useful for a large portion of the community (and it has some really cool things going on under the covers that I will talk about in future posts).  
  
The tool is [Pagetest](http://pagetest.sourceforge.net/) and it is similar in a lot of ways to portions of Firebug and YSlow but for Internet Explorer (and there are no other tools available for free at this time for IE that do the same things which is why we built it and released it in the first place). This was pretty critical for us as Firefox has a fanatical following with developers (for good reason with all of the developer-related plugins) but it's market share for our actual user base is quite low so we needed to provide the developers with the real end-user view of their pages.  
  
What it does:  

*   Provides a visual waterfall display of the various components of the page loading, including DNS lookup, Socket Establishment, Request time and the actual content download (similar to the Firebug "net" display but with more detail
*   Analyzes the requests and provides a visual optimization checklist as well as a report of what should be looked at to improve performance (similar to YSlow but based on the actual requests and with slightly different guidelines)
*   Allows for viewing all of the request and response headers for each request  
    
*   Can be used in a "desktop mode" where you test a page manually or can be automated with all of the reports and details saved out in a format suitable for databasing (more on this to come as the automation tools were also open sourced with pagetest, just not in binary form yet)
*   Has a scripting engine and language for automated testing of complex products (like webmail)  
    

The desktop version is helpful enough as it is but when you hook up the automation capabilities with a web front-end you get an even more powerful tool that lets people on any platform and any browser submit an url to be tested and it will return the results - expect to see a public version of this launched shortly.  
  
On the coding side, some of the things that it includes that I'll try to blog about in the near future:  

*   A class (CApiHook) that makes IAT hooking of dll exports a trivial task (used to hook winsock, wininet and a few specific routines)
*   Winsock hooking which gives you all of the capabilities of a Layered Service Provider (LSP) but without the headaches of it being system-wide so you only have to worry about implementing the necessary hooks for the process you are targeting
*   WinInet hooking
*   Crash survival - something we've used in several of our end-user products but this takes it to a whole new level

There is a whole lot more to this release than what you see on the surface so pay attention and I'll try to point most of them out. Hopefully this is also the start of us being more public-facing with some of our internal efforts around web performance.