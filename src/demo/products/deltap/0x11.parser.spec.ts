/// <reference path='0x11.parser.ts' />

import { expect } from 'chai';
import 'mocha';

describe('Deltap0x11Parser', () => {
  let deltap0x11Parser: codec.Deltap0x11Parser;

  beforeEach(() => {
    deltap0x11Parser = new codec.Deltap0x11Parser();
  });

  it('should parse frame and return correct config', () => {
    const payloadString = '11400001012c0000';
    const content = deltap0x11Parser.parseFrame(Buffer.from(payloadString, 'hex'), Buffer.from(''), 'unknown');
    expect(content.type).to.equal('0x11 Delta P 0-10V configuration');
    expect(content['number_of_sampling_before_historization']).to.equal(1);
    expect(content['sampling_period_sec']).to.equal(600);
    expect(content['number_of_historization_before_sending']).to.equal(0);
    expect(content['calculated_period_recording_sec']).to.equal(600);
    expect(content['calculated_period_sending_sec']).to.equal(0);
  });
});

