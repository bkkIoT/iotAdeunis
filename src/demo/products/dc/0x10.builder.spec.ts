/// <reference path='0x10.builder.ts' />

import { expect } from 'chai';
import 'mocha';

describe('Dc0x10Builder', () => {
  let dc0x10Builder: codec.Dc0x10Builder;

  beforeEach(() => {
    dc0x10Builder = new codec.Dc0x10Builder();
  });

  it('should build 100000000701010100', () => {
    const inputData = new codec.Dc0x10InputData();
    inputData.channel1Output = true;
    const payload = dc0x10Builder.buildFrame(inputData, 'unknown');
    expect(payload.toString('hex')).to.equal('100000000701010100');
  });
});
