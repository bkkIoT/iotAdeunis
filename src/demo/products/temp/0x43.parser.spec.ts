/// <reference path='0x43.parser.ts' />

import { expect } from 'chai';
import 'mocha';

describe('Temp0x43Parser', () => {
  let temp0x43Parser: codec.Temp0x43Parser;

  beforeEach(() => {
    temp0x43Parser = new codec.Temp0x43Parser();
  });

  it('should parse 43400100f40200f1', () => {
    const payloadString = '43400100f40200f1';
    const content = temp0x43Parser.parseFrame(Buffer.from(payloadString, 'hex'), Buffer.from(''), 'unknown');
    expect(content.type).to.equal('0x43 Temperature data');
    expect(content['ambient_probe_id']).to.equal(0);
    expect(content['ambient_temperature_celsius_degrees']).to.equal(24.4);
    expect(content['remote_probe_id']).to.equal(0);
    expect(content['remote_temperature_celsius_degrees']).to.equal(24.1);
  });
});
