namespace codec {

    /**
     * Smart Building 0x51 (TOR1 alarm) frame parser
     */
    export class Sb0x51Parser implements FrameParser {

        readonly deviceType = 'any';
        readonly frameCode = 0x51;

        public parseFrame(payload: Buffer, configuration: Buffer, network: Network) {
            const appContent: Content = {
                type: '0x51 Smart Building TOR1 alarm',
                ...this.getDataFromPayload(payload)
            };

            return appContent;
        }

        public getDataFromPayload(payload: Buffer) {
            const appContent: Content = {};

            appContent['alarm_status_tor_previous_frame'] = payload.readUInt8(2) >> 1 & 1;
            appContent['alarm_status_tor_current'] = payload.readUInt8(2) >> 0 & 1;
            appContent['global_digital_counter'] = payload.readUInt32BE(3);
            appContent['instantaneous_digital_counter'] = payload.readUInt16BE(7);

            return appContent;
        }

    }

}

