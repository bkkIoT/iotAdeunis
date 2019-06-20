/// <reference path='0x04.builder.ts' />

import { expect } from 'chai';
import 'mocha';

describe('Repeater0x04Builder', () => {
    let repeater0x04Builder: codec.Repeater0x04Builder;

    beforeEach(() => {
        repeater0x04Builder = new codec.Repeater0x04Builder();
    });

    it('configuration modification should build 041F010200000000', () => {
        const inputData = new codec.Repeater0x04InputData();
        inputData.S300 = 31;
        inputData.S303 = 2;
        inputData.S304 = 1;
        inputData.S306 = 2;
        const encodedValue = repeater0x04Builder.buildFrame(inputData, 'sigfox');
        expect(encodedValue.toString('HEX').toUpperCase()).to.equal('041F020102000000');
    });

});
