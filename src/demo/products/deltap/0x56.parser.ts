namespace codec {

    /**
     * Delta P 0x56 (alarm 0-10 V) frame parser
     */
    export class Deltap0x56Parser implements FrameParser {

        readonly deviceType = 'deltap';
        readonly frameCode = 0x56;

        public parseFrame(payload: Buffer, configuration: Buffer, network: Network) {
            const appContent: Content = {
                type: '0x56 Delta P - alarm 0-10 V',
                ...this.getDataFromPayload(payload)
            };

            return appContent;
        }

        public getDataFromPayload(payload: Buffer) {
            const appContent: Content = {};

            // Bit 0: alarm humidity state (0: inactive, 1:active)
            appContent['alarm_status_voltage'] = payload.readUInt8(2) & 1;

            // Voltage value (in mV)
            appContent['voltage_mv'] = payload.readInt16BE(3);

            return appContent;
        }

    }

}

