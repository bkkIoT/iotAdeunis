namespace codec {

    export class Repeater0x01InputData {
        // Accepted values are:
        // 0 retour en mode PARK
        // 1 retour en mode installation auto
        // 2 retour en mode opération, WL vide, rafraichissement de la WL à chaque trame OoB
        return_mode = 0;
    }

    /**
     * Repeater 0x01 frame builder
     */
    export class Repeater0x01Builder implements FrameBuilder<Repeater0x01InputData> {

        readonly deviceType = 'repeater';
        readonly frameCode = 0x01;

        readonly inputDataClass = Repeater0x01InputData;

        public buildFrame(inputData: Repeater0x01InputData, network: Network) {
            const payload = Buffer.alloc(8);
            payload[0] = this.frameCode;

            payload.writeUInt8(inputData.return_mode, 1);

            return payload;
        }
    }
}

