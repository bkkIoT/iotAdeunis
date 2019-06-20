/// <reference path='0x02.builder.ts' />

import { expect } from 'chai';
import 'mocha';

describe('Repeater0x02Builder', () => {
    let repeater0x02Builder: codec.Repeater0x02Builder;

    beforeEach(() => {
        repeater0x02Builder = new codec.Repeater0x02Builder();
    });

    it('delete one ID should build 02FEDCBA98000000', () => {
        const inputData = new codec.Repeater0x02InputData();
        inputData.id = 0xFEDCBA98;
        const encodedValue = repeater0x02Builder.buildFrame(inputData, 'sigfox');
        expect(encodedValue.toString('HEX').toUpperCase()).to.equal('02FEDCBA98000000');
    });
});
