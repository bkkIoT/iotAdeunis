/// <reference path='0x11.parser.ts' />

import { expect } from 'chai';
import 'mocha';

describe('Pulse0x11Parser', () => {
  let pulse0x11Parser: codec.Pulse0x11Parser;

  beforeEach(() => {
    pulse0x11Parser = new codec.Pulse0x11Parser();
  });

  it('should parse 11000000000000000000', () => {
    const payloadString = '11000000000000000000';
    const content = pulse0x11Parser.parseFrame(Buffer.from(payloadString, 'hex'), Buffer.from(''), 'sigfox');
    expect(content.type).to.equal('0x11 Pulse configuration');
  });
});
