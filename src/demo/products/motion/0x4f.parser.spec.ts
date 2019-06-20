/// <reference path='0x4f.parser.ts' />

import { expect } from 'chai';
import 'mocha';

describe('Motion0x4fParser', () => {
  let motion0x4fParser: codec.Motion0x4fParser;

  beforeEach(() => {
    motion0x4fParser = new codec.Motion0x4fParser();
  });

  it('should parse 4f0009014532', () => {
    const payloadString = '4f0000020001';
    const content = motion0x4fParser.parseFrame(Buffer.from(payloadString, 'hex'), Buffer.from(''), 'unknown');
    expect(content.type).to.equal('0x4f Motion presence alarm');
    expect(content['presence_global_counter']).to.equal(2);
    expect(content['presence_counter_since_last_alarm']).to.equal(1);
  });
});
