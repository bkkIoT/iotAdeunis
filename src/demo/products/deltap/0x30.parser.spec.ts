/// <reference path='0x30.parser.ts' />

import { expect } from 'chai';
import 'mocha';

describe('Deltap0x30Parser', () => {
  let deltap0x30Parser: codec.Deltap0x30Parser;

  beforeEach(() => {
    deltap0x30Parser = new codec.Deltap0x30Parser();
  });

  it('should parse frame and return correct config', () => {
    const payloadString = '3008';
    const content = deltap0x30Parser.parseFrame(Buffer.from(payloadString, 'hex'), Buffer.from(''), 'unknown');
    expect(content.type).to.equal('0x30 Keep alive');
  });
});
