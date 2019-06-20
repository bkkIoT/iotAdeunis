namespace codec {

    /**
     * Motion 0x4f (presence alarm) frame parser
     */
    export class Motion0x4fParser implements FrameParser {

        readonly deviceType = 'motion';
        readonly frameCode = 0x4f;

        public parseFrame(payload: Buffer, configuration: Buffer, network: Network) {
            const appContent: Content = {
                type: '0x4f Motion presence alarm',
                'presence_global_counter': payload.readUInt16BE(2),
                'presence_counter_since_last_alarm': payload.readUInt16BE(4),
            };

            return appContent;
        }

    }

}

