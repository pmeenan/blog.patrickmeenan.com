---
title: "Anycast and what it means for web performance"
date: 2011-10-03T06:41:00.001-04:00
originalUrl: https://blog.patrickmeenan.com/2011/10/anycast-and-what-it-means-for-web.html
---

  
Every now and then the topic of Anycast comes up in the context of web performance so I thought I’d take a stab at explaining what it is and the benefits.  
  
tl;dr – DNS servers should always be Anycast (and even some of the largest CDN’s are not so don’t just assume you are covered).  Anycast for the web servers/CDN is great if you can pull it off but it’s a lot less common than DNS.  
  
**Anycast – the basics**  
  
Each server on a network (like the Internet) is usually assigned an address and each address is usually assigned to a single server.  Anycast is when you assign the same address to multiple servers and use routing configurations to make sure traffic is routed to the correct server.  On private networks where there is no overlap this is pretty easy to manage (just don’t route the Anycast addresses out of the closed network).  On the public Internet things are somewhat more complicated since routes change regularly so a given machine could end up talking to different servers at different points in time as routing changes happen on the Internet (congested links, outages, and for hundreds of other reasons).  
  
The routing behavior on a network as large as the Internet means Anycast is not a good fit for stateful long-lived connections but stateless protocols or protocols that recover well can still work.  Luckily for the web, the two foundational protocols for web traffic are largely stateless (DNS and HTTP).  
  
**DNS Anycast**  
  
By far, the most common use for Anycast on the Internet is for DNS (servers and relays).  To provide fast DNS response times for users across the globe you need to distribute your authoritative DNS servers (and users need to use DNS relays/servers close to them).  
  
One way to distribute your servers is to give each one a unique address and just list them all as authoritative servers for your domain.  Intermediate servers running Bind 8 will try them all and favor the fastest ones but it will still use the slower ones for some percentage of traffic.  Bind 9 (last I checked anyway) changed the behavior and no longer favors the fastest so you will end up with a mix of slow and fast responses for all users.  
  
Using Anycast you would distribute your servers globally and give them all the same IP address and you would list a single address (or a couple of Anycast addresses for redundancy) as the authoritative servers for your domain.  When a user goes to look up your domain, their DNS relay/server would always get routed to your best authoritative server (by network path, not necessarily physical geography).  Since DNS is just a request/response protocol over UDP, it really doesn’t matter if they end up talking to different physical servers for different requests.  
  
So, as long as the routing is managed correctly, DNS Anycast is ALWAYS better than other solutions for a distributed DNS serving infrastructure (at least for performance reasons).  **You should make sure that you are using Anycast DNS for moth your own records as well as any CDNs you might leverage**.  It works for both the authoritative servers as well as DNS relays that users might use.  Google’s public DNS servers for end users are globally distributes but use the Anycast addresses of 8.8.8.8 and 8.8.4.4 so you will always get the fastest DNS performance regardless of where you are and what network you are on.  
  
**HTTP Anycast**  
  
Even though HTTP is not as stateless as DNS (TCP connections need to be negotiated and maintained), the connections live for a short enough time that Anycast can also work really well for HTTP – though it requires more control over the network to keep routing changes to a minimum.  
  
Typically, geo-distribution of web servers is done by assigning them different IP addresses and then relying on geo-locating DNS to route users to the server closest to them.  It usually works well enough but there are some fairly big gotchas:  
  

*   The geo-locating DNS server actually sees the address of the user’s DNS server, not the user themselves so it can only provide the server closest to the user’s DNS – not necessarily the user (there is a spec update to relay the actual user IP through in DNS requests so this can be done more accurately).
*   The geo-locating is only as good as the knowledge that the service has about which web servers are closest to the user’s DNS servers.  It usually works well but it’s not uncommon to see traffic routed to servers that are far away.
*   The Time To Live (TTL) on the DNS responses is usually really short (60 seconds) so that dead or overloaded servers can be pulled out as needed.  This effectively means that the DNS records can’t be cached by the user’s DNS servers and the requests all have to go back to the authoritative servers.

  
  
With Anycast, servers can be deployed globally with the same IP address.  When it works well it addresses all of the issues that using DNS to geo-locate has:  
  

*   DNS can reply with the same IP address for all users and the address can have a long TTL and be cached by intermediate DNS resolvers.
*   In the case of a CDN, you can even assign the Anycast address directly as an A record and avoid the extra step of a CNAME lookup.
*   You don’t need to know where the user is.  Routing will take care of bringing the user to the closest server regardless of where they or their DNS server are located.
*   If you need to take a server offline, you adjust the routing so that traffic goes to the next best physical server.

  
  
I’m glossing over a LOT of the complexity in actually managing an Anycast network on the public internet but **assuming you (or your provider) can pull it off, Anycast can be a huge win for HTTP performance as well**.  
  
All that said, there are only a few implementations that I am aware of for using Anycast for HTTP (and they are all CDN providers).  Anycast for HTTP should not be the main focus when picking a CDN since there are a lot of other important factors – the most important of which is to make sure they actually have edge nodes near your users (if you have a lot of users in Australia then pick a provider with edge nodes in Australia FIRST, then compare other features).