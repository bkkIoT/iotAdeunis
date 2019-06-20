namespace codec {

    /**
     * Repeater 0x02 frame parser
     */
    export class Repeater0x02Parser implements FrameParser {

        readonly deviceType = 'repeater';
        readonly frameCode = 0x02;

        public parseFrame(payload: Buffer, configuration: Buffer, network: Network) {
            const appContent: Content = {
                type: '0x02 Repeater WL modification',
                ...this.getDataFromPayload(payload)
            };

            return appContent;
        }

        public getDataFromPayload(payload: Buffer) {
            const appContent: Content = {};
            RepeaterHelper.getUPStatusFromPayload(payload, appContent);
            appContent['number_of_id_in_wl'] = payload.readUInt8(2);
            return appContent;
        }

    }

}

