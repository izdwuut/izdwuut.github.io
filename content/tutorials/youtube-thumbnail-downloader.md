---
title: "Youtube Thumbnail Downloader"
draft: false
topics:
    - "HTTP requests"
    - "Python standard library"
    - "API"
    - "CLI"
libraries:
    - "requests"
github: "https://github.com/izdwuut/utumler"
---
The idea is pretty simple. Given the URL to a Youtube video, the script spews out it's thumbnail. [See this lovely image?](https://www.youtube.com/watch?v=U-iEK0mlmuQ) It would make for a perfect wallpaper and I wrote the script that does just that.

How would Python render it possible, you'd ask? By working hand-in-hand with YT API, of course! I should seriously reconsider becoming a clown. I have a hunch that it would come as natural to me. Let's face it - my nose naturally turns red when it's cold and my feet are enormously large. Which in turn implies...

## Is it by chance an apple pie?
...that they would fit those funky clown shoes just perfectly. Oh, the pie. _Right_.

API stands for _Application Programming Interface_. Be prepared for more mumbo-jumbo gibberish down the road. When I use the term, I mean a subset of a service's funcionality that your script can make use of. The use case covered by this tutorial can be brought to life because Youtube API provides an endpoint to download the thumbnail given the video ID. Programmatically speaking it's nothing more than a function. It yields some output (the thumbnail) given some parameters (the Youtube video ID) or lack thereof.
