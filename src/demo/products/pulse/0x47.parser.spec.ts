/// <reference path='0x47.parser.ts' />

import { expect } from 'chai';
import 'mocha';

describe('Pulse0x47Parser', () => {
  let pulse0x47Parser: codec.Pulse0x47Parser;

  beforeEach(() => {
    pulse0x47Parser = new codec.Pulse0x47Parser();
  });

  it('should parse 47a00f780000', () => {
    const payloadString = '47a00f780000';
    const content = pulse0x47Parser.parseFrame(Buffer.from(payloadString, 'hex'), Buffer.from(''), 'unknown');
    expect(content.type).to.equal('0x47 Pulse alarm');
    expect(content['channelA_flow']).to.equal(3960);
    expect(content['channelB_flow']).to.equal(0);
  });
});
