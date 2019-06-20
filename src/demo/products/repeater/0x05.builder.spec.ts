/// <reference path='0x05.builder.ts' />

import { expect } from 'chai';
import 'mocha';

describe('Repeater0x05Builder', () => {
    let repeater0x05Builder: codec.Repeater0x05Builder;

    beforeEach(() => {
        repeater0x05Builder = new codec.Repeater0x05Builder();
    });

    it('Figer la WL should build 0500000000000000', () => {
        const inputData = new codec.Repeater0x05InputData();
        const encodedValue = repeater0x05Builder.buildFrame(inputData, 'sigfox');
        expect(encodedValue.toString('HEX').toUpperCase()).to.equal('0500000000000000');
    });

});
