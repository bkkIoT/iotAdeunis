/// <reference path='0x03.builder.ts' />

import { expect } from 'chai';
import 'mocha';

describe('Repeater0x03Builder', () => {
    let repeater0x03Builder: codec.Repeater0x03Builder;

    beforeEach(() => {
        repeater0x03Builder = new codec.Repeater0x03Builder();
    });

    it('add ID should build 0300FEDCBA980000', () => {
        const inputData = new codec.Repeater0x03InputData();
        inputData.wl_validation = 0;
        inputData.id = 0xFEDCBA98;
        const encodedValue = repeater0x03Builder.buildFrame(inputData, 'sigfox');
        expect(encodedValue.toString('HEX').toUpperCase()).to.equal('0300FEDCBA980000');
    });

});
