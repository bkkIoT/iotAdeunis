/// <reference path='0x12.parser.ts' />

import { expect } from 'chai';
import 'mocha';

describe('Pulse0x12Parser', () => {
  let pulse0x12Parser: codec.Pulse0x12Parser;

  beforeEach(() => {
    pulse0x12Parser = new codec.Pulse0x12Parser();
  });

  it('should parse 120000000000', () => {
    const payloadString = '120000000000';
    const content = pulse0x12Parser.parseFrame(Buffer.from(payloadString, 'hex'), Buffer.from(''), 'sigfox');
    expect(content.type).to.equal('0x12 Pulse configuration');
  });
});
