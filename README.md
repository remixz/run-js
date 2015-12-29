# run-js

A prototyping server that just works. [*A first revision!*](#the-future)

*Click to enlarge image:*
[![run-js demo](https://s3.amazonaws.com/f.cl.ly/items/3V3Z1U1L0x352u032J2k/run-js-demo.gif)](https://s3.amazonaws.com/f.cl.ly/items/3V3Z1U1L0x352u032J2k/run-js-demo.gif)

## Installation

Requires Node.js >=4.0.0.

```bash
$ npm install run-js --global
```

## Usage

Enter a folder you want to run scripts in, and type `run-js`.

```bash
$ cd your/folder
$ run-js
```

It will print out the URL it's running on. From there, just visit any of your scripts in the browser, and they'll just work.

## Features

### Instantly working scripts

There's no HTML files you have to create, no compile steps for your code to work, and no need to even manually install dependencies. Just start `run-js` in a folder, write some code, and open it in the browser. `run-js` supports JavaScript (with ES2015 and JSX enabled via Babel), CoffeeScript, and TypeScript out of the box. When you require a dependency, `run-js` will automatically install it for you, if it's not installed already. Plus, the default HTML page includes a `<div>` tag with an `id` of `root`, so that you can quickly append elements from a library, such as React.

### Scripts as the index file

Creating a file named `index.js` (or whatever type of file you prefer) will act as the index for the path you specify. For example, creating `index.js` in the root of where you ran `run-js` will use that script when you visit `http://localhost:60274`.

### Source maps

No need to go through the hullabaloo of setting up source maps. They're just there, and they just work.

### Custom HTML pages

By default, `run-js` will render a page when you visit a file in the browser. However, if you need your own custom page, it's easy to do. Just create a `.html` file with the same name as your script. For example, if you had `foo.js`, create a `foo.html` in the same folder, and it'll use that for the template. It'll automatically insert your compiled script as well. (*Make sure to have a `<body>` tag for this to work.*)

## Implementation

run-js is powered by [Browserify](https://github.com/substack/node-browserify), and various transforms for it. I like [Webpack](https://github.com/webpack/webpack) as well, but I enjoy working with Browserify more, and find it easier to use overall, while still being able to do what I want to. I don't think run-js will need to change to Webpack, or some other future bundler, to get the functionality that's wanted. Of course, that could change... :wink:. The transform [installify](https://github.com/hughsk/installify) is used automatically install new dependencies. Really cool stuff!

Aside from Browserify, run-js uses [Express](https://github.com/strongloop/express) to power the web server. Nothing too fancy there, really. run-js has an in-memory cache powered by [LevelUP](https://github.com/Level/levelup) and [MemDOWN](https://github.com/level/memdown). That could be migrated to a file cache pretty easily, but I'm not sure if it's really needed. It might be in the future, though, which is why I used LevelUP.

## Inspiration

* [**@vjeux**](https://github.com/vjeux)'s challenge to create a better JavaScript prototyping environment: http://blog.vjeux.com/2015/javascript/challenge-best-javascript-setup-for-quick-prototyping.html
* [**@ericclemmons**](https://github.com/ericclemmons)'s post about JavaScript fatigue: https://medium.com/@ericclemmons/javascript-fatigue-48d4011b6fc4
* Modules such as [budo](https://github.com/mattdesl/budo), [beefy](https://github.com/chrisdickinson/beefy), and [wzrd](https://github.com/maxogden/wzrd), which all do a lot of what run-js does, but with less defaults, and just for running one file. I like those modules a lot, and I think they definitely work for a different type of workflow. The main difference with run-js is that it's aimed a bit more towards newbies, hence why it runs any file in the directory. Essentially, run-js is a playground: Everything just goes, and it's lots of fun! It's not really meant for serious work, but instead just trying things out.

## The Future

Right now, this is just a taste of what I've envisioned for this project. The goal for this project is for it to become the de facto way for people new to JavaScript to get started. If not de facto, then at least a very easy way to get started.

Here are some ideas of what I want to do with this project. They range from small to big, and are all open to anyone who's interested in working on them.

* **Auto-reloading on file changes.** This would be nice to have, and probably not too hard to implement.
* **Hot module replacement.** Similar to auto-reloading, but a bit more involved. Would be really nice for React projects.
* **More extensibility.** For this first version, the app isn't very extensible for adding new scripting languages, or even different types of files, like styles. I want to make it so that anything could be compiled by this project. Of course, including literally everything would be a bit overkill, so a way to easily add new file handlers is definitely needed. There'll always be a set of commonly used handlers included, like there is now for scripts. With styles, for example, it'd maybe include handlers for SASS and LESS by default.
* **Create a GUI.** A CLI is alright, but for someone brand new to coding, opening up a Terminal, installing node and npm, and then installing this module can be a little daunting. My goal is that this would be a one click solution. With Electron, this is totally possible! The flow that I'm thinking of is that the user launches the app, and then just starts coding. It'll create a directory for their code to live automatically, though the user could change it if they want.
* **Deploys.** It would be really cool if the user could instantly deploy their code right from the app (maybe CLI too, though I really envision most of this app as a GUI). The deploy would do all the magic, like minifying and such. I'm not sure where exactly it'd be stored, though. I like [surge](https://surge.sh) a lot. Maybe it could hook into that?
