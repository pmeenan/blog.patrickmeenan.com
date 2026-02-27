---
title: "TCP and HTTP, fighting each other to bring you the web"
date: 2009-09-17T19:38:00.004-04:00
originalUrl: https://blog.patrickmeenan.com/2009/09/tcp-and-http-fighting-each-other-to.html
---

This is the first in what is likely to be a multi-post series discussing how HTTP works down at the TCP packet level, opportunities for improvement and a look at how some of the big players perform.  
  
  
Background  
  
I'm going to assume that if you're reading this you have a fairly good idea of what HTTP and TCP are and what the roles of each are. What I want to focus on is the design goals of each and how those goals impact the web as we know it today.  
  
TCP, being the foundation of most connection-oriented data transfer on the Internet, has to work well for lots of different purposes including (but certainly not limited to):  

*   Web pages  
    
*   Large file transfers
*   Remote system management
*   E-mail transfer
*   Interactive console access
*   LOTS of other stuff....  
    

It also does it's best to be kind to the underlying network infrastructure.  
  
HTTP is a request/response protocol where there is always a 1:1 mapping between requests from a client and responses from the server (assuming no errors). It is also generally limited to send one request at a time over a given TCP connection and can't send another request until the previous one complete (HTTP pipelining aside which was pretty much a colossal failure).  
  
Web pages generally require a bunch of individual requests to load a full page (20-100 is not unusual) but it all starts with a single request for the "base page" which is the HTML code that defines the page and all of the elements required to build it. The web browser (client) doesn't know what other elements it needs to download until the base page loads (at least far enough where it can start identifying elements and parsing the HTML).  
  
There are 2 features of TCP in particular that I want to discuss that have a fairly large impact on the performance of HTTP - Nagle and TCP Slow Start. Both are somewhat sensitive to the end-to-end latency between the server and the client so it's probably useful to first understand what some typical latencies look like. I'll generally refer to the end-to-end latency as the Round Trip Time (RTT).  
  
  
Typical Latencies  
  
There are generally 2 places latency comes into play when we talk about a consumer's connection to your web servers (we're just talking front-end between the user's browser and your servers).  
  
1 - The latency between the user's PC and their ISP's Internet connection (this is generally referred to the last-mile)  
  
2 - The latency between the ISP's Internet connection and your front-end servers (web servers in the simple case, load balancers/accelerators in more complex setups)  
  
Last time I measured last-mile latencies for various forms of consumer connectivity I ended up with these Round Trip Times:  
  
DSL: 50 ms  
Cable: 60 ms  
Dial-up: 120-250 ms  
  
These were measured from just a few samples so may not represent global averages or newer technology (the DSL number in particular may be a little high) but is good enough for these discussions.  
  
For the backbone latencies (between the ISP and your servers) it is going to come down to the distance from the ISP (speed of light) and the point where your content is being served from. In the case of a CDN this can be close to zero but some basic round trips for other cases are:  
  
Across the US (east-coast to west-coast): 75 ms  
US east-coast to Europe: 100 ms  
US west-coast to Australia: 150 ms  
  
  
Nagle  
  
[Nagle](http://en.wikipedia.org/wiki/Nagle%27s_algorithm) is a feature that tries to gather outbound data into as few packets as possible and can really help applications that do a bunch of small writes. What it essentially does is send out as many full packets as it can and if it ends up with a partial packet at the end, instead of sending that it will hang onto it for a brief amount of time in case the application is going to send more data. In an extreme case where an application writes out a large amount of data one byte at a time, instead of sending a packet for every single byte it would be able to reduce that significantly (over 1000x) which is better for both the network and the application.  
  
It does generally mean that the last bit of data you send is going to get delayed by at least one round-trip's worth of time (it sends a partial frame when all other data transmitted has been ACK'd by the receiver and there is no pending data on the wire).  
  
What this means for HTTP is that with Nagle enabled, the end of every response will generally get held up by one RTT. In the case of flushing the partial response out early the end of the data that got flushed would also be held up for one RTT or until more of the response is sent back (potentially killing any benefit from the early flush). If the receiver has delayed ACK's enabled then it's possible for an additional 200ms to get added to the last chunk.  
  
Fortunately, Nagle can be turned off on a per-connection basis by setting the TCP\_NODELAY option on the socket and the majority of HTTP servers have it disabled. I do know that it is disabled in Apache, Squid and IIS. I'm a little less sure about lighttpd (there was a [ticket](http://redmine.lighttpd.net/issues/1239) opened a long time ago to do it but I haven't actually checked).  
  
With it disabled you do need to be aware that every write will generally result in packets being sent on the wire so don't flush your HTTP pages after every line :-)  
  
Checking to see if Nagle is disabled is generally pretty easy to see in a packet trace. Generally if you see the PSH bit set it means it has been disabled.  
  
  
TCP Slow Start  
  
[TCP Slow Start](http://en.wikipedia.org/wiki/Slow-start) is the algorithm that TCP uses to probe the network path and determine how much data can be in flight between the server and the client at any given point in time. The client advertises what the upper limit is during the 3-way handshake (receive window) but the server doesn't immediately start by blasting out the full window's worth of data, it ramps up from a very small number of packets and keeps increasing as the client successfully receives data until either the window is fully filled or data starts getting dropped.  
  
In 1999, [RFC 2581](http://www.faqs.org/rfcs/rfc2581.html) set the initial number of packets that TCP should use in slow start to 2 which was actually a fairly significant improvement from the 1 that it was before because in concert with delayed ACK's the slow start could actually stall for 200 ms. In 2002, [RFC 3390](http://www.faqs.org/rfcs/rfc3390.html) increased the initial window to roughly 4 KB and as best as I can tell it hasn't changed since then.  
  
What this means for http is that unless the initial response on a given connection is under 4 KB the full response will be delayed by AT LEAST one RTT (depending on how large the response is it could bump up against the growing transmit window several times with each increase costing an additional RTT). This happens for each new connection which tends to happen fairly frequently for HTTP (and is happening more and more as browsers start opening more connections in parallel to try to retrieve pages faster). HTTP doesn't keep connections open for long enough for  
  
I particularly enjoy this quote from RFC 3390 in 2002:  

   The larger initial window specified in this document is not intended  
  as encouragement for web browsers to open multiple simultaneous TCP  
  connections, all with large initial windows.  When web browsers open  
  simultaneous TCP connections to the same destination, they are  
  working against TCP's congestion control mechanisms \[FF99\],  
  regardless of the size of the initial window.  Combining this  
  behavior with larger initial windows further increases the unfairness  
  to other traffic in the network.  We suggest the use of HTTP/1.1  
  \[[RFC2068](http://www.faqs.org/rfcs/rfc2068.html)\] (persistent TCP connections and pipelining) as a way to  
  achieve better performance of web transfers.  

  
We all know how well pipelining worked out, don't we? And that's exactly what browsers are doing (and more so as they go from 2 up to 6 concurrent connections).  
  
Unlike Nagle, Slow Start can't be tweaked or configured. It is baked into the OS TCP stack.  
  
In looking at packet captures from the big players in search where every millisecond matters it looks like they are all seeing a penalty from it. Interestingly Bing seems to be using a window closer to 6-8 KB but I need to take a closer look and see if that's normal for Windows or if they are doing something special. I was somewhat surprised to see that Google who are generally the kings of speed and are already running custom kernels hadn't gone in and tweaked with it at all. Google's main search page looks to fit under the 4 KB window which helps with it's delivery speed but the search results do not (and with some tweaks to slow start you should be able to deliver even bigger pages just about as fast, and certainly faster than they are currently delivered).  
  
  
Interesting, so what can we do about it?  
  
Up until now, for the most part this has been an exercise in identifying areas that are impacting our ability to deliver web pages as fast as possible. Instead of having all of the intelligence at the lowest levels of the OS I think it would make a lot of sense to bubble up some of the configurations and statistics up to the applications so they can do on-the-fly tuning. If I get some free time to work on it I'm going to look at building some patches for the Linux kernel that would expose settings for slow start on a per-connection basis as well as statistics around RTT and packet loss (also on a per-connection basis).  
  
Then applications could be intelligent and tune the settings dynamically. For example, a web server could start out by setting the initial window to an intelligent guess as to what it should be for optimum performance (complex algorithms could help but say for example, that it starts out at a size that would satisfy 80% of requests based on historical data). If it starts seeing packet loss at a higher than acceptable rate on the aggregate of it's connections it ramps the size down for future connections and every now and then attempts to increase it as packet loss goes away. It basically lets you do a lot of application-specific tuning without having to build a single algorithm that will work for all protocols.  
  
At this point it's all mostly theoretical so please feel free to poke giant sticks at it (or me). I'll probably start just by configuring bigger windows statically in the kernel and seeing how that works but for sites or applications looking to squeeze every last bit of performance out of http this looks to be a good way to do it and it can be done without any changes on the client or to the protocols (always a good thing).