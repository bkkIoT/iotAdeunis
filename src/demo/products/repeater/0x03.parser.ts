namespace codec {

    /**
     * Repeater 0x02 frame parser
     */
    export class Repeater0x03Parser implements FrameParser {

        readonly deviceType = 'repeater';
        readonly frameCode = 0x03;

        public parseFrame(payload: Buffer, configuration: Buffer, network: Network) {
            const appContent: Content = {
                type: '0x03 Repeater DL confirmation',
                ...this.getDataFromPayload(payload)
            };

            return appContent;
        }

        public getDataFromPayload(payload: Buffer) {
            const appContent: Content = {};
            RepeaterHelper.getUPStatusFromPayload(payload, appContent);
            appContent['downlink_code'] = RepeaterHelper.getDownlinkDescriptionForCode(payload.readUInt8(2));
            appContent['downlink_error_code'] = RepeaterHelper.getErrorDescriptionForCode(payload.readUInt8(3));
            return appContent;
        }

    }

}

