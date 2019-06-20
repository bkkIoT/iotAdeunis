namespace codec {

    /**
     * Delta P 0x54 (pressure alarm) frame parser
     */
    export class Deltap0x54Parser implements FrameParser {

        readonly deviceType = 'deltap';
        readonly frameCode = 0x54;

        public parseFrame(payload: Buffer, configuration: Buffer, network: Network) {
            const appContent: Content = {
                type: '0x54 Delta P alarm',
                ...this.getDataFromPayload(payload)
            };

            return appContent;
        }

        public getDataFromPayload(payload: Buffer) {
            const appContent: Content = {};

            // Bit 0: alarm pressure state (0: inactive, 1: active)
            appContent['alarm_status_delta_pressure'] = payload.readUInt8(2) & 1;

            // Pressure value (en dixième de degrès)
            appContent['delta_pressure_pa'] = payload.readInt16BE(3);

            return appContent;
        }

    }

}

