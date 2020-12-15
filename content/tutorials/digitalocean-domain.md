---
title: "Mange a domain with Domain.com and DigitalOcean"
date: 2020-03-01T20:21:00+02:00
draft: false
topics:
    - "DNS"
    - "Domains"
    - "DigitalOcean"
layout: "tutorial"
tags: 
    - "DigitalOcean"
    - "Domains"
    - "DNS"
---

_Quick update_: if you need a primer on domains in general, check a [magnificent](https://www.websiteplanet.com/blog/ultimate-guide-to-choosing-a-domain-name/) resource that Alejandra has sent me. Many thanks!

Most of the developers sooner or later will have to buy a domain for one of their projects, let it be hobby or commercial. I had this problem recently and most solutions that I've found were lacking, so I thought of this tutorial.

I assume that you have already bought a domain at [Domain.com](https://domain.com) and have created [a droplet](https://www.digitalocean.com/products/droplets/) on [DigitalOcean](https://www.digitalocean.com). Let's start, shall we?

# DigitalOcean's end

On your project's page, select `Add a domain` frtom a dropdown menu:

![](/img/posts/digitalocean-domain/digitalocean/step-1.png)

Enter your domain name (I've used `domain-tutorial.com` for an example) and hit `Add domain`:

![](/img/posts/digitalocean-domain/digitalocean/step-2.png)

Everything should be mostly fine at this moment. Add a new `A` record with `www.` prefix, then hit `Create record`:

![](/img/posts/digitalocean-domain/digitalocean/step-3.png)

Your `DNS records` should look like this:

![](/img/posts/digitalocean-domain/digitalocean/step-4.png)

# Domain.com's end

For this part of the tutorial I'll use my pre-existing [gogpicker.com](https://gogpicker.com/) domain. In case you're interested, it's for my hobby project for Reddit. It aids users of r/GiftofGames subreddit in picking winners of Steam giveaways.

In your user panel, click on `Manage` next to your domain:

![](/img/posts/digitalocean-domain/domain-com/step-1.png)

From the menu on the left select `DNS & Nameservers`.

![](/img/posts/digitalocean-domain/domain-com/step-2.png)

Click on `Add a nameserver`. You need to add 3 nameservers:

* ns1.digitalocean.com
* ns2.digitalocean.com
* ns3.digitalocean.com

![](/img/posts/digitalocean-domain/domain-com/step-3.png)

The last step is to remove `domain.com` DNS as they are no longer needed:

![](/img/posts/digitalocean-domain/domain-com/step-4.png)

Everything is set. Now you have to wait up to 48h for DNS to propagate and your changes will take efect.