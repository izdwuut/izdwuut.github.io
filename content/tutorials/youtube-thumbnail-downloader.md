---
title: "This is what you waited for. Create your own Youtube Thumbnail Downloader in Python!"
date: 2018-09-25T06:26:33+02:00
draft: true
topics:
    - "HTTP requests"
    - "Python standard library"
    - "API"
    - "CLI"
    - "REPL"
    - "Config files"
    - "Refactoring"
libraries:
    - "argparse"
    - "google-api-python-client"
    - "configparser"
    - "urllib"
    - "json"
requirements: "http://"
github: "https://github.com/izdwuut/utumler"
preReq:
    - "Python interpreter"
    - "Text editor"
    - "CLI"
layout: "tutorial"
tags: 
    - "Python"
    - "API"
    - "HTTP"
    - "CLI"
    - "REPL"
    - "Tutorial"
---
The idea is pretty simple. Given the URL to a Youtube video, the script spews out it's thumbnail. [See this lovely image?](https://www.youtube.com/watch?v=U-iEK0mlmuQ) It would make for a perfect wallpaper and I wrote a script that does just that.

How would Python render it possible, you'd ask? By working hand-in-hand with [Youtube API](https://developers.google.com/youtube/v3/), of course! I should seriously reconsider becoming a clown. I have a hunch that it would come as natural to me. Let's face it - my nose naturally turns red when it's cold and my feet are enormously large. Which implies...

## Is it by chance an apple pie?
...that they would fit those funky clown shoes just perfectly. Oh, the pie. _Right_.

API stands for _Application Programming Interface_. Be prepared for more mumbo-jumbo gibberish down the road. When I use the term, I mean a subset of a service's funcionality that your script can make use of. The use case covered by this tutorial can be brought to life because Youtube API **(the service)** provides an endpoint to download the thumbnail given the video ID. Programmatically speaking it's nothing more than a function. It yields some output **(the thumbnail)** given some parameters **(the Youtube video ID)** or lack thereof. 

To interact with aforementioned API we are going to use a [Google API](https://developers.google.com/api-client-library/python/start/get_started) wrapper - a Python abstraction for the API. It acts like any other library and I believe that it greatly simplifies the task as it doesn't require performing a HTTP call explicitly. It can be conveniently installed from a [CLI](https://en.wikipedia.org/wiki/Command-line_interface) using pip - the default Python's package manager:

{{< highlight bash >}}
pip install google-api-python-client
{{< / highlight >}}

We are also going to need an API key - our license to use the interface. [Here](https://developers.google.com/youtube/v3/getting-started#before-you-start) are detailed instruction on how to obtain it. You will be prompted for your project name. In case you were looking for a catchy name, you should be fine with _big-potential-216709_.

## REPL {{% icon color="red" icon="heart" %}}
Seriously, I think that it's one of the best things about Python. It allows you to test all your crazy ideas in sandbox manner. I always have it open while I work on my code, as it helps me to figure out empirically how a certain method behaves. It also simplifies comming up with an algorithm, as it allows you to examine a code snippet in isolation. The fact that it evaluates your expressions as you enter them (that's what [REPL](https://en.wikipedia.org/wiki/Read–eval–print_loop) stands for) means responsiveness and it makes the whole experience enjoyably fluid.

You can [invoke it](https://docs.python.org/3/tutorial/interpreter.html#interactive-mode) by typing the following command in your favorite shell:

{{< highlight bash >}}
python
{{< / highlight >}}

Et voilà! In a moment you will see how deep the rabbit hole goes but for now why don't we play with it a little? The following snippet of code would make it memorize a value assigned to a variable:

{{< highlight python "linenos=table" >}}
var = 5
var
5
{{< / highlight >}}

1. Assigning a variable. I'm the guy who documents getters and setters in his code, by the way.
2. An expression to evaluate. Because we reference a variable name, it would get substituted to `5` - the value that we previously assigned to it.
3. Evaluated expression.

Multiline snippets of code are also possible - just press `Shift` + `Enter`. Keep in mind that [identation](https://docs.python.org/3/faq/design.html?highlight=indentation#why-does-python-use-indentation-for-grouping-of-statements) is still a necessity. This little conditional statement should print _5 = 5!_:

```python
if var is 5:
    print('5 = 5!')
```

I deeply and profoundly love this workflow. I hope that it would charm you, too! We are going to get familiar with it's real power shortly.

## Interacting with the API
When it comes to our little utility, we could use the REPL to get acustomed with our wrapper. Let's try it out, shall we? As documented on [the docs page](https://developers.google.com/api-client-library/python/start/get_started#build-the-service-object), we have to import the library first and then use it's `build` method to obtain a service object **(our wrapper)**. It takes a couple of parameters which values can be found [here](https://developers.google.com/api-client-library/python/apis/#YouTube_Data_API), and the API key that we have already received. A caveat: I had to reference the wrapper as `googleapiclient` instead of `apiclient` in order for it to click:

{{< highlight python "linenos=table" >}}
>>> from googleapiclient.discovery import build
>>> api_params = {'developerKey': 'YOUR_API_KEY', 'serviceName': 'youtube', 'version': 'v3'}
>>> api = build(**params)
{{< / highlight >}}

1. Import the method from the library (note the modified module name) that returns the wrapper object.
2. Specify method parameters.
4. Build the wrapper object using the [unpacked](https://docs.python.org/3.7/tutorial/controlflow.html#unpacking-argument-lists) `api_params` dictionary defined before. It equals to the code below:

```python
>>> api = build(developerKey='YOUR_API_KEY', serviceName='youtube', version='v3')
```
I know, right? Given [keyword arguments](https://docs.python.org/3/tutorial/controlflow.html#keyword-arguments) order is not important, it makes for some flexible function calls. It rocks... until you have to [mock](https://docs.python.org/3/library/unittest.mock.html) it. Or maybe it's just me?

Great success! You have just builded your wrapper object! Now that we have it, we can use it to obtain thumbnail links. In terms of the API client that we use, [`videos`](https://developers.google.com/youtube/v3/docs/videos) is the [collection](https://developers.google.com/api-client-library/python/start/get_started#collections) that we will be working with. [Here](https://developers.google.com/youtube/v3/docs/videos#resource) you can see full specification of it's structure, albeit we are only interested in a [`['snippet']['thumbnails']`](https://developers.google.com/youtube/v3/docs/thumbnails) key. It can be obtained through [`list`](https://developers.google.com/youtube/v3/docs/videos/list) method. Roughly it would translate to the following Python code:

```python
>>> request = service.videos().list()
```
Executing the code would raise an exception that we didn't provide enough parameters to the `list` method. We are going to handle it in a moment. [An example](https://developers.google.com/youtube/v3/getting-started#partial-examples) (the 4th one) provided in - lo and behold - the docs gave me an idea what parameters should I pass in order to obtain metadata that interest me. It speaks of the following URL:

```
https://www.googleapis.com/youtube/v3/videos?id=7lCDEYXw3mM&key=YOUR_API_KEY&fields=items(id,snippet(channelId,title,categoryId),statistics)&part=snippet,statistics
```
Phew. Let's break it down a bit and look at it from the Python perspective. Our [query](https://en.wikipedia.org/wiki/URL) consist of a couple of variables:

{{< highlight python "linenos=table" >}}
id = '7lCDEYXw3mM'
key = 'YOUR_API_KEY'
part = 'snippet,statistics'
fields = 'items(id,snippet(channelId,title,categoryId),statistics)'
{{< / highlight >}}

1. Youtube Video ID.
2. Your API key.
3. Here we specify first level keys which fields interest us. We can further pinpoint them using _fields_ variable.
4. Metdata about video(s) that you are wishing to obtain. They are maped directly to [the response](https://developers.google.com/youtube/v3/docs/videos#resource-representation) fields that you are going to get.

You can easily compare the output with [the video](https://www.youtube.com/watch?v=7lCDEYXw3mM) utilized by the example. More so, it's perfectly possible to visit this link using your browser. You would see the following [JSON](http://www.json.org/) response:

```json
{
 "videos": [
  {
   "id": "7lCDEYXw3mM",
   "snippet": {
    "channelId": "UC_x5XG1OV2P6uZZ5FSM9Ttw",
    "title": "Google I/O 101: Q&A On Using Google APIs",
    "categoryId": "28"
   },
   "statistics": {
    "viewCount": "3057",
    "likeCount": "25",
    "dislikeCount": "0",
    "favoriteCount": "17",
    "commentCount": "12"
   }
  }
 ]
}
```

Quite obviously the response is not what we were wishing to get, although I think that it gives a rough idea how the API works and how would we use it to get the data that we want. Please, look at our [resource representation](https://developers.google.com/youtube/v3/docs/videos#resource-representation) once again. We are interested in a `snippet` part because that's where we can find `thumbnails` field. Knowing how the previous query relates to the response returned by the API, we should be able to get our thumbnails through passing the following query parameters:

```python
id = 'U-iEK0mlmuQ'
key = 'YOUR_API_KEY'
part = 'snippet'
fields = 'items(snippet(thumbnails))'
```

Let's return to our benelovent REPL and see if we are right. The parameters above directly translates to Python code and they could be directly pasted into our interactive console, albeit I'm going to pack them into a dictionary like I did when I had builded the wrapper object:

```python
>>> request_params = {'id': 'U-iEK0mlmuQ',
...                   'part': 'snippet',
...                   'fields': 'items(snippet(thumbnails))'}
>>> request = api.videos().list(**request_params)
```

The last step is to actually execute our query. In order to do that, we are [asked](https://developers.google.com/api-client-library/python/start/get_started#execution-and-response) to use the `execute` method:

```python
>>> response = request.execute()
```

As I wrote in the previous section, we can access the variable value by simply entering it's name into REPL:

```python
>>> response
{'items': [{'snippet': {'thumbnails': {'default': {'url': 'https://i.ytimg.com/vi/U-iEK0mlmuQ/default.jpg', 'width': 120, 'height': 90}, 'medium': {'url': 'https://i.ytimg.com/vi/U-iEK0mlmuQ/mqdefault.jpg', 'width': 320, 'height': 180}, 'high': {'url': 'https://i.ytimg.com/vi/U-iEK0mlmuQ/hqdefault.jpg', 'width': 480, 'height': 360}, 'standard': {'url': 'https://i.ytimg.com/vi/U-iEK0mlmuQ/sddefault.jpg', 'width': 640, 'height': 480}, 'maxres': {'url': 'https://i.ytimg.com/vi/U-iEK0mlmuQ/maxresdefault.jpg', 'width': 1280, 'height': 720}}}}]}
```

Uh oh. Not the most decipherable output, isn't it? Worry not! We can use lovely [`json`](https://docs.python.org/3/library/json.html) library to make it more human-readable. Try the following snippet of code:

```python
>>> import json
>>> formatted_response = json.dumps(response, indent=2)
>>> print(formatted_response)
{
  "items": [
    {
      "snippet": {
        "thumbnails": {
          "default": {
            "url": "https://i.ytimg.com/vi/U-iEK0mlmuQ/default.jpg",
            "width": 120,
            "height": 90
          },
          "medium": {
            "url": "https://i.ytimg.com/vi/U-iEK0mlmuQ/mqdefault.jpg",
            "width": 320,
            "height": 180
          },
          "high": {
            "url": "https://i.ytimg.com/vi/U-iEK0mlmuQ/hqdefault.jpg",
            "width": 480,
            "height": 360
          },
          "standard": {
            "url": "https://i.ytimg.com/vi/U-iEK0mlmuQ/sddefault.jpg",
            "width": 640,
            "height": 480
          },
          "maxres": {
            "url": "https://i.ytimg.com/vi/U-iEK0mlmuQ/maxresdefault.jpg",
            "width": 1280,
            "height": 720
          }
        }
      }
    }
  ]
}
```
1. Import `json` library that we will use to receive pretty, formatted output. It's a part of vast [Python standard library](https://docs.python.org/3/library/), which I find cool on it's own.
2. Create output string. The _indent_ parameter tells us that each level will be indented using 2 spaces.
3. Print our response on the console.
4. Formatted output.

Much better! In order to make navigating over thumbnails entries a little more convenient, I'm going to assign appropriate key under corresponding variable:

```python
>>> thumbs = response['items'][0]['snippet']['thumbnails']
>>> formatted_thumbs = json.dumps(thumbs, indent=2)
>>> print(formatted_thumbs)
{
  "default": {
    "url": "https://i.ytimg.com/vi/U-iEK0mlmuQ/default.jpg",
    "width": 120,
    "height": 90
  },
  "medium": {
    "url": "https://i.ytimg.com/vi/U-iEK0mlmuQ/mqdefault.jpg",
    "width": 320,
    "height": 180
  },
  "high": {
    "url": "https://i.ytimg.com/vi/U-iEK0mlmuQ/hqdefault.jpg",
    "width": 480,
    "height": 360
  },
  "standard": {
    "url": "https://i.ytimg.com/vi/U-iEK0mlmuQ/sddefault.jpg",
    "width": 640,
    "height": 480
  },
  "maxres": {
    "url": "https://i.ytimg.com/vi/U-iEK0mlmuQ/maxresdefault.jpg",
    "width": 1280,
    "height": 720
  }
}
```

1. I think that navigating over lists and dictionaries in Python is pretty straighforward, although I'm going to explain it a bit for the sake of clarity. The value under `items` key is a list (think of it as of an array - they behave the same in this example) which is denoted by `[` and `]` characters. It has only one item and Python list indices start from 0, so by typing `['0']` we will get what we want. The `snippet` resource which we reference using a `['snippet']` key contains one more object - `thumbnails`. There are images URLs that we are going to process.
2. Format dictionary items that we have just extracted using 2 spaces indent.
3. Display our data structure.
4. Formatted output.

Before we can download our image, we need a way to determine which one is the biggest. Thumbnails come in different sizes depending on the video. Documentation for the resource [states](https://developers.google.com/youtube/v3/docs/thumbnails) that it can return them in the following dimensions:

* default (120 x 90)
* medium (320 x 180) 
* high (480 x 360)
* standard (640 x 480)
* maxres (1280 x 720)

As you see we have received them all. Unfortunately we can't just assume that our video comes with all of the above and just download the **maxres** image. Some of them simply don't have it. For example an API request for the iconic [_Charlie bit my finger_](https://www.youtube.com/watch?v=_OBlgSz8sSM) yields only these:

* default (120 x 90)
* medium (320 x 180) 
* high (480 x 360)

* ~~standard (640 x 480)~~
* ~~maxres (1280 x 720)~~

Because the sizes returned by the API can vary I decided to find a way to make sure which one is the biggest. The simpliest approach that I can think of is to create an ordered list of sizes and check if the response has returned any of them. I think that I'm okay to assume that I can rely on the default item order, although my inner paranoid yells at me to manually check which image is the biggest based on their dimensions in pixels. He would certainly benefit from an obesity diet, so I'm just going to leave him to starve:

{{< highlight python "linenos=table" >}}
>>> SIZES = ['maxres', 'standard', 'high', 'medium', 'default']
>>> def get_largest_thumb_url(thumbs):
...     for size in SIZES:
...         if size in thumbs:
...             thumb = thumbs[size]
...             url = thumb['url']
...             return url
...     return None
>>> thumb_url = get_largest_thumb_url(thumbs)
>>> thumb_url
{{< / highlight >}}

1. Define [constant](https://www.python.org/dev/peps/pep-0008/?#constants) denoting images size order. They correspond with dictionary keys of previously defined `thumbs` variable.
4. A function that returns an URL of the largest thumbnail based on a dictionary passed as it's parameter. Returns `None` if it contains no key specified above. I don't think that it may happen, but it's considered to be in good style, isn't it?
5. Iterate over `SIZES` keys to find out if `thumbs` dictionary contain any of them.
6. Check if a currently processed `size` key is present in `thumbs` dictionary.
7. Because a key was found, get a value from `thumbs` dict that matches it and assign it to a temporary `thumb` variable.
8. Get the `thumb`nail URL.
8. Return the `thumb`nail `url`.
9. Return `None` if `thumbs` contain no `size` key listed in the `SIZES`.
12. Assign the largest thumb to a `thumb_url` variable.
13. Display the URL.

Woah! Our first function! Now _that's_ a reuputable tutorial! Now that we have it, we can finally download our image. 

## Finally downloading the image.

I'm going to use `request` module from [`urllib`](https://docs.python.org/3/library/urllib.html) library to download the image. It comes with a convenient [`urlretrieve`](https://docs.python.org/3.0/library/urllib.request.html#urllib.request.urlretrieve) method which is perfect for our use case. I was considering using [`requests`](http://docs.python-requests.org/en/master/) library as it would do the job just as well. I decided to use `urllib` because it's a part of Python standard library (which is always a plus if you ask me) and it can download the file with just one line of code using a dedicated function. It's perfectly possible that `requests` provide such a method as well but I'm simply not aware of it.

Given that you have been following the tutorial all along, all you have to do is to import the method from the `urllib` module and invoke it as shown below. It would retrieve the image from the Youtube server and save it under the name specified by `filename` variable:

```python
>>> from urllib.request import urlretrieve
>>> filename = 'wallpaper.jpg'
>>> urlretrieve(thumb_url, filename)
```
1. Import the method that would enable us to simultaneously download and save the image.
2. Specify the downloaded file name.
3. Get the image under the URL assigned to the `thumb_url` variable and save it in the current directory under the name specified by `filename` variable.

Here it is. The downloaded image in the flesh.

![Downloaded image](/img/posts/youtube-thumbnail-downloader/downloaded_image.png)


## Putting it all together.

I think that would be nice if we saved our progress in a script file. This way we could reuse it in the future. I think that it is very likely given what the script does. Personally I use it on regular basis and I hope that you find it this useful, too!

Despite of you finding it handy, we are going to need the script file later on in order to pass some CLI parameters to it. Here's everything that we've got so far (roughly in the order that we entered it into the interpreter):

{{< highlight python "linenos=table" >}}
from googleapiclient.discovery import build
from urllib.request import urlretrieve
import json


api_params = {'developerKey': 'YOUR_API_KEY',
              'serviceName': 'youtube',
              'version': 'v3'}
api = build(**api_params)

request_params = {'id': 'U-iEK0mlmuQ',
                  'part': 'snippet',
                  'fields': 'items(snippet(thumbnails))'}
request = api.videos().list(**request_params)
response = request.execute()
thumbs = response['items'][0]['snippet']['thumbnails']
formatted_thumbs = json.dumps(thumbs, indent=2)
print(formatted_thumbs)

SIZES = ['maxres', 'standard', 'high', 'medium', 'default']


def get_largest_thumb_url(thumbs):
    for size in SIZES:
        if size in thumbs:
            thumb_url = thumbs[size]['url']
            return thumb_url
    return None


thumb_url = get_largest_thumb_url(thumbs)

filename = 'wallpaper.jpg'
urlretrieve(thumb_url, filename)
{{< / highlight >}}

Just by looking at it I can't help but think that we need to immediately...

## Refactor it with fire

I love refactoring. As of lately I tend to write a rough draft first and worry about deploying it in methods and classes later on. I find it less streneous than diving right into [OOP](https://en.wikipedia.org/wiki/Object-oriented_programming) and whatnot.

First of all I think that it would be nice if we removed test outputs and a reference to the `json` library as they will be no longer needed.

{{< highlight python "linenos=table,hl_lines=3 18" >}}
from googleapiclient.discovery import build
from urllib.request import urlretrieve
import json
{{< / highlight >}}

{{< highlight python "linenos=table,linenostart=16,hl_lines=2 3" >}}
thumbs = response['items'][0]['snippet']['thumbnails']
formatted_thumbs = json.dumps(thumbs, indent=2)
print(formatted_thumbs)
{{< / highlight >}}

I think that it would be cool if we put getting the wrapper and obtaining thumbnails from the server into functions. Let's start with obtaining the API object first. This is the code that bothers me:

{{< highlight python "linenos=table,linenostart=6" >}}
api_params = {'developerKey': 'YOUR_API_KEY',
              'serviceName': 'youtube',
              'version': 'v3'}
api = build(**api_params)
{{< / highlight >}}

It depends on one parameter - your API key (assigned to a `developerKey` named parameter). Let's create a function that takes just that and returns a builded wrapper:

{{< highlight python "linenos=table" >}}
API_KEY = 'YOUR_API_KEY'


def get_api(api_key):
    api_params = {'developerKey': api_key,
                  'serviceName': 'youtube',
                  'version': 'v3'}
    api = build(**api_params)
    return api


api = get_api(API_KEY)
{{< / highlight >}}

1. Our API key. I decided to make it a constant, as I think that it's unlikely that it's going to change.
4. Define a function that takes the API key as it's only positional parameter.
5. Define wrapper parameters. Here we use our API key passed as a function argument, so it's no longer hard-coded.
8. Build our wrapper using parameters specified before.
9. Return the wrapper.
12. Get the wrapper and assign it to `api` variable.



Neat! Now let's take care of receiving the thumbs. This is our little code:

```python
request_params = {'id': 'U-iEK0mlmuQ',
                  'part': 'snippet',
                  'fields': 'items(snippet(thumbnails))'}
request = api.videos().list(**request_params)
response = request.execute()
thumbs = response['items'][0]['snippet']['thumbnails']
```

It would be nice if we passed a video ID as a function argument. We will also need the wrapper object as it is required to execute our request. The refactored function would look like this:

{{< highlight python "linenos=table" >}}
video_id = 'U-iEK0mlmuQ'


def get_thumbs(api, video_id):
    request_params = {'id': video_id,
                      'part': 'snippet',
                      'fields': 'items(snippet(thumbnails))'}
    request = api.videos().list(**request_params)
    response = request.execute()
    thumbs = response['items'][0]['snippet']['thumbnails']
    return thumbs


thumbs = get_thumbs(api, video_id)
{{< / highlight >}}

4. Define a function that returns thumbnails for a video given it's ID and using provided API wrapper.
5. Define API endpoint parameters as described in [this](Interacting with the API) section. We are going to use a video ID provided as a function argument.
8. Prepare a request that would get our thumbnails list.
9. Execute the query.
10. Extract thumbnails metadata from the response from the server.
11. Return extracted thumbnails metadata.
14. Get extracted thumbnails metadata and assign it to `thumbs` variable.

There are still a few steps left. As you might have already seen, the code interlaced with functions definitions doesn't look particularly good. We will eventually put all this in a dedicated class, but I suggest that we start with creating a method that downloads the video thumbnail. This is what we have so far:

{{< highlight python "linenos=table,hl_lines=36-39" >}}
from googleapiclient.discovery import build
from urllib.request import urlretrieve

API_KEY = 'YOUR_API_KEY'
SIZES = ['maxres', 'standard', 'high', 'medium', 'default']


def get_api(api_key):
    api_params = {'developerKey': api_key,
                  'serviceName': 'youtube',
                  'version': 'v3'}
    api = build(**api_params)
    return api


def get_thumbs(api, video_id):
    request_params = {'id': video_id,
                      'part': 'snippet',
                      'fields': 'items(snippet(thumbnails))'}
    request = api.videos().list(**request_params)
    response = request.execute()
    thumbs = response['items'][0]['snippet']['thumbnails']
    return thumbs


def get_largest_thumb_url(thumbs):
    for size in SIZES:
        if size in thumbs:
            thumb_url = thumbs[size]['url']
            return thumb_url
    return None


api = get_api(API_KEY)
video_id = 'U-iEK0mlmuQ'
thumbs = get_thumbs(api, video_id)
thumb_url = get_largest_thumb_url(thumbs)
filename = 'wallpaper.jpg'
urlretrieve(thumb_url, filename)
{{< / highlight >}}

As you can see, I have slightly altered the code. I believe that it's more readable and organized now. I decided to put our `SIZES` list at the top of the file. I think that this way it would be easy to find if there's a need to alter it. I have also made the `api_key` variable a constant and put it next to `SIZES` list. Additionally all functions definitions are now at the top of the document.

Using the highlighted lines from the listing above, I have came up with an idea for a function that downloads the thumbnail:

{{< highlight python "linenos=table,hl_lines=" >}}
def download_thumb(api, video_id, path='wallpaper.jpg'):
	thumbs = get_thumbs(api, video_id)
	thumb_url = get_largest_thumb_url(thumbs)
	urlretrieve(thumb_url, path)
{{< / highlight >}}

1. There are a couple of parameters here. Let's break them down:
   * `api` - as the function references other functions that we have defined before, we have to pass an api object, so that they can be properly invoked.
   * `video_id` - an ID of a video
   * `path` - a path to a saved file. I decided to rename it from `filename`. I have came up to a conclusion that `path` is more appropriate (sadly, _appropriatier_ is not a word), as the file can be saved anywhere on your device. It [defaults](https://docs.python.org/3/reference/compound_stmts.html#function-definitions) to `wallpaper.jpg`, which means that the file under that name would appear in the directory where you have fired the script.
2. Get thumbnails URLs for a given video referenced by it's ID.
3. Get the largest thumbnail URL.
4. Save the image using the path provided as a function parameter.

The last logical step would be to create a class that would wrap the code that we have just written. I think that the class concept is easiest to grasp when defined as a container for functions and variables. In that context the former turns into a _method_ and the latter transforms into a _field_. Those terms are often interchangeable. Let's create one!

{{< highlight python "linenos=table,hl_lines=" >}}
class Uthumer:
    api = None
{{< / highlight >}}

1. Define the aforementioned class. I have decided to name it Uthumler because it's a _**You**tube_ _**Thum**bnail_ _Download**er**_. _**You**tube_, hence _u_.
2. Define a class variable. We will definitely need the Youtube API to perform our query, even if it's [empty](https://docs.python.org/2/library/constants.html#None) for now. We can access it using a dot operator, like so:

{{< highlight python "linenos=table,hl_lines=" >}}
uthumler = Uthumler()
uthumler.api
{{< / highlight >}}

2. 1. Create an instance of our class - an object that gives us access to it's fields and 
methods. We do this by using our class like a function. We can pass paremeters to it, but we don't need them right now.
2. 2. Get the `api` field value. It returns nothing, as it's value is `None`, which literally means that there is no value assigned! Actually it's value is set to an object of `NoneType` class, but let's stay in a fairyland a little bit longer.

Now that we are acquainted with classes and objects, let's obtain the API wrapper object. We can convienently copy the `get_api` method that we have written before, with some alterations:

{{< highlight python "linenos=table,hl_lines=" >}}
class Uthumer:
    api = None


    @property
    def api(self):
        if not self.api:
            api_params = {'developerKey': API_KEY,
                          'serviceName': 'youtube',
                          'version': 'v3'}
            self.api = build(**api_params)
        return api
{{< / highlight >}}


5. An annotation that makes the following method definition a [property](https://docs.python.org/3/library/functions.html#property). More on it below.
6. The method that we [decorate](https://docs.python.org/3/glossary.html#term-decorator). Because we have just used the `@property` decorator, it has turned into a getter. It allows for the following trick:
{{< highlight python "linenos=table,hl_lines=" >}}
uthumler = Uthumler()
api = uthumler.api
type(api)
{{< / highlight >}}
   
   6. 1. Create an object of our class.
   6. 2. Assign a value of it's `api` field to a variable of the same name. Note that while the names clash, there is no conflict because they have different [scopes](https://docs.python.org/3/reference/executionmodel.html).
   6. 3. To make sure that I have ended up with a return value of the `api` property, I print it's value using a built-in [`type`](https://docs.python.org/3.7/library/functions.html#type) function. It returns a `<class 'googleapiclient.discovery.Resource'>` object, which is exactly what the `api` property is supposed to return.
   
   
   It's only argument is `self`. It's an internal reference that allows an object to access it's own fields and methods that can vary between objects. [This]((https://docs.python.org/3.7/tutorial/classes.html#class-and-instance-variables)) documentation article describes it in greater depth.




4. api_key move to config


{{< highlight python "linenos=table,hl_lines=36-39" >}}
from googleapiclient.discovery import build
from urllib.request import urlretrieve

API_KEY = 'YOUR_API_KEY'
SIZES = ['maxres', 'standard', 'high', 'medium', 'default']


def get_api(api_key):
    api_params = {'developerKey': api_key,
                  'serviceName': 'youtube',
                  'version': 'v3'}
    api = build(**api_params)
    return api


def get_thumbs(api, video_id):
    request_params = {'id': video_id,
                      'part': 'snippet',
                      'fields': 'items(snippet(thumbnails))'}
    request = api.videos().list(**request_params)
    response = request.execute()
    thumbs = response['items'][0]['snippet']['thumbnails']
    return thumbs


def get_largest_thumb_url(thumbs):
    for size in SIZES:
        if size in thumbs:
            thumb_url = thumbs[size]['url']
            return thumb_url
    return None


api = get_api(API_KEY)
video_id = 'U-iEK0mlmuQ'
thumbs = get_thumbs(api, video_id)
thumb_url = get_largest_thumb_url(thumbs)
filename = 'wallpaper.jpg'
urlretrieve(thumb_url, filename)
{{< / highlight >}}