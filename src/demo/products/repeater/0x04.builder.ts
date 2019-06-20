namespace codec {

    export class Repeater0x04InputData {
        S300 = 1; // 01- 31
        S303 = 0; // 00 ou 02
        S304 = 0; // 00/01/02
        S306 = 0; // 00 ou 02
    }

    /**
     * Repeater 0x04 frame builder
     */
    export class Repeater0x04Builder implements FrameBuilder<Repeater0x04InputData> {

        readonly deviceType = 'repeater';
        readonly frameCode = 0x04;

        readonly inputDataClass = Repeater0x04InputData;

        public buildFrame(inputData: Repeater0x04InputData, network: Network) {
            const payload = Buffer.alloc(8);
            payload[0] = this.frameCode;

            payload.writeUInt8(inputData.S300, 1);
            payload.writeUInt8(inputData.S303, 2);
            payload.writeUInt8(inputData.S304, 3);
            payload.writeUInt8(inputData.S306, 4);

            return payload;
        }

        public getFirstIds(ids: Array<number>) {
            return ids.filter((id) => id >= 8);
        }

        public getLastIds(ids: Array<number>) {
            return ids.filter((id) => id < 8);
        }

        public getByteFromIdsList(ids: Array<number>) {
            const intArray = Buffer.alloc(8);
            ids.forEach((id, idx) => intArray[idx] = id);
            return intArray.readUInt8(0);
        }
    }
}
