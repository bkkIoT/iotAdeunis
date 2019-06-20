"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var chalk_1 = __importDefault(require("chalk"));
var cli_table_1 = __importDefault(require("cli-table"));
var fs_1 = require("fs");
var minimist_1 = __importDefault(require("minimist"));
var path_1 = require("path");
var json2csv = require('json-2-csv');
var packagejson = require('../package.json');
/**
 * Adeunis codecs CLI
 *
 * Note: to format tables in VSCode when exporting, use regex │\s(\w+)\s+│\s(\w+)\s+│
 */
var AdeunisCodecsCli = /** @class */ (function () {
    /**
     * Constructor
     * @param _args arguments
     */
    function AdeunisCodecsCli(_args) {
        this.decoder = new codec.Decoder();
        this.encoder = new codec.Encoder();
        this.args = _args;
        this.options = minimist_1.default(_args, {
            string: ['_', 'file', 'devId', 'network', 'deviceType'],
            boolean: ['version', 'csv', 'json'],
            alias: { 'f': 'file', 'v': 'version' }
        });
    }
    /**
     * Run
     */
    AdeunisCodecsCli.prototype.run = function () {
        if (this.options.version) {
            console.log(packagejson.version);
            return;
        }
        switch (this.args[0]) {
            case 'help':
                switch (this.args[1]) {
                    case 'decode':
                        return this.helpDecode();
                    case 'encode':
                        return this.helpEncode(this.options._[2], this.options._[3]);
                    default:
                        return this.help();
                }
            case 'decode':
                if (this.args.length <= 1) {
                    return this.helpDecode();
                }
                // Example: codec decode --file data.json
                // Number are parsed in this.options._ => not OK
                // TODO: improve against Number.MAX_SAFE_INTEGER
                var frames_1 = this.options._
                    .slice(1)
                    .map(function (o) { return typeof o !== 'string' ? o.toString() : o; });
                return this.decode(this.options.file, this.options.devId, this.options.network, this.options.deviceType, frames_1, (this.options.csv), (this.options.json));
            case 'encode':
                if (this.args.length <= 2) {
                    return this.helpEncode(this.options._[2], this.options._[3]);
                }
                // Example: codec encode 0x10 dc --channel1Output=true
                var options = {};
                for (var key in this.options) {
                    if (this.options.hasOwnProperty(key) && key !== '_') {
                        options[key] = this.options[key];
                    }
                }
                return this.encode(this.options._[1], this.options._[2], this.options.network, options);
            default:
                return this.showInfo();
        }
    };
    /**
     * Show info
     */
    AdeunisCodecsCli.prototype.showInfo = function () {
        console.log(chalk_1.default.bold('Usage:') + " " + chalk_1.default.blue('codec') + " <command> [<args> ...] [-- <options>]\n");
        console.log('Available commands:');
        var commandsTable = new cli_table_1.default();
        commandsTable.push({ 'decode': 'Decode frame' }, { 'encode': 'Encode frame' }, { 'help': 'Show help' });
        console.log(commandsTable.toString());
        console.log('Available options:');
        var optionsTable = new cli_table_1.default();
        optionsTable.push({ '-v, --version': 'Print version' }, { '--csv': 'Output in csv format' }, { '--json': 'Output in json format' }, { '...': 'Command specific options' });
        console.log(optionsTable.toString());
    };
    /**
     * Help
     */
    AdeunisCodecsCli.prototype.help = function () {
        console.log(chalk_1.default.bold('Usage:') + " codec " + chalk_1.default.blue('help') + " <command>\n");
        console.log('Available commands:');
        var table = new cli_table_1.default();
        table.push({ 'decode': 'Decode frame' }, { 'encode': 'Encode frame' });
        console.log(table.toString());
    };
    /**
     * Help on decode
     */
    AdeunisCodecsCli.prototype.helpDecode = function () {
        console.log(chalk_1.default.bold('Usage:') + " codec " + chalk_1.default.blue('decode') + " <frame1> [<frame2> ...]"
            + " [--deviceType <device_type>] [--network lora868|sigfox]\n");
        console.log('Available frame codes and device types:');
        var table = new cli_table_1.default({ head: ['Frame code', 'Device type'] });
        var rows = this.decoder.getSupported()
            .filter(function (sf) { return sf.frameCode !== -1; })
            .sort(function (sfa, sfb) {
            var diff = sfa.frameCode - sfb.frameCode;
            if (diff === 0) {
                diff = sfa.deviceType.localeCompare(sfb.deviceType);
            }
            return diff;
        })
            .map(function (sf) { return (['0x' + sf.frameCode.toString(16), sf.deviceType]); });
        table.push.apply(table, rows);
        console.log(table.toString());
    };
    /**
     * Help on encode
     * @param deviceType device type
     * @param frameCode frame code
     */
    AdeunisCodecsCli.prototype.helpEncode = function (deviceType, frameCode) {
        if (deviceType && frameCode !== 0) {
            console.log('Available encode options:');
            var inputDataTypes = this.encoder.getInputDataTypes(deviceType, frameCode);
            var table = new cli_table_1.default({ head: ['Option', 'Type'] });
            var rows = [];
            for (var key in inputDataTypes) {
                if (inputDataTypes.hasOwnProperty(key)) {
                    rows.push([key, inputDataTypes[key]]);
                }
            }
            table.push.apply(table, rows);
            console.log(table.toString());
        }
        else {
            console.log(chalk_1.default.bold('Usage:') + " codec " + chalk_1.default.blue('encode') + " <device_type> <frame_code>"
                + " [--network lora868|sigfox] [-- <encode_options>]\n");
            console.log('Available device types and frame codes:');
            var supported = this.encoder.getSupported();
            var table = new cli_table_1.default({ head: ['Device type', 'Frame code'] });
            var rows = supported.map(function (sf) { return ([
                sf.deviceType,
                sf.frameCode === -1 ? 'any' : '0x' + sf.frameCode.toString(16)
            ]); });
            table.push.apply(table, rows);
            console.log(table.toString());
        }
    };
    /**
     * Decode
     * @param filePath file path to parse
     * @param devId device ID
     * @param network network: lora868 or sigfox
     * @param frames frames to decode
     * @param deviceType device type
     */
    AdeunisCodecsCli.prototype.decode = function (filePath, devId, network, deviceType, frames, csvOutput, jsonOutput) {
        // Fix => change minimist to keep 0 before frame value
        if (deviceType === 'repeater') {
            frames = frames.map(function (frame) { return '0'.concat(frame); });
        }
        if (filePath) {
            var fileString = fs_1.readFileSync(path_1.join(__dirname, filePath), 'utf8');
            var data = JSON.parse(fileString);
            if (!data.sections) {
                process.exit();
            }
            for (var _i = 0, _a = data.sections; _i < _a.length; _i++) {
                var section = _a[_i];
                if (section.enabled) {
                    console.log("\n======================================== " + section.title + " ========================================");
                    this.printDecoded(section.frames, devId, network, deviceType, csvOutput, jsonOutput);
                }
            }
        }
        else if (frames && frames.length > 0) {
            this.printDecoded(frames, devId, network, deviceType, csvOutput, jsonOutput);
        }
    };
    /**
     * Encode
     * @param deviceType device type
     * @param frameCode frame code
     * @param network network: lora868 or sigfox
     * @param data data
     */
    AdeunisCodecsCli.prototype.encode = function (deviceType, frameCode, network, data) {
        var payloadString = this.encoder.encode(deviceType, frameCode, network, data);
        console.log(payloadString);
    };
    /**
     * Print decoded frames
     * @param frames frames to print
     * @param devId device ID
     * @param network network: lora868 or sigfox
     * @param deviceType device type
     */
    AdeunisCodecsCli.prototype.printDecoded = function (frames, devId, network, deviceType, csvOutput, jsonOutput) {
        this.decoder.clearStoredData();
        if (deviceType) {
            this.decoder.setDeviceType(deviceType);
        }
        for (var _i = 0, frames_2 = frames; _i < frames_2.length; _i++) {
            var payloadString = frames_2[_i];
            var content = this.decoder.decode(payloadString, devId, network);
            if (csvOutput) {
                var json2csvCallback = function (err, csv) {
                    if (err) {
                        throw err;
                    }
                    console.log(csv);
                };
                var options = {
                    delimiter: {
                        wrap: '"',
                        field: ';',
                        eol: '\n' // Newline delimiter
                    },
                    prependHeader: true,
                    sortHeader: false,
                    excelBOM: true,
                    trimHeaderValues: true,
                    trimFieldValues: true,
                    keys: null
                };
                return json2csv.json2csv(content, json2csvCallback, options);
            }
            if (jsonOutput) {
                return console.log(JSON.stringify(content));
            }
            var table = new cli_table_1.default();
            for (var key in content) {
                if (content.hasOwnProperty(key)) {
                    var row = {};
                    row[key] = this.defaultWhenNil(content[key], '');
                    table.push(row);
                }
            }
            console.log(table.toString());
        }
    };
    /**
     * Use default value when null or undefined
     * @param value value to check
     * @param defaultValue default value
     */
    AdeunisCodecsCli.prototype.defaultWhenNil = function (value, defaultValue) {
        if (value === null || value === undefined) {
            return defaultValue;
        }
        return value;
    };
    return AdeunisCodecsCli;
}());
module.exports = AdeunisCodecsCli;
//# sourceMappingURL=cli.js.map