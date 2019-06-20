/// <reference types="node" />
declare namespace codec {
    /**
     * Decoder class.
     *
     * Main class for decoding purposes.
     * Contains declaration of all required parsers and decode() method (API entry point).
     *
     * See below for explanations on parsers.
     */
    class Decoder {
        /**
         * Parsers declaration.
         *
         * Array of parser implementations that can be used by the library.
         *
         * Parsers are specific handlers for parsing frame of a device type and a frame code.
         */
        protected parsers: FrameParser[];
        /**
         * Codec storage
         */
        private codecStorage;
        /**
         * Constructor
         * @param options option object
         *   option.codecStorage: implementation of CodecStorage to use for external storage, leave blank if unknown
         */
        constructor(options?: {
            codecStorage?: CodecStorage;
        });
        /**
         * Get supported device types and frame codes.
         *
         * The returned pairs are available for decoding.
         */
        getSupported(): {
            deviceType: string;
            frameCode: number;
        }[];
        /**
         * Find device types
         * @param payloadString payload as hexadecimal string
         */
        findDeviceTypes(payloadString: string): string[];
        /**
         * Decode given payload.
         *
         * Configuration frames with 0x10 frame code are persisted and reinjected in parsers. Pass these frames first
         * to enable device-specific decoding.
         * Example (Dry Contacts):
         *   Decoder.decode('100001016705464602'); // This frame indicates that channel 1 is configured as output
         *   Decoder.decode('4040000100000000000001'); // While decoding this data frame, channel 1 is treated as output
         *
         * @param payloadString payload as hexadecimal string
         * @param devId device ID: LoRa device EUI or Sigfox ID, leave blank if unknown
         * @param network network: lora868 or sigfox
         * @returns decoded data as JSON object
         */
        decode(payloadString: string, devId?: string, network?: Network): Content;
        /**
         * Set device type for given device ID.
         *
         * Gives additional information to the library to provide better decoding.
         * The library can also guess device type from passed frames in decode() method. Use this method when the frame
         * to decode does not refer to a single device type (example: 0x10 frames).
         *
         * @param deviceType device type, must be a value from getSupported() method
         * @param devId device ID: LoRa device EUI or Sigfox ID
         */
        setDeviceType(deviceType: string, devId?: string): void;
        /**
         * Clear stored data for a device ID:
         *   - Device type
         *   - Configuration
         * @param devId device ID: LoRa device EUI or Sigfox ID, leave blank if unknown
         */
        clearStoredData(devId?: string): void;
        /**
         * Fetch configuration frame
         * @param devId device ID
         */
        private fetchConfiguration;
        /**
         * Store configuration frame
         * @param payload payload
         * @param devId device ID
         */
        private storeConfiguration;
        /**
         * Fetch device type
         * @param devId device ID
         */
        private fetchDeviceType;
        /**
         * Store device type
         * @param frameCode frame code
         * @param devId device ID
         */
        private storeDeviceType;
        /**
         * Get active parsers
         * @param deviceType device type
         * @param frameCode frame code
         */
        private getActiveParsers;
    }
}
declare namespace codec {
    /**
     * Encoder class.
     *
     * Main class for encoding purposes.
     * Contains declaration of all required builders and encode() method (API entry point).
     *
     * See below for explanations on builders.
     */
    class Encoder {
        /**
         * Builders declaration.
         *
         * Array of builder implementations that can be used by the library.
         *
         * Builders are specific handlers for encoding frame of a device type and a frame code.
         */
        protected builders: FrameBuilder<any>[];
        /**
         * Get supported device types and frame codes.
         *
         * The returned pairs are available for encoding.
         */
        getSupported(): {
            deviceType: string;
            frameCode: number;
        }[];
        /**
         * Get input data types.
         * @param deviceType device type
         * @param frameCode frame code
         * @returns a map of available input data and associated types
         */
        getInputDataTypes(deviceType: string, frameCode: number): {
            [key: string]: string;
        };
        /**
         * Encode given arguments.
         *
         * Generates a string payload from given arguments. Data object members and associated types can be known using
         * getInputDataTypes() method.
         *
         * @param deviceType device type
         * @param frameCode frame code
         * @param network network: lora868 or sigfox
         * @param data data object: map of available input data and values
         * @returns encoded data as string
         */
        encode(deviceType: string, frameCode: number, network?: Network, data?: any): string;
    }
}
declare namespace codec {
    /**
     * Codec storage interface
     */
    interface CodecStorage {
        /**
         * Get item
         * @param key key
         */
        getItem(key: string): string | null;
        /**
         * Remove item
         * @param key key
         */
        removeItem(key: string): void;
        /**
         * Set item
         * @param key key
         * @param value value
         */
        setItem(key: string, value: string): void;
    }
}
declare namespace codec {
    /**
     * Internal codec storage
     */
    class InternalCodecStorage implements CodecStorage {
        private store;
        getItem(key: string): string;
        removeItem(key: string): void;
        setItem(key: string, value: string): void;
    }
}
declare namespace codec {
    /**
     * Frame builder interface
     */
    interface FrameBuilder<T> {
        /**
         * Device type
         * 'any' applies to all devices
         */
        readonly deviceType: string;
        /**
         * Frame code
         * -1 applies to all devices
         */
        readonly frameCode: number;
        /**
         * Input data class
         */
        readonly inputDataClass: {
            new (...args: any[]): T;
        };
        /**
         * Build frame
         * @param inputData input data
         */
        buildFrame(inputData: T, network: Network): Buffer;
    }
}
declare namespace codec {
    /**
     * Frame parser interface
     */
    interface FrameParser {
        /**
         * Device type
         * 'any' applies to all devices
         */
        readonly deviceType: string;
        /**
         * Frame code
         * -1 applies to all devices
         */
        readonly frameCode: number;
        /**
         * Parse frame
         * @param payload payload
         * @param configuration configuration
         */
        parseFrame(payload: Buffer, configuration: Buffer, network: Network): Content;
    }
}
declare namespace codec {
    /**
     * Comfort 0x10 (configuration) input data
     */
    class Comfort0x10InputData {
        readingFrequency: number;
    }
    /**
     * Comfort 0x10 (configuration) frame builder
     */
    class Comfort0x10Builder implements FrameBuilder<Comfort0x10InputData> {
        readonly deviceType = "comfort";
        readonly frameCode = 16;
        readonly inputDataClass: typeof Comfort0x10InputData;
        buildFrame(inputData: Comfort0x10InputData, network: Network): Buffer;
        /**
         * Sanitize UInt16
         * @param unsafeUInt16 unsafe UInt16
         */
        private sanitizeUInt16;
    }
}
declare namespace codec {
    /**
     * Comfort 0x10 (configuration) frame parser
     */
    class Comfort0x10Parser implements FrameParser {
        readonly deviceType = "comfort";
        readonly frameCode = 16;
        parseFrame(payload: Buffer, configuration: Buffer, network: Network): Content;
    }
}
declare namespace codec {
    /**
     * Comfort 0x1f (TOR configuration) frame parser
     */
    class Comfort0x1fParser implements FrameParser {
        readonly deviceType = "comfort";
        readonly frameCode = 31;
        private sb0x1fParser;
        parseFrame(payload: Buffer, configuration: Buffer, network: Network): Content;
    }
}
declare namespace codec {
    /**
     * Comfort 0x30 (keep alive) frame parser
     */
    class Comfort0x30Parser implements FrameParser {
        readonly deviceType = "comfort";
        readonly frameCode = 48;
        private generic0x30Parser;
        parseFrame(payload: Buffer, configuration: Buffer, network: Network): any;
    }
}
declare namespace codec {
    /**
     * Comfort 0x4c (historic data) frame parser
     */
    class Comfort0x4cParser implements FrameParser {
        readonly deviceType = "comfort";
        readonly frameCode = 76;
        parseFrame(payload: Buffer, configuration: Buffer, network: Network): Content;
        /**
         * Get historic data from payload
         * @param payload payload
         * @param configuration configuration
         */
        private getHistoricDataFromPayload;
        /**
         * Get reading frequency
         * @param configuration configuration
         */
        private getReadingFrequency;
        /**
         * Get time text
         * @param readingFrequency reading frequency
         * @param index index
         */
        private getTimeText;
    }
}
declare namespace codec {
    /**
     * Comfort 0x4d (alarm) frame parser
     */
    class Comfort0x4dParser implements FrameParser {
        readonly deviceType = "comfort";
        readonly frameCode = 77;
        parseFrame(payload: Buffer, configuration: Buffer, network: Network): Content;
        getDataFromPayload(payload: Buffer): Content;
    }
}
declare namespace codec {
    /**
     * Comfort 0x51 (TOR configuration) frame parser
     */
    class Comfort0x51Parser implements FrameParser {
        readonly deviceType = "comfort";
        readonly frameCode = 81;
        private sb0x51Parser;
        parseFrame(payload: Buffer, configuration: Buffer, network: Network): Content;
    }
}
declare namespace codec {
    /**
     * Comfort 0x52 (TOR configuration) frame parser
     */
    class Comfort0x52Parser implements FrameParser {
        readonly deviceType = "comfort";
        readonly frameCode = 82;
        private sb0x52Parser;
        parseFrame(payload: Buffer, configuration: Buffer, network: Network): Content;
    }
}
declare namespace codec {
    /**
     * Comfort status byte parser
     */
    class ComfortStatusByteParser implements FrameParser {
        readonly deviceType = "comfort";
        readonly frameCode = -1;
        parseFrame(payload: Buffer, configuration: Buffer): Content;
    }
}
declare namespace codec {
    /**
     * Dry Contacts 0x10 (configuration) input data
     */
    class Dc0x10InputData {
        channel1Output: boolean;
        channel2Output: boolean;
        channel3Output: boolean;
        channel4Output: boolean;
    }
    /**
     * Dry Contacts 0x10 (configuration) frame builder
     */
    class Dc0x10Builder implements FrameBuilder<Dc0x10InputData> {
        readonly deviceType = "dc";
        readonly frameCode = 16;
        readonly inputDataClass: typeof Dc0x10InputData;
        buildFrame(inputData: Dc0x10InputData, network: Network): Buffer;
    }
}
declare namespace codec {
    /**
     * Dry Contacts 0x10 (configuration) frame parser
     */
    class Dc0x10Parser implements FrameParser {
        readonly deviceType = "dc";
        readonly frameCode = 16;
        parseFrame(payload: Buffer, configuration: Buffer, network: Network): Content;
        /**
         * Get Type text
         * @param value value
         */
        private getTypeText;
        /**
         * Get Waiting Period Duration text
         * @param value value
         */
        private getWaitingPeriodDurationText;
    }
}
declare namespace codec {
    /**
     * Dry Contacts 0x30 (keep alive) frame parser
     */
    class DC0x30Parser implements FrameParser {
        readonly deviceType = "dc";
        readonly frameCode = 48;
        private generic0x30Parser;
        parseFrame(payload: Buffer, configuration: Buffer, network: Network): any;
    }
}
declare namespace codec {
    /**
     * Dry Contacts 0x40 (data) frame parser
     */
    class Dc0x40Parser implements FrameParser {
        readonly deviceType = "dc";
        readonly frameCode = 64;
        parseFrame(payload: Buffer, configuration: Buffer, network: Network): Content;
    }
}
declare namespace codec {
    /**
     * Deltap 0x10 (configuration) input data
     */
    class Deltap0x10InputData {
        readingFrequency: number;
    }
    /**
     * Deltap 0x10 (configuration) frame builder
     */
    class Deltap0x10Builder implements FrameBuilder<Deltap0x10InputData> {
        readonly deviceType = "deltap";
        readonly frameCode = 16;
        readonly inputDataClass: typeof Deltap0x10InputData;
        buildFrame(inputData: Deltap0x10InputData, network: Network): Buffer;
        /**
         * Sanitize UInt16
         * @param unsafeUInt16 unsafe UInt16
         */
        private sanitizeUInt16;
    }
}
declare namespace codec {
    /**
     * Delta P 0x10 (configuration) frame parser
     */
    class Deltap0x10Parser implements FrameParser {
        readonly deviceType = "deltap";
        readonly frameCode = 16;
        parseFrame(payload: Buffer, configuration: Buffer, network: Network): Content;
    }
}
declare namespace codec {
    /**
     * Delta P 0x11 (0-10V configuration) frame parser
     */
    class Deltap0x11Parser implements FrameParser {
        readonly deviceType = "deltap";
        readonly frameCode = 17;
        parseFrame(payload: Buffer, configuration: Buffer, network: Network): Content;
    }
}
declare namespace codec {
    /**
     * Delta P 0x1f (TOR configuration) frame parser
     */
    class Deltap0x1fParser implements FrameParser {
        readonly deviceType = "deltap";
        readonly frameCode = 31;
        private sb0x1fParser;
        parseFrame(payload: Buffer, configuration: Buffer, network: Network): Content;
    }
}
declare namespace codec {
    /**
     * Delta P 0x30 (keep alive) frame parser
     */
    class Deltap0x30Parser implements FrameParser {
        readonly deviceType = "deltap";
        readonly frameCode = 48;
        private generic0x30Parser;
        parseFrame(payload: Buffer, configuration: Buffer, network: Network): any;
    }
}
declare namespace codec {
    /**
     * Delta P 0x51 (TOR configuration) frame parser
     */
    class Deltap0x51Parser implements FrameParser {
        readonly deviceType = "deltap";
        readonly frameCode = 81;
        private sb0x51Parser;
        parseFrame(payload: Buffer, configuration: Buffer, network: Network): Content;
    }
}
declare namespace codec {
    /**
     * Delta P 0x52 (TOR configuration) frame parser
     */
    class Deltap0x52Parser implements FrameParser {
        readonly deviceType = "deltap";
        readonly frameCode = 82;
        private sb0x52Parser;
        parseFrame(payload: Buffer, configuration: Buffer, network: Network): Content;
    }
}
declare namespace codec {
    /**
     * Delta P 0x53 (Delta P periodic) frame parser
     */
    class Deltap0x53Parser implements FrameParser {
        readonly deviceType = "deltap";
        readonly frameCode = 83;
        parseFrame(payload: Buffer, configuration: Buffer, network: Network): Content;
        /**
         * Get historic data from payload
         * @param payload payload
         * @param configuration configuration
         */
        private getHistoricDataFromPayload;
        /**
         * Get reading frequency
         * @param configuration configuration
         */
        private getReadingFrequency;
        /**
         * Get time text
         * @param readingFrequency reading frequency
         * @param index index
         */
        private getTimeText;
    }
}
declare namespace codec {
    /**
     * Delta P 0x54 (pressure alarm) frame parser
     */
    class Deltap0x54Parser implements FrameParser {
        readonly deviceType = "deltap";
        readonly frameCode = 84;
        parseFrame(payload: Buffer, configuration: Buffer, network: Network): Content;
        getDataFromPayload(payload: Buffer): Content;
    }
}
declare namespace codec {
    /**
     * Delta P 0x55 (periodic 0-10 V) frame parser
     */
    class Deltap0x55Parser implements FrameParser {
        readonly deviceType = "deltap";
        readonly frameCode = 85;
        parseFrame(payload: Buffer, configuration: Buffer, network: Network): Content;
        /**
         * Get historic data from payload
         * @param payload payload
         * @param configuration configuration
         */
        private getHistoricDataFromPayload;
        /**
         * Get reading frequency
         * @param configuration configuration
         */
        private getReadingFrequency;
        /**
         * Get time text
         * @param readingFrequency reading frequency
         * @param index index
         */
        private getTimeText;
    }
}
declare namespace codec {
    /**
     * Delta P 0x56 (alarm 0-10 V) frame parser
     */
    class Deltap0x56Parser implements FrameParser {
        readonly deviceType = "deltap";
        readonly frameCode = 86;
        parseFrame(payload: Buffer, configuration: Buffer, network: Network): Content;
        getDataFromPayload(payload: Buffer): Content;
    }
}
declare namespace codec {
    /**
     * Delta P status byte parser
     */
    class DeltapStatusByteParser implements FrameParser {
        readonly deviceType = "deltap";
        readonly frameCode = -1;
        parseFrame(payload: Buffer, configuration: Buffer): Content;
    }
}
declare namespace codec {
    /**
     * Generic 0x10 (configuration) frame parser
     */
    class Generic0x10Parser implements FrameParser {
        readonly deviceType = "any";
        readonly frameCode = 16;
        parseFrame(payload: Buffer, configuration: Buffer, network: Network): {
            type: string;
        };
    }
}
declare namespace codec {
    /**
     * Generic 0x20 (configuration) frame parser
     */
    class Generic0x20Parser implements FrameParser {
        readonly deviceType = "any";
        readonly frameCode = 32;
        parseFrame(payload: Buffer, configuration: Buffer, network: Network): Content;
        /**
         * Parse LoRa 868
         * @param payload payload
         */
        private parseLora868;
        /**
         * Parse Sigfox
         * @param payload payload
         */
        private parseSigfox;
    }
}
declare namespace codec {
    /**
     * Generic 0x30 (keep alive) frame parser
     */
    class Generic0x30Parser implements FrameParser {
        readonly deviceType = "any";
        readonly frameCode = 48;
        parseFrame(payload: Buffer, configuration: Buffer, network: Network): any;
    }
}
declare namespace codec {
    /**
     * Generic status byte parser
     */
    class GenericStatusByteParser implements FrameParser {
        readonly deviceType = "any";
        readonly frameCode = -1;
        parseFrame(payload: Buffer, configuration: Buffer, network: Network): Content;
    }
}
declare namespace codec {
    /**
     * Motion 0x10 (configuration) input data
     */
    class Motion0x10InputData {
        readingFrequency: number;
    }
    /**
     * Motion 0x10 (configuration) frame builder
     */
    class Motion0x10Builder implements FrameBuilder<Motion0x10InputData> {
        readonly deviceType = "motion";
        readonly frameCode = 16;
        readonly inputDataClass: typeof Motion0x10InputData;
        buildFrame(inputData: Motion0x10InputData, network: Network): Buffer;
        /**
         * Sanitize UInt16
         * @param unsafeUInt16 unsafe UInt16
         */
        private sanitizeUInt16;
    }
}
declare namespace codec {
    /**
     * Motion 0x10 (configuration) frame parser
     */
    class Motion0x10Parser implements FrameParser {
        readonly deviceType = "motion";
        readonly frameCode = 16;
        parseFrame(payload: Buffer, configuration: Buffer, network: Network): Content;
    }
}
declare namespace codec {
    /**
     * Motion 0x1f (TOR configuration) frame parser
     */
    class Motion0x1fParser implements FrameParser {
        readonly deviceType = "motion";
        readonly frameCode = 31;
        private sb0x1fParser;
        parseFrame(payload: Buffer, configuration: Buffer, network: Network): Content;
    }
}
declare namespace codec {
    /**
     * Motion 0x30 (keep alive) frame parser
     */
    class Motion0x30Parser implements FrameParser {
        readonly deviceType = "motion";
        readonly frameCode = 48;
        private generic0x30Parser;
        parseFrame(payload: Buffer, configuration: Buffer, network: Network): any;
    }
}
declare namespace codec {
    /**
     * Motion 0x4e (historic data) frame parser
     */
    class Motion0x4eParser implements FrameParser {
        readonly deviceType = "motion";
        readonly frameCode = 78;
        parseFrame(payload: Buffer, configuration: Buffer, network: Network): Content;
        /**
         * Get historic data from payload
         * @param payload payload
         * @param configuration configuration
         */
        private getHistoricDataFromPayload;
        /**
         * Get reading frequency
         * @param configuration configuration
         */
        private getReadingFrequency;
        /**
         * Get time text
         * @param readingFrequency reading frequency
         * @param index index
         */
        private getTimeText;
    }
}
declare namespace codec {
    /**
     * Motion 0x4f (presence alarm) frame parser
     */
    class Motion0x4fParser implements FrameParser {
        readonly deviceType = "motion";
        readonly frameCode = 79;
        parseFrame(payload: Buffer, configuration: Buffer, network: Network): Content;
    }
}
declare namespace codec {
    /**
     * Motion 0x50 (luminosity alarm) frame parser
     */
    class Motion0x50Parser implements FrameParser {
        readonly deviceType = "motion";
        readonly frameCode = 80;
        parseFrame(payload: Buffer, configuration: Buffer, network: Network): Content;
        /**
         * Get alarm status text
         * @param status status
         */
        getAlarmStatusText(status: boolean): "active" | "inactive";
    }
}
declare namespace codec {
    /**
     * Motion 0x51 (TOR configuration) frame parser
     */
    class Motion0x51Parser implements FrameParser {
        readonly deviceType = "motion";
        readonly frameCode = 81;
        private sb0x51Parser;
        parseFrame(payload: Buffer, configuration: Buffer, network: Network): Content;
    }
}
declare namespace codec {
    /**
     * Motion 0x52 (TOR configuration) frame parser
     */
    class Motion0x52Parser implements FrameParser {
        readonly deviceType = "motion";
        readonly frameCode = 82;
        private sb0x52Parser;
        parseFrame(payload: Buffer, configuration: Buffer, network: Network): Content;
    }
}
declare namespace codec {
    /**
     * Motion status byte parser
     */
    class MotionStatusByteParser implements FrameParser {
        readonly deviceType = "motion";
        readonly frameCode = -1;
        parseFrame(payload: Buffer, configuration: Buffer): Content;
    }
}
declare namespace codec {
    /**
     * Pulse 0x10 (configuration) input data
     */
    class Pulse0x10InputData {
        historicLogEvery1h: boolean;
    }
    /**
     * Pulse 0x10 (configuration) frame builder
     */
    class Pulse0x10Builder implements FrameBuilder<Pulse0x10InputData> {
        readonly deviceType = "pulse";
        readonly frameCode = 16;
        readonly inputDataClass: typeof Pulse0x10InputData;
        buildFrame(inputData: Pulse0x10InputData, network: Network): Buffer;
    }
}
declare namespace codec {
    /**
     * Pulse 0x10 (configuration) frame parser
     */
    class Pulse0x10Parser implements FrameParser {
        readonly deviceType = "pulse";
        readonly frameCode = 16;
        private pulse0x11Parser;
        private pulse0x12Parser;
        parseFrame(payload: Buffer, configuration: Buffer, network: Network): Content;
        /**
         * Infer network
         * @param length frame length
         */
        private inferNetwork;
        /**
         * Parse channel configuration
         * @param payload payload
         * @param offset offset
         */
        private parseChannelsGeneralConfiguration;
        /**
         * Get state text
         * @param value value
         */
        private getStateText;
        /**
         * Get type text
         * @param value value
         */
        private getTypeText;
        /**
         * Get historic mode text
         * @param value value
         */
        private getHistoricModeText;
        /**
         * Get debouncing period text
         * @param value value
         */
        private getDebouncingPeriodText;
        /**
         * Parse using 0x11 frame parser
         * @param payload payload
         * @param network network: unknown, lora868 or sigfox
         * @param offset offset
         */
        private parseUsing0x11;
        /**
         * Parse using 0x12 frame parser
         * @param payload payload
         * @param network network: unknown, lora868 or sigfox
         * @param offset offset
         */
        private parseUsing0x12;
    }
}
declare namespace codec {
    /**
     * Pulse 0x11 (configuration) frame parser
     */
    class Pulse0x11Parser implements FrameParser {
        readonly deviceType = "pulse";
        readonly frameCode = 17;
        parseFrame(payload: Buffer, configuration: Buffer, network: Network): Content;
    }
}
declare namespace codec {
    /**
     * Pulse 0x12 (configuration) frame parser
     */
    class Pulse0x12Parser implements FrameParser {
        readonly deviceType = "pulse";
        readonly frameCode = 18;
        parseFrame(payload: Buffer, configuration: Buffer, network: Network): Content;
    }
}
declare namespace codec {
    /**
     * Pulse 0x30 (keep alive) frame parser
     */
    class Pulse0x30Parser implements FrameParser {
        readonly deviceType = "pulse";
        readonly frameCode = 48;
        parseFrame(payload: Buffer, configuration: Buffer, network: Network): Content;
    }
}
declare namespace codec {
    /**
     * Pulse 0x46 (data) frame parser
     */
    class Pulse0x46Parser implements FrameParser {
        readonly deviceType = "pulse";
        readonly frameCode = 70;
        parseFrame(payload: Buffer, configuration: Buffer, network: Network): Content;
    }
}
declare namespace codec {
    /**
     * Pulse 0x47 (alarm) frame parser
     */
    class Pulse0x47Parser implements FrameParser {
        readonly deviceType = "pulse";
        readonly frameCode = 71;
        parseFrame(payload: Buffer, configuration: Buffer, network: Network): Content;
    }
}
declare namespace codec {
    /**
     * Pulse 0x48 (historic data) frame parser
     */
    class Pulse0x48Parser implements FrameParser {
        readonly deviceType = "pulse";
        readonly frameCode = 72;
        parseFrame(payload: Buffer, configuration: Buffer, network: Network): Content;
        /**
         * Parse indexes
         * @param payload payload
         * @param frameIndex frame index
         * @param historicConfiguration historic configuration
         */
        private parseIndexes;
        /**
         * Parse deltas
         * @param payload payload
         * @param network network: lora868 or sigfox
         * @param frameIndex frame index
         * @param historicConfiguration historic configuration
         */
        private parseDeltas;
        /**
         * Infer network and historic configuration
         * @param payload payload
         * @param configuration configuration
         */
        private inferNetworkAndHistoricCfg;
        /**
         * Get base for 1h history
         * @param frameIndex frame index
         * @param network network: lora868 or sigfox
         */
        private getBaseFor1hHistory;
        /**
         * Get base for 1d history
         * @param frameIndex frame index
         * @param network network: lora868 or sigfox
         */
        private getBaseFor1dHistory;
    }
}
declare namespace codec {
    class Repeater0x01InputData {
        return_mode: number;
    }
    /**
     * Repeater 0x01 frame builder
     */
    class Repeater0x01Builder implements FrameBuilder<Repeater0x01InputData> {
        readonly deviceType = "repeater";
        readonly frameCode = 1;
        readonly inputDataClass: typeof Repeater0x01InputData;
        buildFrame(inputData: Repeater0x01InputData, network: Network): Buffer;
    }
}
declare namespace codec {
    /**
     * Repeater 0x01 frame parser
     */
    class Repeater0x01Parser implements FrameParser {
        readonly deviceType = "repeater";
        readonly frameCode = 1;
        parseFrame(payload: Buffer, configuration: Buffer, network: Network): Content;
        getDataFromPayload(payload: Buffer): Content;
    }
}
declare namespace codec {
    class Repeater0x02InputData {
        wl_activation: number;
        id: number;
    }
    /**
     * Repeater 0x02 frame builder
     */
    class Repeater0x02Builder implements FrameBuilder<Repeater0x02InputData> {
        readonly deviceType = "repeater";
        readonly frameCode = 2;
        readonly inputDataClass: typeof Repeater0x02InputData;
        buildFrame(inputData: Repeater0x02InputData, network: Network): Buffer;
    }
}
declare namespace codec {
    /**
     * Repeater 0x02 frame parser
     */
    class Repeater0x02Parser implements FrameParser {
        readonly deviceType = "repeater";
        readonly frameCode = 2;
        parseFrame(payload: Buffer, configuration: Buffer, network: Network): Content;
        getDataFromPayload(payload: Buffer): Content;
    }
}
declare namespace codec {
    class Repeater0x03InputData {
        wl_validation: number;
        id: number;
    }
    /**
     * Repeater 0x03 frame builder
     */
    class Repeater0x03Builder implements FrameBuilder<Repeater0x03InputData> {
        readonly deviceType = "repeater";
        readonly frameCode = 3;
        readonly inputDataClass: typeof Repeater0x03InputData;
        buildFrame(inputData: Repeater0x03InputData, network: Network): Buffer;
    }
}
declare namespace codec {
    /**
     * Repeater 0x02 frame parser
     */
    class Repeater0x03Parser implements FrameParser {
        readonly deviceType = "repeater";
        readonly frameCode = 3;
        parseFrame(payload: Buffer, configuration: Buffer, network: Network): Content;
        getDataFromPayload(payload: Buffer): Content;
    }
}
declare namespace codec {
    class Repeater0x04InputData {
        S300: number;
        S303: number;
        S304: number;
        S306: number;
    }
    /**
     * Repeater 0x04 frame builder
     */
    class Repeater0x04Builder implements FrameBuilder<Repeater0x04InputData> {
        readonly deviceType = "repeater";
        readonly frameCode = 4;
        readonly inputDataClass: typeof Repeater0x04InputData;
        buildFrame(inputData: Repeater0x04InputData, network: Network): Buffer;
        getFirstIds(ids: Array<number>): number[];
        getLastIds(ids: Array<number>): number[];
        getByteFromIdsList(ids: Array<number>): number;
    }
}
declare namespace codec {
    /**
     * Repeater 0x04 frame parser
     */
    class Repeater0x04Parser implements FrameParser {
        readonly deviceType = "repeater";
        readonly frameCode = 4;
        parseFrame(payload: Buffer, configuration: Buffer, network: Network): Content;
        getDataFromPayload(payload: Buffer): Content;
    }
}
declare namespace codec {
    class Repeater0x05InputData {
    }
    /**
     * Repeater 0x05 frame builder
     */
    class Repeater0x05Builder implements FrameBuilder<Repeater0x05InputData> {
        readonly deviceType = "repeater";
        readonly frameCode = 5;
        readonly inputDataClass: typeof Repeater0x05InputData;
        buildFrame(inputData: Repeater0x05InputData, network: Network): Buffer;
    }
}
declare namespace codec {
    class RepeaterHelper {
        static hex2bin(hex: string): string;
        static getUPStatusFromPayload(payload: Buffer, appContent: Content): Content;
        static getDownlinkDescriptionForCode(code: number): string | number;
        static getErrorDescriptionForCode(code: number): string | number;
    }
}
declare namespace codec {
    /**
     * Smart Building 0x1f (TOR configuration) frame parser
     */
    class Sb0x1fParser implements FrameParser {
        readonly deviceType = "any";
        readonly frameCode = 31;
        parseFrame(payload: Buffer, configuration: Buffer, network: Network): Content;
        /**
         * Get debounce duration text
         * @param value value
         */
        private getDebounceDurationText;
        /**
         * Get type text
         * @param value value
         */
        private getTypeText;
    }
}
declare namespace codec {
    /**
     * Smart Building 0x51 (TOR1 alarm) frame parser
     */
    class Sb0x51Parser implements FrameParser {
        readonly deviceType = "any";
        readonly frameCode = 81;
        parseFrame(payload: Buffer, configuration: Buffer, network: Network): Content;
        getDataFromPayload(payload: Buffer): Content;
    }
}
declare namespace codec {
    /**
     * Smart Building 0x52 (TOR2 alarm) frame parser
     */
    class Sb0x52Parser implements FrameParser {
        readonly deviceType = "any";
        readonly frameCode = 82;
        private sb0x51Parser;
        parseFrame(payload: Buffer, configuration: Buffer, network: Network): Content;
    }
}
declare namespace codec {
    /**
     * Temperature 0x10 (configuration) frame parser
     */
    class Temp0x10Parser implements FrameParser {
        readonly deviceType = "temp";
        readonly frameCode = 16;
        parseFrame(payload: Buffer, configuration: Buffer, network: Network): Content;
        /**
         * Get Threshold Triggering text
         * @param value value
         */
        private getThresholdTriggeringText;
    }
}
declare namespace codec {
    /**
     * Temperature 0x11 (configuration) frame parser
     */
    class Temp0x11Parser implements FrameParser {
        readonly deviceType = "temp";
        readonly frameCode = 17;
        parseFrame(payload: Buffer, configuration: Buffer, network: Network): Content;
    }
}
declare namespace codec {
    /**
     * Temperature 0x12 (configuration) frame parser
     */
    class Temp0x12Parser implements FrameParser {
        readonly deviceType = "temp";
        readonly frameCode = 18;
        parseFrame(payload: Buffer, configuration: Buffer, network: Network): Content;
    }
}
declare namespace codec {
    /**
     * Temperature 0x30 (keep alive) frame parser
     */
    class Temp0x30Parser implements FrameParser {
        readonly deviceType = "temp";
        readonly frameCode = 48;
        private temp0x43Parser;
        parseFrame(payload: Buffer, configuration: Buffer, network: Network): Content;
    }
}
declare namespace codec {
    /**
     * Temperature 0x43 (data) frame parser
     */
    class Temp0x43Parser implements FrameParser {
        readonly deviceType = "temp";
        readonly frameCode = 67;
        parseFrame(payload: Buffer, configuration: Buffer, network: Network): Content;
    }
}
declare namespace codec {
    /**
     * Temperature status byte parser
     */
    class TempStatusByteParser implements FrameParser {
        readonly deviceType = "temp";
        readonly frameCode = -1;
        parseFrame(payload: Buffer, configuration: Buffer, network: Network): Content;
    }
}
declare namespace codec {
    enum PartialDecodingReason {
        NONE = 0,
        MISSING_NETWORK = 1,
        MISSING_CONFIGURATION = 2
    }
}
declare namespace codec {
    interface Content {
        [key: string]: any;
        type?: string;
        partialDecoding?: PartialDecodingReason;
    }
    class ContentImpl implements Content {
        type: string;
        [key: string]: any;
        partialDecoding: PartialDecodingReason;
        static merge(...contents: Content[]): Content | null;
        constructor(type?: string);
        merge(...contents: Content[]): Content | null;
    }
}
declare namespace codec {
    type Network = 'unknown' | 'lora868' | 'sigfox';
}
declare namespace codec {
    class PlateformCommonUtils {
        /**
         * Get Product Mode text
         * @param value value
         */
        static getProductModeText(value: number): "" | "PARK" | "PRODUCTION" | "TEST" | "DEAD";
    }
}
