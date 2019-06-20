/// <reference path='0x52.parser.ts' />

import { expect } from 'chai';
import 'mocha';

describe('Deltap0x52Parser', () => {
  let deltap0x52Parser: codec.Deltap0x52Parser;

  beforeEach(() => {
    deltap0x52Parser = new codec.Deltap0x52Parser();
  });

  it('should parse frame and return correct values', () => {
    const payloadString = '522001000000100003';
    const content = deltap0x52Parser.parseFrame(Buffer.from(payloadString, 'hex'), Buffer.from(''), 'unknown');
    expect(content.type).to.equal('0x52 Delta P - TOR2 alarm');
    expect(content['alarm_status_tor_previous_frame']).to.equal(0);
    expect(content['alarm_status_tor_current']).to.equal(1);
    expect(content['global_digital_counter']).to.equal(16);
    expect(content['instantaneous_digital_counter']).to.equal(3);
  });
});

