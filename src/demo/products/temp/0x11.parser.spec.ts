/// <reference path='0x11.parser.ts' />

import { expect } from 'chai';
import 'mocha';

describe('Temp0x11Parser', () => {
  let temp0x11Parser: codec.Temp0x11Parser;

  beforeEach(() => {
    temp0x11Parser = new codec.Temp0x11Parser();
  });

  it('should parse 1160012c0a00320a05', () => {
    const payloadString = '1160012c0a00320a05';
    const content = temp0x11Parser.parseFrame(Buffer.from(payloadString, 'hex'), Buffer.from(''), 'unknown');
    expect(content.type).to.equal('0x11 Temperature configuration');
    expect(content['ambient_probe_high_threshold_value']).to.equal(30);
    expect(content['ambient_probe_high_threshold_hysteresis']).to.equal(1);
    expect(content['ambient_probe_low_threshold_value']).to.equal(5);
    expect(content['ambient_probe_low_threshold_hysteresis']).to.equal(1);
    expect(content['super_sampling_factor']).to.equal(5);
  });
});
