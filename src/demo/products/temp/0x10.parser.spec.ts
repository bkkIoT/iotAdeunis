/// <reference path='0x10.parser.ts' />

import { expect } from 'chai';
import 'mocha';

describe('Temp0x10Parser', () => {
  let temp0x10Parser: codec.Temp0x10Parser;

  beforeEach(() => {
    temp0x10Parser = new codec.Temp0x10Parser();
  });

  it('should parse 102090010003000302020a', () => {
    const payloadString = '102090010003000302020a';
    const content = temp0x10Parser.parseFrame(Buffer.from(payloadString, 'hex'), Buffer.from(''), 'unknown');
    expect(content.type).to.equal('0x10 Temperature configuration');
    expect(content['transmission_period_keep_alive_sec']).to.equal(2880);
    expect(content['transmission_period_data_sec']).to.equal(20);
    expect(content['ambient_probe_id']).to.equal(0);
    expect(content['ambient_probe_threshold_triggering']).to.equal('low_and_high');
    expect(content['remote_probe_id']).to.equal(0);
    expect(content['remote_probe_threshold_triggering']).to.equal('low_and_high');
    expect(content['product_mode']).to.equal('TEST');
    expect(content['sensors_activation']).to.equal(2);
    expect(content['acquisition_period_sec']).to.equal(200);
  });
});
