namespace codec {

    /**
     * Comfort 0x30 (keep alive) frame parser
     */
    export class Comfort0x30Parser implements FrameParser {

        readonly deviceType = 'comfort';
        readonly frameCode = 0x30;

        private generic0x30Parser = new Generic0x30Parser();

        public parseFrame(payload: Buffer, configuration: Buffer, network: Network) {
            const appContent = this.generic0x30Parser.parseFrame(payload, configuration, network);

            appContent['configuration_inconsistency'] = ((payload[1] & 0x08) !== 0) ? true : false;

            return appContent;
        }

    }

}
