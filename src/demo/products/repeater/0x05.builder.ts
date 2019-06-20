namespace codec {

    export class Repeater0x05InputData {

    }

    /**
     * Repeater 0x05 frame builder
     */
    export class Repeater0x05Builder implements FrameBuilder<Repeater0x05InputData> {

        readonly deviceType = 'repeater';
        readonly frameCode = 0x05;

        readonly inputDataClass = Repeater0x05InputData;

        public buildFrame(inputData: Repeater0x05InputData, network: Network) {
            const payload = Buffer.alloc(8);
            payload[0] = this.frameCode;

            return payload;
        }
    }
}
