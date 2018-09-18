---
title: "This is what you waited for. Create your own Youtube Thumbnail Downloader in Python!"
draft: true
topics:
    - "HTTP requests"
    - "Python standard library"
    - "API"
    - "CLI"
    - "REPL"
    - "Config files"
libraries:
    - "PIL"
    - "io"
    - "argparse"
    - "google-api-python-client"
    - "configparser"
github: "https://github.com/izdwuut/utumler"
preReq:
    - "Python interpreter"
---
The idea is pretty simple. Given the URL to a Youtube video, the script spews out it's thumbnail. [See this lovely image?](https://www.youtube.com/watch?v=U-iEK0mlmuQ) It would make for a perfect wallpaper and I wrote the script that does just that.

How would Python render it possible, you'd ask? By working hand-in-hand with [Youtube API](https://developers.google.com/youtube/v3/), of course! I should seriously reconsider becoming a clown. I have a hunch that it would come as natural to me. Let's face it - my nose naturally turns red when it's cold and my feet are enormously large. Which in turn implies...

## Is it by chance an apple pie?
...that they would fit those funky clown shoes just perfectly. Oh, the pie. _Right_.

API stands for _Application Programming Interface_. Be prepared for more mumbo-jumbo gibberish down the road. When I use the term, I mean a subset of a service's funcionality that your script can make use of. The use case covered by this tutorial can be brought to life because Youtube API **(the service)** provides an endpoint to download the thumbnail given the video ID. Programmatically speaking it's nothing more than a function. It yields some output **(the thumbnail resource)** given some parameters **(the Youtube video ID)** or lack thereof. 

To interact with aforementioned API we are going to use a [Google API](https://developers.google.com/api-client-library/python/start/get_started) wrapper - a Python abstraction for the API. It acts like any other library and I believe that it greatly simplifies the task as it doesn't require performing a HTTP call explicitly. It can be conveniently installed from a CLI using pip:

```
pip install google-api-python-client
```

In terms of the API client that we use, [`videos`](https://developers.google.com/youtube/v3/docs/videos) is the collection that we will be working with. [Here](https://developers.google.com/youtube/v3/docs/videos#resource) you can see full specification of it's structure, albeit we are only interested in a [`['snippet']['thumbnails']`](https://developers.google.com/youtube/v3/docs/thumbnails) key. The docs [states](https://developers.google.com/youtube/v3/docs/#Videos) that the collection provides a [`list`](https://developers.google.com/youtube/v3/docs/videos/list) method. We are going to use it, as there is no method that refers to a single video. Instead we will end up with a list that consists of only one element, which is barely a difference.

We are also going to need an API key - our license to use the interface. [Here](https://developers.google.com/youtube/v3/getting-started#before-you-start) are detailed instruction on how to obtain it. You will be prompted for your project name and in case you were looking for a catchy name, _big-potential-216709_ should work just well.

## REPL 
Seriously, I think that it's one of the best things about Python. It allows you to test all your crazy ideas in a sandbox manner. I love to have it open while I work on my code, as it helps me to figure out empirically how a certain method behaves. It also simplifies comming up with an algorithm, as it allows you to examine a code snippet in isolation. The fact that it evaluates your expressions as you enter them (that's what [REPL](https://en.wikipedia.org/wiki/Read–eval–print_loop) stands for) means responsiveness and it makes the whole experience really fluid and enjoyable, as far as my opinion goes.

You can [invoke it](https://docs.python.org/3/tutorial/interpreter.html#interactive-mode) by simply typing the following command in your favourite shell:

```
> python
```

Et voilà! In a moment you will see how deep the rabbit hole goes but for now why don't we play with it a little? The following snippet of code would make it memorize a value assigned to a variable:

```
>>> var = 5
>>> var
5
```
1. Assigning a variable. I'm the guy who document getters and setters in his code, by the way.
2. An expression to evaluate. Because we reference a variable name, it would get substituted to `5` - the value that we previously assigned to it.
3. Evaluated expression.

I deeply and profoundly love this workflow. I hope that it would charm you, too! When it comes to our little utility, we could use the REPL to get acustomed with our wrapper. Let's try it out, shall we? As documented on [the docs page](https://developers.google.com/api-client-library/python/start/get_started#build-the-service-object), we have to import the library first and then use it's `build` method to obtain a service object **(our wrapper)**. It takes a couple of parameters which values can be found [here](https://developers.google.com/api-client-library/python/apis/#YouTube_Data_API), and the API key that we have already received. The following snipped does just that:

```
params = {'developerKey': 'YOUR_API_KEY', 'serviceName': 'youtube', 'version': 'v3'}
service = build(**params)
```
1. Specify method parameters.
2. Build the wrapper object using the [unpacked](https://docs.python.org/3.7/tutorial/controlflow.html#unpacking-argument-lists) `params` dictionary defined before. It equals to the code below:
```
service = build(developerKey='YOUR_API_KEY', serviceName='youtube', version='v3')
```
I know, right? Given [keyword arguments](https://docs.python.org/3/tutorial/controlflow.html#keyword-arguments) order is not important, it makes for some flexible function calls. It rocks... until you have to mock it. Or maybe it's just me?

Great success! You have just builded your wrapper object!
