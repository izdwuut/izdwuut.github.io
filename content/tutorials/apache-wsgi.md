---
title: "Host a Flask app using Apache and mod_wsgi"
date: 2020-02-23T13:37:00+02:00
draft: true
topics:
    - "Apache"
    - "WSGI"
    - "Ubuntu"
preReq:
    - "Ubuntu 18.04"
libraries:
    - "Flask"
sources: "https://github.com/izdwuut/flask-wsgi"
layout: "tutorial"
tags: 
    - "Python"
    - "Server"
    - "WSGI"
    - "Ubuntu"
    - "Apache"
    - "Flask"
---

Now that dust has settled after [Youtube Thumbnail Downloader]({{< relref path="/tutorials/youtube-thumbnail-downloader.md" >}}) tutorial, it's time for a new thing. When you run a Flask developement server, it tells you that it isn't suited for prodution:

```
WARNING: This is a developlment server. Do not use it in a production deployment.
```

Fair point. It hasn't been tested for security and whatnot. There are a few alternatives, most notably [Nginx](https://www.nginx.com/) and [Apache](https://httpd.apache.org/). I go for the latter. I assume that you have [Ubuntu](https://ubuntu.com/) server up and running. I won't actually cover developing a Flask application. I will use a simple example that only demonstrates WSGI configuration. I think that the whole process is straightforward. Let's go!

# Installing libraries

We start with installing required packages. First, make sure your system is up to date:

```
sudo apt update && upgrade
```

We are going to need Apache and Python (+ pip, the package manager) on our system. Issue the following command to install them:

```
sudo apt-get install apache2 libapache2-mod-wsgi-py3 python3 python3-pip python3-venv git curl
```

Not too much of a sweat, isn't it?

# Cloning sources

Change directory to home:

```
cd ~
```

Then clone the repository:

```
https://github.com/izdwuut/flask-wsgi && cd flask-wsgi
```

It's a pretty standard Flask app that utilizes [app factory](https://flask.palletsprojects.com/en/1.1.x/patterns/appfactories/) pattern. The only file worth mentioning is wsgi.py. It tells the server how to run our app. Let's take a closer look:

{{< highlight python "linenos=table" >}}
from app import create_app

application = create_app()
{{< / highlight >}}

`3.` This is all we have to do - create our application instance using `create_app` imported from `app` module.

# Adding virtual environment

Before we proceed, we need to create a Python virtual environment. While in `flask-wsgi` directory, issue the following command to install and activate venv:

```
python3 -m venv venv && source venv/bin/activate
```

Now we can install our requirements:

```
pip3 install -r requirements.txt
```

# Hosting the files

To host our app, we need to copy our sources to `/var/www` directory. Run the following command:

```
sudo cp . /var/www/python-wsgi -r
```

To actually run the app, Apache must be configured first.

# Running Apache and adding a site

The following command will start Apache. You will be prompted for your user's password:

```
systemctl start apache2
```

Apache utilizes a concept of sites. They are config files for your... well, sites. They contain all the data about your website (or a Flask app in our case), from directory on server to port which Apache listens on. They reside in `/etc/apache2/sites-available`. Let's create our site:

```
sudo touch /etc/apache2/sites-available/flask-wsgi.conf
```

Put the following lines in it:

{{< highlight apache "linenos=table" >}}
Listen 5000
<VirtualHost *:5000>
	ServerName 127.0.0.1
	WSGIScriptAlias / /var/www/flask-wsgi/wsgi.py
	WSGIDaemonProcess flask-wsgi python-path=/var/www/flask-wsgi/venv/lib/python3.6/site-packages:/var/www/flask-wsgi
	WSGIProcessGroup flask-wsgi
	<Directory /var/www/flask-wsgi/app/>
		Order allow,deny
		Allow from all
	</Directory>
	ErrorLog ${APACHE_LOG_DIR}/error.log
	LogLevel warn
	CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
{{< / highlight >}}

`1.` Tells the Apache to listen on port `5000`. You are free to change it to any value you want, just remember to also change it in line 2.

`3.` Your server name. In our case it's localhost loopback address.

`4.` The first argument tells apache to serve your app at `/`, and the second tells where the WSGI config is located at.

`5.` Here we spawn a process named `flask-wsgi` and add two values to Python path separated by a colon:

   * `/var/www/flask-wsgi/venv/lib/python3.6/site-packages` - location of site packages in virtual environment. Change the `python3.6` bit if you use different version of Python.
   * `/var/www/flask-wsgi` - location of our script on server

`6.` Create process group `fask-wsgi`.

`7.` Set application directory. Note that it points to `app` directory.

`9`. Allow all connections.

`11-13.` Add logging. `${APACHE_LOG_DIR}` stands for `/var/log/apache2`.

Having that, we can activate the site:

```
sudo a2ensite flask-wsgi.conf && sudo service apache2 reload
```

# Testing the application

The application should be up and running. Check it using `curl`:

```
curl 127.0.0.1:5000
```

This is the output you should get:

```
Hello world!
```

And that's it. Thanks for your attention!
