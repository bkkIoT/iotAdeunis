import chalk from 'chalk';
import Table from 'cli-table';
import { readFileSync } from 'fs';
import minimist from 'minimist';
import { join } from 'path';

const json2csv = require('json-2-csv');
const packagejson = require('../package.json');

/**
 * Adeunis codecs CLI
 *
 * Note: to format tables in VSCode when exporting, use regex │\s(\w+)\s+│\s(\w+)\s+│
 */
class AdeunisCodecsCli {

    private args: string[];
    private options: minimist.ParsedArgs;

    private decoder = new codec.Decoder();
    private encoder = new codec.Encoder();

    /**
     * Constructor
     * @param _args arguments
     */
    constructor(_args: string[]) {
        this.args = _args;
        this.options = minimist(_args, {
            string: ['_', 'file', 'devId', 'network', 'deviceType'],
            boolean: ['version', 'csv', 'json'],
            alias: { 'f': 'file', 'v': 'version' }
        });
    }

    /**
     * Run
     */
    public run() {
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
                const frames = this.options._
                    .slice(1)
                    .map(o => typeof o !== 'string' ? (o as any).toString() : o);

                return this.decode(this.options.file,
                    this.options.devId,
                    this.options.network,
                    this.options.deviceType,
                    frames,
                    (this.options.csv),
                    (this.options.json));
            case 'encode':
                if (this.args.length <= 2) {
                    return this.helpEncode(this.options._[2], this.options._[3]);
                }

                // Example: codec encode 0x10 dc --channel1Output=true
                const options: any = {};
                for (const key in this.options) {
                    if (this.options.hasOwnProperty(key) && key !== '_') {
                        options[key] = this.options[key];
                    }
                }
                return this.encode(this.options._[1], this.options._[2], this.options.network, options);
            default:
                return this.showInfo();
        }
    }

    /**
     * Show info
     */
    public showInfo() {
        console.log(`${chalk.bold('Usage:')} ${chalk.blue('codec')} <command> [<args> ...] [-- <options>]\n`);

        console.log('Available commands:');
        const commandsTable = new Table();
        commandsTable.push({ 'decode': 'Decode frame' }, { 'encode': 'Encode frame' }, { 'help': 'Show help' });
        console.log(commandsTable.toString());

        console.log('Available options:');
        const optionsTable = new Table();
        optionsTable.push(
            { '-v, --version': 'Print version' },
            { '--csv': 'Output in csv format' },
            { '--json': 'Output in json format' },
            { '...': 'Command specific options' });
        console.log(optionsTable.toString());
    }

    /**
     * Help
     */
    public help() {
        console.log(`${chalk.bold('Usage:')} codec ${chalk.blue('help')} <command>\n`);

        console.log('Available commands:');
        const table = new Table();
        table.push({ 'decode': 'Decode frame' }, { 'encode': 'Encode frame' });
        console.log(table.toString());
    }

    /**
     * Help on decode
     */
    public helpDecode() {
        console.log(`${chalk.bold('Usage:')} codec ${chalk.blue('decode')} <frame1> [<frame2> ...]`
            + ` [--deviceType <device_type>] [--network lora868|sigfox]\n`);

        console.log('Available frame codes and device types:');
        const table = new Table({ head: ['Frame code', 'Device type'] });
        const rows = this.decoder.getSupported()
            .filter(sf => sf.frameCode !== -1)
            .sort((sfa, sfb) => {
                let diff = sfa.frameCode - sfb.frameCode;
                if (diff === 0) {
                    diff = sfa.deviceType.localeCompare(sfb.deviceType);
                }
                return diff;
            })
            .map(sf => (['0x' + sf.frameCode.toString(16), sf.deviceType]));
        table.push(...rows);
        console.log(table.toString());
    }

    /**
     * Help on encode
     * @param deviceType device type
     * @param frameCode frame code
     */
    public helpEncode(deviceType: string, frameCode: any) {
        if (deviceType && frameCode !== 0) {
            console.log('Available encode options:');
            const inputDataTypes = this.encoder.getInputDataTypes(deviceType, frameCode);
            const table = new Table({ head: ['Option', 'Type'] });
            const rows: [string, string][] = [];
            for (const key in inputDataTypes) {
                if (inputDataTypes.hasOwnProperty(key)) {
                    rows.push([key, inputDataTypes[key]]);
                }
            }
            table.push(...rows);
            console.log(table.toString());
        } else {
            console.log(`${chalk.bold('Usage:')} codec ${chalk.blue('encode')} <device_type> <frame_code>`
                + ` [--network lora868|sigfox] [-- <encode_options>]\n`);

            console.log('Available device types and frame codes:');
            const supported = this.encoder.getSupported();
            const table = new Table({ head: ['Device type', 'Frame code'] });
            const rows = supported.map(sf => ([
                sf.deviceType,
                sf.frameCode === -1 ? 'any' : '0x' + sf.frameCode.toString(16)
            ]));
            table.push(...rows);
            console.log(table.toString());
        }
    }

    /**
     * Decode
     * @param filePath file path to parse
     * @param devId device ID
     * @param network network: lora868 or sigfox
     * @param frames frames to decode
     * @param deviceType device type
     */
    public decode(
        filePath: string, devId: string, network: any, deviceType: string,
        frames: string[], csvOutput: boolean, jsonOutput: boolean) {
        // Fix => change minimist to keep 0 before frame value
        if (deviceType === 'repeater') {
            frames = frames.map((frame) => '0'.concat(frame));
        }

        if (filePath) {
            const fileString = readFileSync(join(__dirname, filePath), 'utf8');
            const data = JSON.parse(fileString);
            if (!data.sections) {
                process.exit();
            }

            for (const section of data.sections) {
                if (section.enabled) {
                    console.log(`
======================================== ${section.title} ========================================`);
                    this.printDecoded(section.frames, devId, network, deviceType, csvOutput, jsonOutput);
                }
            }
        } else if (frames && frames.length > 0) {
            this.printDecoded(frames, devId, network, deviceType, csvOutput, jsonOutput);
        }
    }

    /**
     * Encode
     * @param deviceType device type
     * @param frameCode frame code
     * @param network network: lora868 or sigfox
     * @param data data
     */
    public encode(deviceType: string, frameCode: any, network: any, data: any) {
        const payloadString = this.encoder.encode(deviceType, frameCode, network, data);
        console.log(payloadString);
    }

    /**
     * Print decoded frames
     * @param frames frames to print
     * @param devId device ID
     * @param network network: lora868 or sigfox
     * @param deviceType device type
     */
    private printDecoded(
        frames: string[], devId: string, network: any, deviceType: string, csvOutput: boolean, jsonOutput: boolean) {
        this.decoder.clearStoredData();
        if (deviceType) {
            this.decoder.setDeviceType(deviceType);
        }
        for (const payloadString of frames) {
            const content = this.decoder.decode(payloadString, devId, network);

            if (csvOutput) {
                const json2csvCallback = function (err: any, csv: any) {
                    if (err) { throw err; }
                    console.log(csv);
                };
                const options = {
                    delimiter : {
                        wrap  : '"', // Double Quote (") character
                        field : ';', // Comma field delimiter
                        eol   : '\n' // Newline delimiter
                    },
                    prependHeader    : true,
                    sortHeader       : false,
                    excelBOM         : true,
                    trimHeaderValues : true,
                    trimFieldValues  : true,
                    keys: null
                };
                return json2csv.json2csv(content, json2csvCallback, options);
            }

            if (jsonOutput) {
                return console.log(JSON.stringify(content));
            }

            const table = new Table();
            for (const key in content) {
                if (content.hasOwnProperty(key)) {
                    const row: any = {};
                    row[key] = this.defaultWhenNil(content[key], '');
                    table.push(row);
                }
            }

            console.log(table.toString());
        }
    }

    /**
     * Use default value when null or undefined
     * @param value value to check
     * @param defaultValue default value
     */
    private defaultWhenNil<T>(value: T, defaultValue: T) {
        if (value === null || value === undefined) {
            return defaultValue;
        }
        return value;
    }

}

export = AdeunisCodecsCli;
