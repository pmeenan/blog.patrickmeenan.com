---
title: "Recording video with WebPagetest"
date: 2009-09-08T17:02:00.006-04:00
originalUrl: https://blog.patrickmeenan.com/2009/09/recording-video-with-webpagetest.html
---

One of the things we like to look at is what a page looks like when it is loading, particularly if you are comparing a before and after or multiple sites to each other. This is particularly helpful when talking to the business about performance and sometimes the raw load times don't adequately represent the user experience.  
  
Up until now this has been a pretty manual process where we screen record a video while loading a site then load it up into Premiere and stitch it together.  
  
Starting today, you can have [WebPagetest](http://www.webpagetest.org/) record a video of a page load directly. It's still in a pretty rough form and it's going to be a while before it'll be ready for the masses but what is there is already pretty powerful and extremely flexible.  
  
At it's guts, pagetest is really just grabbing screen shots every 0.1 second (10 frames per second) whenever the browser window changes (changes are detected immediately because pagetest hooks the screen drawing code and can tell whenever the browser paints something to the screen). It will capture up to 20 frames at 0.1 second granularity, then fall back to another 20 frames at 1 second and then capture the remainder at 5 second increments. This is done to keep the in-memory image requirements to a minimum but is more than sufficient for most sites (it would take something like a continuously animating image loading very early in a very long page for this to become a problem - at which point you probably have other things to worry about).  
  
As things stand right now, the "video" is a bunch of static images and an [Avisynth](http://avisynth.org/mediawiki/Main_Page) script that turns it into a video for playback so it only works on Windows (and you need to install [Avisynth](http://avisynth.org/mediawiki/Main_Page) to be able to use the videos). The scripting is incredibly powerful and becomes even more interesting when you create other scripts that operate on the existing "video" script files (I have a standard one for doing side-by-side comparisons for example). I'll probably set up a forum for sharing the scripts so we can all benefit from each other's work.  
  
Long-term I plan on making it point-and-click for generating actual video files but that will take a while to implement and there was a fair amount of interest in even the basic functionality so I decided to launch it as it is while I work on improving it.  
  
The video recording capability is only exposed if you are 'logged in" so if you don't see a "video" tab on the main test screen go over to the forums, log in and then it should show up. I needed to put that in place because the storage requirements for the videos are pretty significant and if I start running into storage problems I may need to reach out to individual users. As with everything else, I plan to keep the videos indefinitely but if storage becomes a problem they'll be the first thing to get pruned.  
  
To capture video, just check the box in the "video" tab on the test screen. The video will be available for download on the screen shot page for a given test (there will be a "Download Video" link at the top).  
  
  
Update: I wrote up more details on how to use the captured videos here: [http://www.webpagetest.org/forums/showthread.php?tid=46](http://www.webpagetest.org/forums/showthread.php?tid=46)