/**
 * Adeunis codecs CLI
 *
 * Note: to format tables in VSCode when exporting, use regex │\s(\w+)\s+│\s(\w+)\s+│
 */
declare class AdeunisCodecsCli {
    private args;
    private options;
    private decoder;
    private encoder;
    /**
     * Constructor
     * @param _args arguments
     */
    constructor(_args: string[]);
    /**
     * Run
     */
    run(): void;
    /**
     * Show info
     */
    showInfo(): void;
    /**
     * Help
     */
    help(): void;
    /**
     * Help on decode
     */
    helpDecode(): void;
    /**
     * Help on encode
     * @param deviceType device type
     * @param frameCode frame code
     */
    helpEncode(deviceType: string, frameCode: any): void;
    /**
     * Decode
     * @param filePath file path to parse
     * @param devId device ID
     * @param network network: lora868 or sigfox
     * @param frames frames to decode
     * @param deviceType device type
     */
    decode(filePath: string, devId: string, network: any, deviceType: string, frames: string[], csvOutput: boolean, jsonOutput: boolean): void;
    /**
     * Encode
     * @param deviceType device type
     * @param frameCode frame code
     * @param network network: lora868 or sigfox
     * @param data data
     */
    encode(deviceType: string, frameCode: any, network: any, data: any): void;
    /**
     * Print decoded frames
     * @param frames frames to print
     * @param devId device ID
     * @param network network: lora868 or sigfox
     * @param deviceType device type
     */
    private printDecoded;
    /**
     * Use default value when null or undefined
     * @param value value to check
     * @param defaultValue default value
     */
    private defaultWhenNil;
}
export = AdeunisCodecsCli;
