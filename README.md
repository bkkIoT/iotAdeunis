# Adeunis codecs

TypeScript project for JavaScript/Node.js library of Adeunis codecs.

This document explains how to modify, compile and package the library. For beginners, developments can be done directly on generated JavaScript files (no compilation).

# Prerequisites

A __Node.js__ + __npm__ environment is required to start developments:
* [Node.js](https://nodejs.org/), JavaScript runtime
* [npm](https://www.npmjs.com/), package manager for JavaScript (shipped with Node.js)

A knowledge of [TypeScript language](https://www.typescriptlang.org/) is also recommended.

# Getting started

Go to project folder and install dependencies:
```bash
npm install
```
 
# Project structure

```
bin/                         library entry point
dist/                        compiled .js files and static files
|- demo-page.html            example of how to use the library
|- lib.public.js             library file
src/                         project .ts source code
|- core/                     core module (singleton services)
|- demo/                     basic demo pages that use lib.public.js
|- products/                 products folder
|  |- dc/                    dc module (Dry Contact)
|     |- 0x10.builder.ts     builder file for dc 0x10 frame
|     |- 0x40.parser.spec.ts parser unit tests file for dc 0x40 frame
|     |- 0x40.parser.ts      parser file for dc 0x40 frame
|     +- ...                 additional frame handlers
|  |- pulse/                 pulse module 
|  |- temp/                  temp module 
|  +- ...                    additional products
|- shared/                   shared module
|- decoder.ts                decoder entry point
|- encoder.ts                encoder entry point
+- cli.ts                    CLI entry point
```

```lib.public.js``` is the generated standalone library file used in [demonstration web page](http://codec-adeunis.com/).

# Main tasks

Task automation is based on [NPM scripts](https://docs.npmjs.com/misc/scripts).

Tasks                         | Description
------------------------------|---------------------------------------------------------------------------------------
npm start                     | Build library (see ```npm run build```)
npm test                      | Run unit tests once
npm run lint                  | Lint code
npm run build                 | Build project as single .js file
npm run build:lib             | Build library as standalone single .js file
npm run build:cli             | Build CLI as CommonJS module
npm run build:test            | Build tests as CommonJS modules
npm run pack:exe              | Package codec library into .exe file (Windows x64)
npm run pack:linux            | Package codec library fo linux (Linux x64)
npm run docs                  | Display project documentation


# Annex

## codec CLI

More information [here](cli.md).

## Source code generation
To get version from package.json, do global `npm run build`

## Quick test
Basic demo pages are available in generic\src\demo\