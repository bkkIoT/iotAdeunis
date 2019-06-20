namespace codec {

    export class Repeater0x02InputData {
        // wl_activation accepted values are 0x00 or 0x01
        wl_activation = 0x00;
        id = 0;
    }

    /**
     * Repeater 0x02 frame builder
     */
    export class Repeater0x02Builder implements FrameBuilder<Repeater0x02InputData> {

        readonly deviceType = 'repeater';
        readonly frameCode = 0x02;

        readonly inputDataClass = Repeater0x02InputData;

        public buildFrame(inputData: Repeater0x02InputData, network: Network) {
            const payload = Buffer.alloc(8);
            payload[0] = this.frameCode;

            payload.writeUInt8(inputData.wl_activation, 1);
            payload.writeUInt32BE(inputData.id, 1);

            return payload;
        }
    }
}

