/// <reference path='0x10.builder.ts' />

import { expect } from 'chai';
import 'mocha';

describe('Motion0x10Builder', () => {
  let motion0x10Builder: codec.Motion0x10Builder;

  beforeEach(() => {
    motion0x10Builder = new codec.Motion0x10Builder();
  });

  it('should build 100000000000000104b0', () => {
    const inputData = new codec.Motion0x10InputData();
    inputData.readingFrequency = 2400;
    const payload = motion0x10Builder.buildFrame(inputData, 'unknown');
    expect(payload.toString('hex')).to.equal('100000000000000104b0');
  });
});
