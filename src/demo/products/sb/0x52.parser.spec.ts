/// <reference path='0x52.parser.ts' />

import { expect } from 'chai';
import 'mocha';

describe('Sb0x52Parser', () => {
  let sb0x52Parser: codec.Sb0x52Parser;

  beforeEach(() => {
    sb0x52Parser = new codec.Sb0x52Parser();
  });

  it('should parse 520003000000090001', () => {
    const payloadString = '520003000000090001';
    const content = sb0x52Parser.parseFrame(Buffer.from(payloadString, 'hex'), Buffer.from(''), 'unknown');
    expect(content.type).to.equal('0x52 Smart Building TOR2 alarm');
    expect(content['alarm_status_tor_previous_frame']).to.equal(1);
    expect(content['alarm_status_tor_current']).to.equal(1);
    expect(content['global_digital_counter']).to.equal(9);
    expect(content['instantaneous_digital_counter']).to.equal(1);
  });
});
