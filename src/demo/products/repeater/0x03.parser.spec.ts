/// <reference path='0x03.parser.ts' />

import { expect } from 'chai';
import 'mocha';

describe('Repeater0x03Parser', () => {
    let repeater0x03Parser: codec.Repeater0x03Parser;

    beforeEach(() => {
        repeater0x03Parser = new codec.Repeater0x03Parser();
    });

    it('should parse data 03A10204 ', () => {
        const payloadString = '03A10204 ';
        const content = repeater0x03Parser.parseFrame(Buffer.from(payloadString, 'hex'), Buffer.from(''), 'sigfox');
        expect(content.type).to.equal('0x03 Repeater DL confirmation');
        expect(content['frame_counter']).to.equal(10);
        expect(content['low_battery']).to.equal(true);
        expect(content['downlink_code']).to.equal('0x02 Delete an ID from White List');
        expect(content['downlink_error_code']).to.equal('0x04 ID not found in the White List');
    });

    it('should parse data 03A30101 ', () => {
        const payloadString = '03A30101 ';
        const content = repeater0x03Parser.parseFrame(Buffer.from(payloadString, 'hex'), Buffer.from(''), 'sigfox');
        expect(content.type).to.equal('0x03 Repeater DL confirmation');
        expect(content['frame_counter']).to.equal(10);
        expect(content['low_battery']).to.equal(true);
        expect(content['downlink_code']).to.equal('0x01 Suppress all IDs from White List');
        expect(content['downlink_error_code']).to.equal('0x01 White List already empty');
    });

    it('should parse data 03A30203 ', () => {
        const payloadString = '03A30203 ';
        const content = repeater0x03Parser.parseFrame(Buffer.from(payloadString, 'hex'), Buffer.from(''), 'sigfox');
        expect(content.type).to.equal('0x03 Repeater DL confirmation');
        expect(content['frame_counter']).to.equal(10);
        expect(content['low_battery']).to.equal(true);
        expect(content['downlink_code']).to.equal('0x02 Delete an ID from White List');
        expect(content['downlink_error_code']).
            to.equal('0x03 White List is empty, repeater switch into OPERATION with “auto-record” mode');
    });

    it('should parse data 03A30507 ', () => {
        const payloadString = '03A30507 ';
        const content = repeater0x03Parser.parseFrame(Buffer.from(payloadString, 'hex'), Buffer.from(''), 'sigfox');
        expect(content.type).to.equal('0x03 Repeater DL confirmation');
        expect(content['frame_counter']).to.equal(10);
        expect(content['low_battery']).to.equal(true);
        expect(content['downlink_code']).
            to.equal('0x05 Freeze the list of devices repeated in auto-record mode into the White List');
        expect(content['downlink_error_code']).
            to.equal('0x07 No ID repeated, repeater stay into OPERATION with “auto-record” mode');
    });
});
