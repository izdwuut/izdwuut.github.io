---
title: "Create Reddit upvoter using Python and PRAW"
date: 2020-02-26T16:05:00+02:00
draft: false
topics:
    - "PRAW"
    - "API"
    - "Python"
libraries:
    - "PRAW"
sources: "https://github.com/izdwuut/reddit-upvoter"
layout: "tutorial"
tags: 
    - "Python"
    - "PRAW"
    - "API"
    - "Reddit"
---

Welcome to another tutorial of mine! Be sure to check the previous ones [here]({{< relref path="/tutorials" >}}). In this one, I'm going to cover a script that upvotes every new submission and comment from a given subreddit. Please, don't try to run it in reverse and downvote all the things. Please...

I assume that you have Python installed on your system. The tutorial targets Windows 10 with Powershell.

# Registering the application

In order to use PRAW, we need to [register](https://old.reddit.com/prefs/apps/) our script first. Here's how the form looks like:

![Registration form](/img/posts/reddit-upvoter/registration-form.png)

When you hit `create app`, you will have access to your app settings. With red I have marked variables that we will need later on.

![Variables](/img/posts/reddit-upvoter/variables.png)

Side note: it's good to create a new user just for the script. 

# Setting up the virtual environment

Before you start coding, create a working directory for the script:

```
mkdir reddit-upvoter
cd mkdir
```

Now you can create the Python virtual environment in `venv` directory:

```
python -m venv venv
```

Activate it:

```
.\venv\Scripts\activate.ps1
```

We are going to need [PRAW](https://praw.readthedocs.io) installed. Do it with the command:

```
pip install praw
```

All set!

# Preparing the battlefield

Create a file for the script (`upvoter.py`) and the one for settings (`settings.ini`):

```
New-Item upvoter.py
New-Item settings.ini
```

Open the `upvoter.py` file in your favourite text editor. First we add some imports:

{{< highlight python "linenos=table" >}}
import os
from configparser import ConfigParser
from praw import Reddit
{{< / highlight >}}
1. A package needed to create `ConfigParser` object.
2. An object that will handle our settings file.
3. The Python Reddit API Wrapper.

The script is going to be really simple, but it's still a good idea to put our code in a class:

{{< highlight python >}}
class Upvoter:
    pass
{{< / highlight >}}

# Configuration

Let's add configuration now so we don't have to refactor our code later on:

{{< highlight python "linenos=table" >}}
class Upvoter:
    def __init__(self, settings='settings.ini'):
        self.config = ConfigParser(os.environ)
        self.config.read(settings)
{{< / highlight >}}

`2.` `settings` is a path to settings file. It defaults to `settings.ini`.

`3.` Create a config object. We are passing an `os.environ` reference because we are going to interpolate our system's environmental variables.

`4.` Read a config from a path passed as an argument.

As for settings file, paste this. We are going to define the variables in a moment:

{{< highlight plaintext "linenos=table" >}}
[reddit]
client_id = %(UPVOTER_REDDIT_CLIENT_ID)s
client_secret = %(UPVOTER_REDDIT_CLIENT_SECRET)s
username = %(UPVOTER_REDDIT_USERNAME)s
password = %(UPVOTER_REDDIT_PASSWORD)s
user_agent = python:reddit-upvoter:v0.1.0 (by /u/izdwuut)
subreddit = test
{{< / highlight >}}

`1.` Put our settings in `[reddit]` group. We will reference it using dictionary syntax: `config['reddit']`.

`2-3.` Fields from [registering the application](#registering-the-application) step. Here we interpolate the variables, meaning that the actual values can be found in system's environmental variables. We externalize them for security purposes. This way we can easily commit our settings file to git and not worry that we expose our sensitive data.

`4-5` Your redditor's username and password.

`6.` A string that identifies the app.

`7.` Subreddit that the script will listen to.

Now we can actually declare our variables. Hit `Windows` + `R` and execute this. I really hate how Windows can make simple tasks hard, but hey! It runs games...

```
rundll32.exe sysdm.cpl,EditEnvironmentVariables
```

Declare the variables as shown below:

![Environmental variables](/img/posts/reddit-upvoter/environmental-variables.png)

# Get the API object

We are going to create an [authorized PRAW instance](//localhost:1313/). The code should be self explanatory. Since we defined environmental variables earlier, all you have to do is to paste the following snippet:

{{< highlight python "linenos=table" >}}
class Upvoter:
    def __init__(self, settings='settings.ini'):
        ...

        self.api = Reddit(client_id=self.config['reddit']['client_id'],
                          client_secret=self.config['reddit']['client_secret'],
                          user_agent=self.config['reddit']['user_agent'],
                          username=self.config['reddit']['username'],
                          password=self.config['reddit']['password'])
{{< / highlight >}}

# Having fun with REPL

We will create the rest of the script experimentally, step by step, using Python's [REPL](https://docs.python.org/3/tutorial/interpreter.html). Invoke the following command in Powershell:

```
python
```

You should get the following output, meaning you've activated the interpreter:

```
Python 3.7.0 (v3.7.0:1bf9cc5093, Jun 27 2018, 04:59:51) [MSC v.1914 64 bit (AMD64)] on win32
Type "help", "copyright", "credits" or "license" for more information.
>>>
```

First we need to import our script:

{{< highlight python >}}
from upvoter import Upvoter
{{< / highlight >}}

Then we obtain our API instance:

{{< highlight python >}}
api = Upvoter().api
{{< / highlight >}}

Since we are experimenting now, create a thread on [r/test](https://www.reddit.com/r/test) for testing purposes and add a few comments. I'm going to use [this](https://www.reddit.com/r/test/comments/f9tz8c/upvoter_test/) thread from now on. Obtain the [submission](https://praw.readthedocs.io/en/latest/code_overview/models/submission.html) object with the following code:

{{< highlight python >}}
submission = api.submission(url='https://www.reddit.com/r/test/comments/f9tz8c/upvoter_test/')
{{< / highlight >}}

Having that, we can perform various actions. We are going focus on manipulating karma now. The following line will downvote our post:

{{< highlight python >}}
submission.downvote()
{{< / highlight >}}

When you navigate to the thread page in your browser, you should see that it has been downvoted. Now let's do the opposite:

{{< highlight python >}}
submission.upvote()
{{< / highlight >}}

Now we are going to do the same with comments. Obtain them first:

{{< highlight python >}}
comments = submission.comments
{{< / highlight >}}

First we are going to downvote them using a simple for loop:

{{< highlight python >}}
for comment in comments:
    comment.downvote()
{{< / highlight >}}

Then we upvote them:

{{< highlight python >}}
for comment in comments:
    comment.upvote()
{{< / highlight >}}

Now do the same, but using a comments [stream](https://praw.readthedocs.io/en/latest/code_overview/other/subredditstream.html):

{{< highlight python >}}
for comment in self.api.subreddit('test').stream.comments():
    comment.upvote()
{{< / highlight >}}

Using stream, new comments are fetched as they are posted. Now that we have it, we can put it all together in text editor.

# Upvote all the things

Add the folowing method to our `Upvoter` class:

{{< highlight python "linenos=table,hl_lines=" >}}
class Upvoter:
    def upvote(self):
        for comment in self.api.subreddit(self.config['reddit']['subreddit']).stream.comments():
            submission = comment.submission
            submission.upvote()
            comment.upvote()
            print('Processed comment {} in thread {}.'.format(comment.id, submission.url))
    
    ...
{{< / highlight >}}

`3.` Get a comment from stream.

`4.` Get a submission object.

`5-6.` Upvote.

`7.` Print that we have just processed the comment.

The last thing we have to do is to run our script:

{{< highlight python >}}
if __name__ == '__main__':
    upvoter = Upvoter()
    upvoter.upvote()
{{< / highlight >}}

We should end up with this code:

{{< highlight python >}}
import os
from configparser import ConfigParser
from praw import Reddit

class Upvoter:
    def upvote(self):
        for comment in self.api.subreddit(self.config['reddit']['subreddit']).stream.comments():
            submission = comment.submission
            submission.upvote()
            comment.upvote()
            print('Processed comment {} in thread {}.'.format(comment.id, submission.url))

    def __init__(self, settings='settings.ini'):
        self.config = ConfigParser(os.environ)
        self.config.read(settings)
        self.api = Reddit(client_id=self.config['reddit']['client_id'],
                          client_secret=self.config['reddit']['client_secret'],
                          user_agent=self.config['reddit']['user_agent'],
                          username=self.config['reddit']['username'],
                          password=self.config['reddit']['password'])


if __name__ == '__main__':
    upvoter = Upvoter()
    upvoter.upvote()
{{< / highlight >}}

And that's it! I hope that you've found the tutorial useful. I'd ask you for an upvote, but I don't implement it on my blog.
