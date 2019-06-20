/// <reference path='0x10.builder.ts' />

import { expect } from 'chai';
import 'mocha';

describe('Comfort0x10Builder', () => {
  let comfort0x10Builder: codec.Comfort0x10Builder;

  beforeEach(() => {
    comfort0x10Builder = new codec.Comfort0x10Builder();
  });

  it('should build 100000000000000104b0', () => {
    const inputData = new codec.Comfort0x10InputData();
    inputData.readingFrequency = 2400;
    const payload = comfort0x10Builder.buildFrame(inputData, 'unknown');
    expect(payload.toString('hex')).to.equal('100000000000000104b0');
  });
});
