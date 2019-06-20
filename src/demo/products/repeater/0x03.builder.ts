namespace codec {

    export class Repeater0x03InputData {
        // wl_validation accepted values are 0x00 or 0x01
        wl_validation = 0x00;
        id = 0;
    }

    /**
     * Repeater 0x03 frame builder
     */
    export class Repeater0x03Builder implements FrameBuilder<Repeater0x03InputData> {

        readonly deviceType = 'repeater';
        readonly frameCode = 0x03;

        readonly inputDataClass = Repeater0x03InputData;

        public buildFrame(inputData: Repeater0x03InputData, network: Network) {
            const payload = Buffer.alloc(8);
            payload[0] = this.frameCode;

            payload.writeUInt8(inputData.wl_validation, 1);
            payload.writeUInt32BE(inputData.id, 2);

            return payload;
        }
    }
}

