# xdy-dragonbane-workbench

![](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Fxdy%2Fxdy-dragonbane-workbench%2Fmain%2Fstatic/%2Fmodule.json&label=version&query=$.version&colorB=blue)
![GitHub release](https://img.shields.io/github/release-date/xdy/xdy-dragonbane-workbench) [![GitHub commits](https://img.shields.io/github/commits-since/xdy/xdy-dragonbane-workbench/latest)](https://github.com/xdy/xdy-dragonbane-workbench/commits/)  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com) ![GitHub contributors](https://img.shields.io/github/contributors/xdy/xdy-dragonbane-workbench)

![](https://img.shields.io/endpoint?url=https%3A%2F%2Ffoundryshields.com%2Fversion%3Fstyle%3Dflat%26url%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fxdy%2Fxdy-dragonbane-workbench%2Fmain%2Fstatic%2Fmodule.json)
![](https://img.shields.io/endpoint?url=https%3A%2F%2Ffoundryshields.com%2Fsystem%3FnameType%3Dshort%26showVersion%3D1%26style%3Dflat%26url%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fxdy%2Fxdy-dragonbane-workbench%2Fmain%2Fstatic%2Fmodule.json)

![GitHub all releases](https://img.shields.io/github/downloads/xdy/xdy-dragonbane-workbench/total) ![the latest version zip](https://img.shields.io/github/downloads/xdy/xdy-dragonbane-workbench/latest/xdy-dragonbane-workbench.zip) ![Forge installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Fxdy-dragonbane-workbench)

Various qol features for the Foundry VTT Drakar & Demoner / Dragonbane system.

## Features

* General
  * Option to remind when attack is made by a token that probably can't attack (due to being dead or grappled), or just
    cancel impossible attacks.
  * Option to remind when an attack is made without targeting, or just cancel untargeted attacks.
  * Option to toggle temporary rename of tokens (by adding an adjective first or number last) from hud, when dragging to
    scene while holding control or by using keybind when one or more tokens are selected.

* Experimental features:
  * If a feature name starts with mentioning that it's experimental, use with caution. It's probably barely tested and
    may wreck your chat or brick your world. (No warranty expressed or implied. No user serviceable parts inside. Void
    where prohibited. Ei saa peittää. Do not taunt happy fun ball: https://www.youtube.com/watch?v=GmqeZl8OI2M)

* Deprecated features (will be removed eventually):
  * None currently.

* Recently removed features:
  * None currently

* New Keybinds in Configure Controls
  * Optional keybinds for executing a macro in any position on any page of the macro hotbar, whether that page is
    currently showing or not.

Hooks (for other modules to use):

* `xdy-dragonbane-workbench.moduleReady`: Triggered when the Workbench is Ready (i.e. has processed the 'ready'
  hook.)

## Installation

Install by either searching for xdy-dragonbane-workbench in [FoundryVTT's](https://foundryvtt.com/) Module tab and
clicking Install or by clicking the 'Install Module' button in that tab and entering the following as the Manifest
URL: https://github.com/xdy/xdy-dragonbane-workbench/releases/latest/download/module.json

If you want to install this module for older versions, download xdy-dragonbane-workbench.zip from one of the following
links and unzip it into your modules/xdy-dragonbane-workbench folder. Make sure to lock the module version, and remember
that these versions are not supported. (They probably work, but if they don't, you're on your own.)

* No links to older versions yet, as there are no older versions

### Patch Notes:

See [CHANGELOG.md](CHANGELOG.md)

### Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) and [CONTRIBUTORS.md](CONTRIBUTORS.md)

## The Programmer's Mantra

```

It is by caffeine alone I set my mind in motion
It is by the beans of Java that thoughts acquire speed
The hands acquire shakes
The shakes become a warning
It is by caffeine alone I set my mind in motion

```

* Help xdy stay awake long enough to add more
  bugs! [![Donate via Ko-Fi](https://img.shields.io/badge/support-ko--fi-ff4646?style=flat-square&logo=ko-fi)](https://ko-fi.com/xdy1337)

### Licenses

Project Licensing:

* Everything in this project that is not covered by one of the following license exceptions is made available under the
  Apache License (see [LICENSE.MD](LICENSE.md)) This project is partly based
  on https://github.com/typhonjs-fvtt-demo/template-svelte-ts-pf2e and partly on my
  own https://github.com/xdy/xdy-pf2e-workbench

Virtual Table Top Platform Licenses:

* Foundry VTT support is covered by the following
  license: [Limited License Agreement for module development](https://foundryvtt.com/article/license/).

Asset licenses:

* The cover image is modified by me
  from [Picture taken at a garage exhibit at LACMA.](https://unsplash.com/photos/1UimDTf69ho)
  by [Elmer Mercanas](https://unsplash.com/@elmercanasjr) under the [Unsplash License](https://unsplash.com/license)

Dragonbane / Drakar och Demoner third-party license:

* Dragonbane Workbench är en oberoende publikation av Jonas Karlsson och har ingen koppling till Fria Ligan AB. Den är
  publicerad under tredjepartslicensen för Drakar och Demoner (version 1.0). Drakar och Demoner och Ereb Altor är
  registrerade varumärken tillhörande Fria Ligan AB.

* This game is not affiliated with, sponsored, or endorsed by Fria Ligan AB. This Supplement was created under Fria
  Ligan
  AB’s Dragonbane Third Party Supplement License.

* The Dragonbane third-party license (version 1.0) can be found in
  English [here](https://freeleaguepublishing.com/wp-content/uploads/2023/11/Dragonbane-License-Agreement.pdf) and in
  Swedish [here](https://freeleaguepublishing.com/wp-content/uploads/2023/11/Drakar-och-Demoner-tredjepartslicens.pdf).

<!--suppress CheckImageSize -->
<img src="static/assets/media/dragonbane-licenslogo-rod.webp" width="45%" alt="Dragonbane compatibility logo">
<!--suppress CheckImageSize -->
<img src="static/assets/media/drakar-och-demoner-licenslogo-rod.webp" width="45%" alt="Drakar och Demoner kompatibilitetslogga">

