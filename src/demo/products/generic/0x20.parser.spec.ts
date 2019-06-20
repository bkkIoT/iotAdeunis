/// <reference path='0x20.parser.ts' />

import { expect } from 'chai';
import 'mocha';

describe('Generic0x20Parser', () => {
  let generic0x20Parser: codec.Generic0x20Parser;

  beforeEach(() => {
    generic0x20Parser = new codec.Generic0x20Parser();
  });

  it('should parse 20a00101 (LoRa 868)', () => {
    const payloadString = '20a00101';
    const content = generic0x20Parser.parseFrame(Buffer.from(payloadString, 'hex'), Buffer.from(''), 'lora868');
    expect(content.type).to.equal('0x20 Configuration');
    expect(content['lora_adr']).to.equal(true);
    expect(content['lora_provisioning_mode']).to.equal('OTAA');
  });

  it('should parse 206002 (Sigfox)', () => {
    const payloadString = '206002';
    const content = generic0x20Parser.parseFrame(Buffer.from(payloadString, 'hex'), Buffer.from(''), 'sigfox');
    expect(content.type).to.equal('0x20 Configuration');
    expect(content['sigfox_retry']).to.equal(2);
  });
});
