/// <reference path='0x10.builder.ts' />

import { expect } from 'chai';
import 'mocha';

describe('Pulse0x10Builder', () => {
  let pulse0x10Builder: codec.Pulse0x10Builder;

  beforeEach(() => {
    pulse0x10Builder = new codec.Pulse0x10Builder();
  });

  it('should build 10000000000001000000000000000000000000000000', () => {
    const inputData = new codec.Pulse0x10InputData();
    inputData.historicLogEvery1h = false;
    const payload = pulse0x10Builder.buildFrame(inputData, 'unknown');
    expect(payload.toString('hex')).to.equal('10000000000001000000000000000000000000000000');
  });

  it('should build 10000000000002000000000000000000000000000000', () => {
    const inputData = new codec.Pulse0x10InputData();
    inputData.historicLogEvery1h = true;
    const payload = pulse0x10Builder.buildFrame(inputData, 'unknown');
    expect(payload.toString('hex')).to.equal('10000000000002000000000000000000000000000000');
  });
});
