#!/usr/bin/env node
const args = process.argv.slice(1);
const debug = args.some(val => val === '--debug');
if (typeof global.codec === 'undefined') {
    global.codec = require('../dist/lib');
}
const AdeunisCodecsCli = require('../dist/cli');
const cli = new AdeunisCodecsCli(process.argv.slice(2));
if (debug) {
    setTimeout(() => cli.run(), 1000);
} else {
    cli.run();
}
