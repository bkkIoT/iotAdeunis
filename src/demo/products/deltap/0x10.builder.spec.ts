/// <reference path='0x10.builder.ts' />

import { expect } from 'chai';
import 'mocha';

describe('Deltap0x10Builder', () => {
  let deltap0x10Builder: codec.Deltap0x10Builder;

  beforeEach(() => {
    deltap0x10Builder = new codec.Deltap0x10Builder();
  });

  it('should build 100000000000000104b0', () => {
    const inputData = new codec.Deltap0x10InputData();
    inputData.readingFrequency = 2400;
    const payload = deltap0x10Builder.buildFrame(inputData, 'unknown');
    expect(payload.toString('hex')).to.equal('100000000000000104b0');
  });
});
