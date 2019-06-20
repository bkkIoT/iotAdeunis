/// <reference path='0x30.parser.ts' />

import { expect } from 'chai';
import 'mocha';

describe('Temp0x30Parser', () => {
  let temp0x30Parser: codec.Temp0x30Parser;

  beforeEach(() => {
    temp0x30Parser = new codec.Temp0x30Parser();
  });

  it('should parse 30400100f40200f1', () => {
    const payloadString = '30400100f40200f1';
    const content = temp0x30Parser.parseFrame(Buffer.from(payloadString, 'hex'), Buffer.from(''), 'unknown');
    expect(content.type).to.equal('0x30 Temperature keep alive');
    expect(content['ambient_probe_id']).to.equal(0);
    expect(content['ambient_temperature_celsius_degrees']).to.equal(24.4);
    expect(content['remote_probe_id']).to.equal(0);
    expect(content['remote_temperature_celsius_degrees']).to.equal(24.1);
  });
});
