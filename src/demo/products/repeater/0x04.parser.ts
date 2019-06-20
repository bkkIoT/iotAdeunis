namespace codec {

    /**
     * Repeater 0x04 frame parser
     */
    export class Repeater0x04Parser implements FrameParser {

        readonly deviceType = 'repeater';
        readonly frameCode = 0x04;

        public parseFrame(payload: Buffer, configuration: Buffer, network: Network) {
            const appContent: Content = {
                type: '0x04 White List confirmation',
                ...this.getDataFromPayload(payload)
            };

            return appContent;
        }

        public getDataFromPayload(payload: Buffer) {
            const appContent: Content = {};
            RepeaterHelper.getUPStatusFromPayload(payload, appContent);
            appContent['number_of_id_in_wl'] =  payload.readUInt8(2);
            return appContent;
        }

    }

}
