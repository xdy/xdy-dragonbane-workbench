Features I'm considering porting over from xdy-pf2e-workbench

* TDDO Mystification section
  * TODO Might not be needed, test the built in one. Needs internationalization support.
    * Basically I want:
      * 'Anka' -> 'Trevlig Anka' (random adjective first)
      * 'Anka' -> 'Anka 42' (number last)
      * 'Anka' -> 'Pelle Anka' (give it a first name and/or nickname from a random list)
      * 'Anka' -> 'Varelse' (if the players have never met one)
      * Keep the pf2e workbench feature to mystify/demystify all creatures with the same actor name.

* Quality of Life section
  * TODO Option to hold CTRL while casting a spell to cast it as a whispered chat message.
    * Option to cast the normal way if a party member knows the spell, and an option to always cast privately for
      non-allies/non-partymembers/NPCs.
  * TODO Option to switch the default 'hold shift' for attacks/skillrolls

* World Automation section
  * TODO Enable/disable the option to autoroll damage on a hit.
  * TODO Option to drop all held items on becoming unconscious.

* Client Automation section
  * TODO Optional settings to (if the GM allows it) automatically roll damage on a hit for strikes and/or spell
    attacks.


* House Rules
  * TODO

* V12ify
  * TODO Remove transparency where I can, move tabs to top, expand by default, set chat to default tab, remove
    collapse button, fix other irritating
    misfeatures of v13. (Not sure if it's a 'my way or the highway' or if I can make the parts configurable.)

* No section
  * TODO Optional setting to automatically collapse chat cards with an h3 header (intended for item cards like spells,
    feats, items, actions, etc). Can be configured to default to collapsed or expanded.
  * TODO Option to either expand all damage cards/action cards/attach cards, or only expand new cards. If the latter,
    on a
    refresh the last three messages are expanded if they are damage cards.

API:
A few potentially useful internal functions have been made available for macro use. Name and a simple example
of each can be found below:

```
TODO
```

HOOKS (for other modules to use):

* TODO `xdy-dragonbane-workbench.moduleReady`: Triggered when the Workbench is Ready (i.e. has processed the 'ready'
  hook
  once.)
* TODO `xdy-dragonbane-workbench.tokenCreateMystification`: Triggered when a token is being created and is going to be
  mystified. If a module returns `false` the token's name will not by mystified.


* New Keybinds in Configure Controls
  * TODO Optional keybind to mystify a creature.
  * TODO Optional keybinds for executing a macro in any position on any page of the macro hotbar, whether that page is
    currently showing or not.
  * TODO ??? Optional keybind called "Add user targets" that lets the GM add token targets to other users by selecting
    or
    hovering over those tokens, pressing the keybind and choosing which user should target those tokens. Enables GMs
    to help players having problems with targeting.

* Assorted other features
  * The compendium "Dragonbane Workbench Items (xdy-dragonbane-workbench-items)" contains a few useful effects and
    items:
    * TODO
  * The compendium "Dragonbane Workbench Macros (xdy-dragonbane-workbench-macros)" contains a few macros you might
    find useful.
    * TODO

* TODO There are a few more compendiums included with this module with assorted internal utility macros and items that
  do not
  need to be imported, as indicated by their labels all ending with 'do not import'

