/// <reference path='0x01.parser.ts' />

import { expect } from 'chai';
import 'mocha';

describe('Repeater0x01Parser', () => {
    let repeater0x01Parser: codec.Repeater0x01Parser;

    beforeEach(() => {
        repeater0x01Parser = new codec.Repeater0x01Parser();
    });

    it('should parse data 01F1', () => {
        const payloadString = '01F1';
        const content = repeater0x01Parser.parseFrame(Buffer.from(payloadString, 'hex'), Buffer.from(''), 'sigfox');
        expect(content.type).to.equal('0x01 Repeater WL add');
        expect(content['frame_counter']).to.equal(15);
        expect(content['low_battery']).to.equal(true);
    });

    it('should parse data 0101', () => {
        const payloadString = '0101';
        const content = repeater0x01Parser.parseFrame(Buffer.from(payloadString, 'hex'), Buffer.from(''), 'sigfox');
        expect(content.type).to.equal('0x01 Repeater WL add');
        expect(content['frame_counter']).to.equal(0);
        expect(content['low_battery']).to.equal(true);
    });

    it('should parse data 0111', () => {
        const payloadString = '0111';
        const content = repeater0x01Parser.parseFrame(Buffer.from(payloadString, 'hex'), Buffer.from(''), 'sigfox');
        expect(content.type).to.equal('0x01 Repeater WL add');
        expect(content['frame_counter']).to.equal(1);
        expect(content['low_battery']).to.equal(true);
    });

    it('should parse data 01A3', () => {
        const payloadString = '01A3';
        const content = repeater0x01Parser.parseFrame(Buffer.from(payloadString, 'hex'), Buffer.from(''), 'sigfox');
        expect(content.type).to.equal('0x01 Repeater WL add');
        expect(content['frame_counter']).to.equal(10);
        expect(content['low_battery']).to.equal(true);
    });
});
