namespace codec {

    /**
     * Repeater 0x01 frame parser
     */
    export class Repeater0x01Parser implements FrameParser {

        readonly deviceType = 'repeater';
        readonly frameCode = 0x01;

        public parseFrame(payload: Buffer, configuration: Buffer, network: Network) {
            const appContent: Content = {
                type: '0x01 Repeater WL add',
                ...this.getDataFromPayload(payload)
            };

            return appContent;
        }

        public getDataFromPayload(payload: Buffer) {
            const appContent: Content = {};
            RepeaterHelper.getUPStatusFromPayload(payload, appContent);
            return appContent;
        }

    }

}

