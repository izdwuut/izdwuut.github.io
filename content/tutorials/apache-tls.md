---
title: "Securing Apache on Ubuntu 18.04 with a Let's Encrypt TLS certificate"
date: 2020-03-02T14:19:00+02:00
draft: false
topics:
    - "Security"
    - "Domains"
    - "Ubuntu"
    - "Apache"
layout: "tutorial"
tags: 
    - "Security"
    - "Domains"
    - "Ubuntu"
    - "Apache"
---

Literally every modern site implements TLS certificate. Why don't we do the same? We will use a free certificate issued by [Let's Encrypt](https://letsencrypt.org/).

I assume that you have Ubuntu and Apache up. We will start with issuing the cert. Let's go!

# Issuing the certificate

Start with installing Certbot. It will add all requirements for us:

```
sudo apt install certbot
```

Issue the cert. I use `example.com` for an example. Change it for your domain's name:

```
sudo certbot certonly --apache -d example.com -d www.example.com
```

You will be asked how you want to authenticate. Select 2:

```
Saving debug log to /var/log/letsencrypt/letsencrypt.log

How would you like to authenticate with the ACME CA?
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1: Spin up a temporary webserver (standalone)
2: Place files in webroot directory (webroot)
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Select the appropriate number [1-2] then [enter] (press 'c' to cancel): 2
```

Enter your email:

```
Enter email address (used for urgent renewal and security notices) (Enter 'c' to
cancel): youremail@example.com
```

Agree with terms of service:

```
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Please read the Terms of Service at
https://letsencrypt.org/documents/LE-SA-v1.2-November-15-2017.pdf. You must
agree in order to register with the ACME server at
https://acme-v02.api.letsencrypt.org/directory
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
(A)gree/(C)ancel: A
```

Decide if you want to share your email with EFF:

```
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Would you be willing to share your email address with the Electronic Frontier
Foundation, a founding partner of the Let's Encrypt project and the non-profit
organization that develops Certbot? We'd like to send you email about our work
encrypting the web, EFF news, campaigns, and ways to support digital freedom.
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
(Y)es/(N)o: N
```

Enter webroot for example.com:

```
Plugins selected: Authenticator webroot, Installer None
Obtaining a new certificate
Performing the following challenges:
http-01 challenge for example.com
http-01 challenge for www.example.com
Input the webroot for example.com: (Enter 'c' to cancel): /var/www/example.com
```

Do the same for www.example.com:

```
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1: Enter a new webroot
2: /var/www/example.com
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Select the appropriate number [1-2] then [enter] (press 'c' to cancel): 1
Input the webroot for www.example.com: (Enter 'c' to cancel): 2  
```

All set. You should see the following message:

```
IMPORTANT NOTES:
 - Congratulations! Your certificate and chain have been saved at
   /etc/letsencrypt/live/example.com/fullchain.pem. Your cert will
   expire on 2020-04-02. To obtain a new or tweaked version of this
   certificate in the future, simply run certbot again with the
   "certonly" option. To non-interactively renew *all* of your
   certificates, run "certbot renew"
 - Your account credentials have been saved in your Certbot
   configuration directory at /etc/letsencrypt. You should make a
   secure backup of this folder now. This configuration directory will
   also contain certificates and private keys obtained by Certbot so
   making regular backups of this folder is ideal.
 - If you like Certbot, please consider supporting our work by:

   Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
   Donating to EFF:                    https://eff.org/donate-le
```

An entry to `/etc/cron.d/certbot` will be automatically added so you don't have to worry about your cert expiring.

# Configuring site

Issue the following command to modify your site config. Change `example.com` to the name of your site:

```
sudo nano /etc/apache2/sites-available/example.com.conf
```

Modify the config:

{{< highlight apache "linenos=table" >}}
<VirtualHost *:80>
        ServerName example.com
        ServerAlias www.example.com
        DocumentRoot /var/www/example.com/
        Redirect permanent / https://example.com
</VirtualHost>

<VirtualHost *:443>
        ...

        SSLEngine on
        SSLCertificateFile /etc/letsencrypt/live/example.com/cert.pem
        SSLCertificateKeyFile /etc/letsencrypt/live/example.com/privkey.pem
        SSLCertificateChainFile /etc/letsencrypt/live/example.com/chain.pem
</VirtualHost>
{{< / highlight >}}

`1.` HTTP config.

`2-3.` Your domain.

`4.` A directory where your website is stored.

`5.` Permamently redirect to HTTPS site defined below.

`8.` HTTPS config.

`11.` Turn [SSL Engine](https://httpd.apache.org/docs/current/mod/mod_ssl.html) on.

`12-14.` Link to your certificate.

Restart Apache for the changes to take effect:

```
sudo service apache2 restart
```

That's it. When you go visit your website, you will see a lock on address bar.