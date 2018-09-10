---
title: "My First Post"
date: 2018-09-04T13:11:29+02:00
draft: false
menu: "main"
---
Hi!
{{<highlight python "linenos=pre,nowrap=tru">}}
import steam
from configparser import ConfigParser

settings = ConfigParser()
settings.read('settings.ini')
api = steam.WebAPI(settings['steam']['api_key'])
username = "izdwuut"
steam_id = api.call('ISteamUser.ResolveVanityURL', vanityurl=username)['response']['steamid']
level = api.call('IPlayerService.GetSteamLevel', steamid=steam_id)['response']['player_level']
print("Twoj poziom na Steamie: " + str(level) + ".")
{{</highlight>}}