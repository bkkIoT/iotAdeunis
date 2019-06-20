/// <reference path='0x10.parser.ts' />

import { expect } from 'chai';
import 'mocha';

describe('Comfort0x10Parser', () => {
  let comfort0x10Parser: codec.Comfort0x10Parser;

  beforeEach(() => {
    comfort0x10Parser = new codec.Comfort0x10Parser();
  });

  it('should parse frame and return correct config', () => {
    const payloadString = '100021c000010001012c';
    const content = comfort0x10Parser.parseFrame(Buffer.from(payloadString, 'hex'), Buffer.from(''), 'unknown');
    expect(content.type).to.equal('0x10 Comfort configuration');
    expect(content['transmission_period_keep_alive_sec']).to.equal(86400);
    expect(content['number_of_historization_before_sending']).to.equal(1);
    expect(content['number_of_sampling_before_historization']).to.equal(1);
    expect(content['sampling_period_sec']).to.equal(600);
    expect(content['calculated_period_recording_sec']).to.equal(600);
    expect(content['calculated_period_sending_sec']).to.equal(600);
  });
});
