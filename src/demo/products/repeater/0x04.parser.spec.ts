/// <reference path='0x04.parser.ts' />

import { expect } from 'chai';
import 'mocha';

describe('Repeater0x04Parser', () => {
    let repeater0x04Parser: codec.Repeater0x04Parser;

    beforeEach(() => {
        repeater0x04Parser = new codec.Repeater0x04Parser();
    });

    it('should parse data 04B00C ', () => {
        const payloadString = '04B00C ';
        const content = repeater0x04Parser.parseFrame(Buffer.from(payloadString, 'hex'), Buffer.from(''), 'sigfox');
        expect(content.type).to.equal('0x04 White List confirmation');
        expect(content['frame_counter']).to.equal(11);
        expect(content['low_battery']).to.equal(false);
        expect(content['number_of_id_in_wl']).to.equal(12);
    });

    it('should parse data 04F300 ', () => {
        const payloadString = '04F300 ';
        const content = repeater0x04Parser.parseFrame(Buffer.from(payloadString, 'hex'), Buffer.from(''), 'sigfox');
        expect(content.type).to.equal('0x04 White List confirmation');
        expect(content['frame_counter']).to.equal(15);
        expect(content['low_battery']).to.equal(true);
        expect(content['number_of_id_in_wl']).to.equal(0);
    });
});
