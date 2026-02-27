---
title: "We can do better (as an industry)!"
date: 2010-01-11T14:23:00.000-05:00
originalUrl: https://blog.patrickmeenan.com/2010/01/we-can-do-better-as-industry.html
---

For the most part, web site performance optimization has been something that an experienced developer had to be involved in and if they weren't then odds are your site doesn't perform well.  Why do we have to work so hard to make them faster (and more importantly, why are they not fast automatically)?  I think there are some key areas that could help significantly if they were addressed:  
  
**Hosting Providers**  
If a hosting provider does not have persistent connections and gzipping for html, css and js enabled by default they should be out of business.  Period.  Maybe it is time to keep a public record of which hosting providers are configured well for performance and which aren't but things are in pretty bad shape.   
  
I'm appalled by the number of sites that get tested with persistent connections disabled and the owners contact me asking how to fix it but they can't because the hosting provider has it disabled.  Enabling gzip for html, js and css mime types by default will also go a long way to helping (and it will likely help their bottom line as they will be serving fewer bytes).  
  
**CMS Platforms**  
This is for the Drupals, Joomla's and Wordpresses of the world.  You control the platform 100%, make it fast  by default for people installing rather than requiring acceleration plugins or significant tuning and tweaking.  Since they all have custom plugin and theming API's there is a HUGE opportunity here.  Fixing wordpress installs is another topic I see WAY too frequently, particularly when plugins are involved.  Some suggestions:  

1.  Force use of an API call to include CSS in a page template and then do the necessary processing to combine the files together, do the versioning, have long expiration times, etc (and bonus points for inlining the background images for appropriate browsers and for fancier tricks like inlining the css for first view, etc).
2.  Provide API's and hooks for javascript on pages along with async loading and combining.  Make it HARD to load js in the head and strongly discourage it.
3.  Provide automatic image compression with reasonable quality levels (that could be overridden if needed but that defaults to re-compressing images and stripping any exif information off).

**Code Libraries**  
This is for the jQuery, MooTools, YUI Library, etc.  Provide samples that are already optimized.  Developers are REALLY good at copy and paste.  If you give them a sample that is  going to perform poorly then that's what they use.  Every example I have ever seen for a js toolkit throws the individual components all in the head as separate files.  This is probably the worst thing you can do for page performance but everyone does it because that's how all of the samples tell you how to do it.