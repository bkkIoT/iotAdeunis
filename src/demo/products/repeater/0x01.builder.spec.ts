/// <reference path='0x01.builder.ts' />

import { expect } from 'chai';
import 'mocha';

describe('Repeater0x01Builder', () => {
    let repeater0x01Builder: codec.Repeater0x01Builder;

    beforeEach(() => {
        repeater0x01Builder = new codec.Repeater0x01Builder();
    });

    it('mode PARK should build 0100000000000000', () => {
        const inputData = new codec.Repeater0x01InputData();
        const encodedValue = repeater0x01Builder.buildFrame(inputData, 'sigfox');
        expect(encodedValue.toString('hex')).to.equal('0100000000000000');
    });
    it('mode OPERATION should build 0102000000000000', () => {
        const inputData = new codec.Repeater0x01InputData();
        inputData.return_mode = 2;
        const encodedValue = repeater0x01Builder.buildFrame(inputData, 'sigfox');
        expect(encodedValue.toString('hex')).to.equal('0102000000000000');
    });
});
