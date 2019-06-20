/// <reference path='0x54.parser.ts' />

import { expect } from 'chai';
import 'mocha';

describe('Deltap0x54Parser', () => {
  let deltap0x54Parser: codec.Deltap0x54Parser;

  beforeEach(() => {
    deltap0x54Parser = new codec.Deltap0x54Parser();
  });

  it('should parse frame and return correct values', () => {
    const payloadString = '54420101F4';
    const content = deltap0x54Parser.parseFrame(Buffer.from(payloadString, 'hex'), Buffer.from(''), 'unknown');
    expect(content.type).to.equal('0x54 Delta P alarm');
    expect(content['alarm_status_delta_pressure']).to.equal(1);
  });
});
