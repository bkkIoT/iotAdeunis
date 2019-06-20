namespace codec {

    /**
     * Comfort 0x4d (alarm) frame parser
     */
    export class Comfort0x4dParser implements FrameParser {

        readonly deviceType = 'comfort';
        readonly frameCode = 0x4d;

        public parseFrame(payload: Buffer, configuration: Buffer, network: Network) {
            const appContent: Content = {
                type: '0x4d Comfort alarm',
                ...this.getDataFromPayload(payload)
            };

            return appContent;
        }

        public getDataFromPayload(payload: Buffer) {
            const appContent: Content = {};

            // Bit 4: alarm temp state (0: inactive, 1: active)
            appContent['alarm_status_temperature'] = payload.readUInt8(2) >> 4 & 1;

            // Bit 0: alarm humidity state (0: inactive, 1:active)
            appContent['alarm_status_humidity'] = payload.readUInt8(3) >> 0 & 1;

            // Temp value (en dixième de degrès)
            appContent['temperature_celsius_degrees'] = payload.readInt16BE(3) / 10;

            // Humidity value (%)
            appContent['humidity_percentage'] = payload.readUInt8(5);

            return appContent;
        }

    }

}

