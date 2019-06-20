/// <reference path='0x51.parser.ts' />

import { expect } from 'chai';
import 'mocha';

describe('Deltap0x51Parser', () => {
  let deltap0x51Parser: codec.Deltap0x51Parser;

  beforeEach(() => {
    deltap0x51Parser = new codec.Deltap0x51Parser();
  });

  it('should parse frame and return correct values', () => {
    const payloadString = '512203000001000001';
    const content = deltap0x51Parser.parseFrame(Buffer.from(payloadString, 'hex'), Buffer.from(''), 'unknown');
    expect(content.type).to.equal('0x51 Delta P - TOR1 alarm');
    expect(content['alarm_status_tor_previous_frame']).to.equal(1);
    expect(content['alarm_status_tor_current']).to.equal(1);
    expect(content['global_digital_counter']).to.equal(256);
    expect(content['instantaneous_digital_counter']).to.equal(1);
  });
});

