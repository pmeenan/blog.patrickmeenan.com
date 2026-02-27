---
title: "Motivation and Incentive"
date: 2012-12-28T13:09:00.001-05:00
originalUrl: https://blog.patrickmeenan.com/2012/12/motivation-and-incentive.html
---

My favorite web performance article in 2012 was [this one](http://kylerush.net/blog/meet-the-obama-campaigns-250-million-fundraising-platform/) from Kyle Rush about the work done on the Obama campaign's site during the 2012 election cycle.  They did do some cool things but it wasn't the technical achievements that got my attention, it was the effort that they put into it.  They re-architected the platform to serve as efficiently as possible by serving directly from the edge and ran 240 A/B tests to evolve the site from it's initial look and feel to the final result at the end of the campaign (with a huge impact on the donations as a result of both efforts).  
  
Contrasted to the [Romney tech team](http://arstechnica.com/information-technology/2012/11/how-team-obamas-tech-efficiency-left-romney-it-in-dust/) that appears to have contracted a lot of the development out and spent quite a bit more to do it (wish there was an easy way to compare the impact on the funds raised but the donation patterns across the parties is normally very different).  
  
What I like most is that it demonstrates very clearly how having someone's motivations aligned with the "business" goals is absolutely critical and those are the situations where you usually see the innovative work and larger efforts put in.  I see this time and time again in the tech industry and I'm sure it applies elsewhere but it is absolutely critical to be aware of in tech.  
  
Fundamentally that is what DevOps is all about and why the classical waterfall development model is broken:  
  

*   Business identifies a "product need"
*   Product team specs-out a product to fill that need
*   Dev team builds what was specified by the product team (usually as exactly to the requirements as possible, including fussing about pixel-perfect matching the mock-up designs)
*   Dev team throws the resulting product over the wall to QA to test and verify against the requirements
*   QA team throws the final product over the wall to the Ops team to run

*   Usually forever and long after the dev and product teams have moved on
*   Usually doing all sorts of crazy things to keep the system running (automatic restarts, etc)

By bringing the various teams together and making them have skin in the game they are incented to produce a product that is easier to implement, scales and runs reliably (getting developers on pager duty is easily the fastest way to get server code and architectures fixed).

  

As you look across your deployment, small site or large, what are the motivating factors for each of the teams responsible for a given component?

  

## The Hosting

If you are not running your own servers then there is a good chance that the company that is running them isn't incentivised to optimize for your needs.

  

In the case of **shared hosting**, the hosting provider makes their money by running as many customers on as little hardware as possible.  Their goal is to find the edge at which point people start quitting because things perform so badly and make sure they stay as close to that as possible without going beyond it.  When I see back-end performance issues with sites, they are almost always on shared hosting and at times it can be absolutely abysmal.

  

With **VPS** or **dedicated** hosting they usually get more money as you need more compute resources.  Their incentive is to spend as little time as possible supporting you and certainly not to spend time tuning the server to make it as fast as possible.

  

If you are running on someone else's infrastructure (which includes the various cloud services so it is increasingly likely that you are), I HIGHLY recommend that you have the in-house skills necessary to tune and manage the servers and serving platforms.  You need remote hands-and-eyes to deal with things like hardware failures, but outsourcing the management will hardly ever be a good idea.  Having someone on your team who is incented to get as much out of the platform as possible will save you a ton of money in the long term and result in a much better system.

## Site Development

You should have the skills and teams in-house to build your sites.  Period.  If you contract the work out then the company you work with is usually working to do as little work as possible to deliver exactly what you asked for in the requirements document.  Yes, they will probably work with you a bit to make sure it makes sense but they are not motivated by how successful the resulting product will be for your business - once they get paid they are on to the next contract.

  

I see it all too often.  Someone will be looking at the performance of their site and there are huge issues, even with some of the basics but they can't fix it.  They contracted the site out and what they were delivered "looks" like what they were asked to deliver and functions perfectly well but architecturally it is a mess.

  

There are great tools available to help you tune your sites (front and back-end) but you need to have the skills in-house to do it.  Just like with the Obama campaign, they focused on continuously optimizing the site for the duration of the campaign because they were a part of the team and were motivated by the ultimate business goals, not by some requirements document that they needed to check all of the boxes to.

  

Maybe I'm a bit biased since I'm a software guy who also likes to do the end-to-end architectures and system tuning but I absolutely believe that these are skills you need to have or develop as part of your actual team in order to be successful.  Contracting out for expertise also makes sense as long as they are educating your team as you go along and it's more about the education and getting you on the right track.

## CDNs

Maybe it's my tinfoil hat getting a bit tight, but given that CDNs usually bill you for the number of bits they serve on your behalf, it doesn't feel like they are particularly motivated to make sure you are only serving as many bits as you need to.  Things like always gzipping content where appropriate is one of the biggest surprises.  It seems like a no-brainer but most CDN's will just pass-through whatever your server responds with and won't do the simple optimization of gzipping as much as possible (most of them have it as an available setting but it is not enabled by default).

  

Certainly you don't want to be building your own CDN but you should be paying very careful attention to the configuration or your CDN(s) to make sure the content they are serving is optimized for your needs.

## Motivations/Incentives

Finally, just because you have the resources in-house doesn't mean that their motivations are aligned with the business.  In the classic waterfall example, the dev teams are not normally motivated to make sure the systems they build are easy to operate (resilient, self-healing, etc).  In a really small company where the tech people are also founders then it is pretty much a given that their incentives are very well aligned but as your company gets larger it becomes a lot harder to maintain that alignment.  Product dogfooding, DevOps and Equity sharing are all common techniques to try to keep the alignment which is why you see all of those so often in the technical space.

  

  

OK, time to put away the soapbox - I'd love to hear how other people feel about this, particularly counter arguments where it does make sense to completely hand-off responsibility to a third-party.