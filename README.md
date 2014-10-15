# SYNCTORY

Synctory is a web tool for building multi-threaded narratives.


## What?
Traditional storytelling implies a passive audience. Increasingly we've seen different artistic mediums play with parallel narratives to weave richer narrative tapestries, but they are still experienced linearly by the audience. With new technologies we now have the capability to make multi-linear narratives for large audiences.

Multi-linear narratives require the viewer to have some choice in which things they observe. Narratives are [happening simultaneously](#terminology); to watch one is to miss out on the other. This allows the artist great opportunities to play with perspective and pacing.

Synctory's output is something that looks very much like a film script. This can be used for the creation of immersive plays, interactive films or narrative-based video games.


## How?

Synctory uses four concepts to ease the creation of multi-linear narratives. They are

* Locations - where an scene is set
* Entities - unique moveable object, such as Characters or items
* Steps - each step marks a point in time, synced across all locations.
* Units - Unit is the smallest unit of a Synctory script. It's where dialog and actions live.

Have a look at the video tutorial for more on how the system works.

## Where?

Synctory is currently available online at [synctory.jit.su][site].
If you would like to run your own server or contribute to the project see the [github page][github].

##Links
Synctory uses a plethora of great libraries and frameworks. It is still an early build, so please post any issues or suggestions on the github page.

* [hoodie] - awesome web-based text editor
* [nodejitsu] - node.js hosting
* [node.js] - evented I/O for the backend
* [jQuery] -
* [mootools] - dependancy to be removed (one library needs translation)

## Note on Terminology <a name="terminology"></a>

To the best of my knowledge, the terms 'parallel narrative' and 'multi-threaded narrative' are ill-defined. In this project I'm using them as:

* Parallel Narrative - when more than one thing is happening at once, but the audience experiences them one after the other (A then B).
* Multi-threaded Narrative - when more than one thing is happening at once, and we have one degree of choice to which we experience (A or B).

Linda Aronson has an [alternative take] [aronson] on the terminology.


Version
----

0.1


License
----

[MIT]

[aronson]:http://www.lindaaronson.com/six-types-of-parallel-narrative.html
[hoodie]:http://hood.ie/
[node.js]:http://nodejs.org
[nodejitsu]:http://nodejitsu.com
[jQuery]:http://jquery.com
[mootools]:http://mootools.net
[MIT]:http://opensource.org/licenses/MIT
[site]:http://synctory.jit.su
[github]:https://github.com/chrismcmath/Synctory
