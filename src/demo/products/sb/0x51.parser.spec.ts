/// <reference path='0x51.parser.ts' />

import { expect } from 'chai';
import 'mocha';

describe('Sb0x51Parser', () => {
  let sb0x51Parser: codec.Sb0x51Parser;

  beforeEach(() => {
    sb0x51Parser = new codec.Sb0x51Parser();
  });

  it('should parse 510003000000090001', () => {
    const payloadString = '510003000000090001';
    const content = sb0x51Parser.parseFrame(Buffer.from(payloadString, 'hex'), Buffer.from(''), 'unknown');
    expect(content.type).to.equal('0x51 Smart Building TOR1 alarm');
    expect(content['alarm_status_tor_previous_frame']).to.equal(1);
    expect(content['alarm_status_tor_current']).to.equal(1);
    expect(content['global_digital_counter']).to.equal(9);
    expect(content['instantaneous_digital_counter']).to.equal(1);
  });
});
