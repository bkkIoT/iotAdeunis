/// <reference path='0x10.parser.ts' />

import { expect } from 'chai';
import 'mocha';

describe('Deltap0x10Parser', () => {
  let deltap0x10Parser: codec.Deltap0x10Parser;

  beforeEach(() => {
    deltap0x10Parser = new codec.Deltap0x10Parser();
  });

  it('should parse frame and return correct config', () => {
    const payloadString = '1000000c00010002012c';
    const content = deltap0x10Parser.parseFrame(Buffer.from(payloadString, 'hex'), Buffer.from(''), 'unknown');
    expect(content.type).to.equal('0x10 Delta P configuration');
    expect(content['transmission_period_keep_alive_sec']).to.equal(120);
    expect(content['number_of_historization_before_sending']).to.equal(1);
    expect(content['number_of_sampling_before_historization']).to.equal(2);
    expect(content['sampling_period_sec']).to.equal(600);
    expect(content['calculated_period_recording_sec']).to.equal(1200);
    expect(content['calculated_period_sending_sec']).to.equal(1200);
  });
});
