/// <reference path='0x56.parser.ts' />

import { expect } from 'chai';
import 'mocha';

describe('Deltap0x56Parser', () => {
  let deltap0x56Parser: codec.Deltap0x56Parser;

  beforeEach(() => {
    deltap0x56Parser = new codec.Deltap0x56Parser();
  });

  it('should parse frame and return correct values', () => {
    const payloadString = '56C00101F4';
    const content = deltap0x56Parser.parseFrame(Buffer.from(payloadString, 'hex'), Buffer.from(''), 'unknown');
    expect(content.type).to.equal('0x56 Delta P - alarm 0-10 V');
    expect(content['alarm_status_voltage']).to.equal(1);
    expect(content['voltage_mv']).to.equal(500);
  });
});

