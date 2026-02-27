---
title: "Advertisers - Why you care about performance (speed)"
date: 2010-09-10T14:58:00.000-04:00
originalUrl: https://blog.patrickmeenan.com/2010/09/advertisers-why-you-care-about.html
---

One thing that has always amazed me while working on web performance is the need to push advertisers to care about the performance (speed) of their ads.  The hard part is that the way things are structured in advertising, the ones paying the money aren't even usually aware that it's something they should care about and it's not something they hold the agencies (that actually create the ads) or the publishers (that serve the ads) accountable for.  
  
At some level, ads are largely accounted for at the impression level.  The publishers track the number of impressions and the advertiser pays based on the number of impressions that were served.  This is a bit simplistic because there are all sorts of variations as well as click or action-based arrangements but fundamentally they are going to be driven by the same pressures.  An interesting fact that isn't thrown around too much is that **an impression is counted at the time a decision is made to serve your ad, not when the user actually sees it**.  
  
Let's think about that for a minute...What that means is you are paying for every time the ad publishing system starts to serve your ad but **there is no guarantee that the ad itself ever made it to the user**.  Let's say your agency and publisher ended up creating an ad creative that takes 12 seconds to load it's initial payload (yes, this is a real case and while most aren't this extreme they are usually pretty bad).  That means the user has 12 seconds to interact with the page (and even leave) before the ad you just paid for even shows up.  That is insane!  
  
**Faster ads = $$$**  
  
Getting the delivery time of the ads (at least the initial payload until something is visible) to be as fast as possible needs to be a requirement in all contracts, otherwise you are just throwing money away.  The publishers don't have any incentive to optimize the delivery since they get paid regardless.  Make sure the performance is also measured based on the users you are targeting the ads to (targeting mobile? try on an actual carrier on an actual mobile device).  Don't accept results from performance tests done from a data center on a high-bandwidth internet connection (or even worse, from someone at their desk) - you need to measure in the real world on real user connections because things can be exponentially slower without you realizing it.