namespace codec {
    const errorCode: { [key: number]: string } =  {
        0x00: '0x00 The action has been correctly realized',
        0x0A: '0x0A Uplink code is invalid',
        0x0B: '0x0B Harware error, please contact adeunis support',
        0x0C: '0x0C Callback error',
        0x0D: '0x0D Generic error',
        0x01: '0x01 White List already empty',
        0x02: '0x02 White List not erased',
        0x03: '0x03 White List is empty, repeater switch into OPERATION with “auto-record” mode',
        0x04: '0x04 ID not found in the White List',
        0x05: '0x05 White List is full, “add an ID” not possible',
        0x06: '0x06 ID already existing in the White List',
        0x07: '0x07 No ID repeated, repeater stay into OPERATION with “auto-record” mode',
        0x08: '0x08 A White List is already existing, use “Suppress all IDs from White List” frame before',
        0x11: '0x11 Error with S300 configuration',
        0x12: '0x12 Error with S303 configuration',
        0x13: '0x13 Error with S300, S303 configuration',
        0x14: '0x14 Error with S304 configuration',
        0x15: '0x15 Error with S300, S304 configuration',
        0x16: '0x16 Error with S303, S304 configuration',
        0x17: '0x17 Error with S300, S303, S304 configuration',
        0x18: '0x18 Error with S306 configuration',
        0x19: '0x19 Error with S300, S306 configuration',
        0x1A: '0x1A Error with S303, S306 configuration',
        0x1B: '0x1B Error with S300, S303, S306 configuration',
        0x1C: '0x1C Error with S304, S306 configuration',
        0x1D: '0x1D Error with S300, S304, S306 configuration',
        0x1E: '0x1E Error with S303, S304, S306 configuration',
        0x1F: '0x1F Error with S300, S303, S304, S306 configuration'
    };

    const dlCode: { [key: number]: string } =  {
        0x01: '0x01 Suppress all IDs from White List',
        0x02: '0x02 Delete an ID from White List',
        0x03: '0x03 Add an ID into White List',
        0x05: '0x05 Freeze the list of devices repeated in auto-record mode into the White List',
        0x04: '0x04 Modify Repeater configuration'
    };


    export class RepeaterHelper {
        public static hex2bin(hex: string) {
            return (parseInt(hex, 16).toString(2)).padStart(8, '0');
        }

        public static getUPStatusFromPayload(payload: Buffer, appContent: Content) {
            const byte = payload[1];
            let charLb = 1;
            if (/^\d$/.test('' + byte)) {
                // one digit
                appContent['frame_counter'] = 0;
                charLb = 0;
            } else {
                appContent['frame_counter'] = parseInt(payload.readUInt8(1).toString(16).charAt(0), 16);
            }

            const hexLb = payload.readUInt8(1).toString(16);
            const binLb = RepeaterHelper.hex2bin(hexLb);
            const bitLb = binLb[binLb.length - 1];
            appContent['low_battery'] = (bitLb === '1') ? true : false;
            return appContent;
        }

        public static getDownlinkDescriptionForCode(code: number) {
            return dlCode[code] || code;
        }
        public static getErrorDescriptionForCode(code: number) {
            return errorCode[code] || code;
        }
    }
}
