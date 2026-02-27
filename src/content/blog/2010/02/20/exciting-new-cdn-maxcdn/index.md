---
title: "Exciting new CDN (MaxCDN)"
date: 2010-02-20T15:50:00.001-05:00
originalUrl: https://blog.patrickmeenan.com/2010/02/exciting-new-cdn-maxcdn.html
---

A common complaint from users of [WebPagetest](http://www.webpagetest.org/) is that I should make using a CDN (Content Distribution Network) an optional check (and it was a common complaint against YSlow as well before they did make it configurable in version 2).  It's usually because their site is too small to justify the expense or complexity of integrating with one of the CDN providers.  Recently I had a few different people ping me to add [MaxCDN](http://www.maxcdn.com/) to the known list of CDN's that I check so while I was at it I thought I'd check them out.  
  
I must admit, I came away totally impressed (so much so that I decided to use them for WebPagetest).  They are doing a lot of things "right" that most of the CDN companies don't bother because it's too difficult and to top it off the barrier to entry is pretty much non-existent (Trial pricing of $10 for 1TB right now with great normal prices as well).  
  
Here are some of the highlights:  
  
**Anycast instead of DNS-based localization**  
  
Every CDN I have seen uses DNS to send each user to the closest server.  There are some serious problems with this approach:  

*   The CDN provider actually only ever sees your user's DNS server's IP address (that of their ISP, company, whatever).  This is reasonable as long as they are using a DNS server that is close to them but the servers are usually regional at best (and if they are using something like OpenDNS it may not be anywhere near the actual user).  This can result in sending the user to a CDN server (POP) that is not anywhere near them.
*   The localization is only as good as their ability to figure out where the user's DNS server is.  They can usually locate the large ISP DNS servers well but a corporation or individual running their own resolver may be hit or miss (depending on how accurate their database is).
*   By relying on DNS they usually have a low TTL (Time To Live) on the DNS records - as low as 1 minute.  This means that all of the caching that goes on for DNS at the various levels (local PC, ISP, etc) gets flushed every minute and the pain of a new lookup can be pretty bad depending on the DNS architecture of the CDN provider.

[MaxCDN](http://www.maxcdn.com/) uses [Anycast routing](http://en.wikipedia.org/wiki/Anycast) to get the users to the  closest POP.  This means they can hand out the same address to all of the users and their traffic will automatically get routed to the closest peering point (and POP).  "Automatically" may be a bit simplistic since it is complex to maintain an anycast network but it is the right way to do it and guarantees that the traffic follows the best network path to the best  location for every user.  
  
**Simple configuration**  
  
It literally just takes a few minutes to set it up and have it working.  You don't have to upload the files, just set up an alias (the call them "zones") and tell it what to map it to and all of the resources will be fetched automatically when they are referenced.  
  
For example, I set up a zone "webpagetest" that points to "http://www.webpagetest.org/" and gave it a DNS alias of cdn.webpagetest.org (their UI will tell you what to set the CNAME record to for it to work).  Now everything that can be accessed from www.webpagetest.org can also be referenced from cdn.webpagetest.org but using their CDN.  The hardest part is changing the relative paths I used to reference the js, css and images on my site to use a full path through the CDN.  
  
They have a few plugins that automate the configuration for some of the common CMS platforms (wordpress for example).  
  
**An eye towards performance**  
  
Rather than just taking on the market with a well-architected inexpensive CDN they are also pushing the envelope on helping their customers optimize their sites by making it  easy to do through the CDN.  They recently updated their control panel to make it easy to add multiple aliases for the same content so splitting requests across domains just got that much easier and it looks like they are looking to push more and more capabilities into the edge.  
  
  
In a time when most CDN providers are interested in streaming and other large bandwidth uses (more money since you pay for the bandwidth you use) it's really exciting to see a new player come in and shake things up where it really matters for most sites - making pages faster.  Bonus points for it being so cheap that there's really no excuse to NOT use a CDN if your site is on the Internet.  
  
Exciting Times!