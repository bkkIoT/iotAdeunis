namespace codec {

    /**
     * Smart Building 0x52 (TOR2 alarm) frame parser
     */
    export class Sb0x52Parser implements FrameParser {

        readonly deviceType = 'any';
        readonly frameCode = 0x52;

        private sb0x51Parser = new Sb0x51Parser();

        public parseFrame(payload: Buffer, configuration: Buffer, network: Network) {
            const appContent: Content = {
                ...this.sb0x51Parser.parseFrame(payload, configuration, network),
                type: '0x52 Smart Building TOR2 alarm'
            };

            return appContent;
        }
    }
}
