/// <reference path='0x4e.parser.ts' />

import { expect } from 'chai';
import 'mocha';

describe('Motion0x4eParser', () => {
  let motion0x4eParser: codec.Motion0x4eParser;

  beforeEach(() => {
    motion0x4eParser = new codec.Motion0x4eParser();
  });

  it('should parse data frame with historic, WITHOUT known configuration', () => {
    const content = motion0x4eParser.parseFrame(Buffer.from('4e284a9a001542000148', 'hex'), Buffer.from(''), 'unknown');
    expect(content.type).to.equal('0x4e Motion data');
    expect(content['presence_global_counter']).to.equal(19098);
    expect(content['presence_current_counter']).to.equal(21);
    expect(content['luminosity_current_percentage']).to.equal(66);
    expect(content['presence_tminus1_counter']).to.equal(1);
    expect(content['luminosity_tminus1_percentage']).to.equal(72);
  });

  it('should parse data frame with historic, WITH known configuration', () => {
    const payloadString = '4e0895e5000a4c00184d';
    const configurationString = '100021c000010001012c0001';
    const content = motion0x4eParser.parseFrame(Buffer.from(payloadString, 'hex'),
      Buffer.from(configurationString, 'hex'),
      'unknown');
    expect(content.type).to.equal('0x4e Motion data');
    expect(content['presence_global_counter']).to.equal(38373);
    expect(content['presence_current_counter']).to.equal(10);
    expect(content['luminosity_current_percentage']).to.equal(76);
    expect(content['presence_tminus1_counter']).to.equal(24);
    expect(content['luminosity_tminus1_percentage']).to.equal(77);
  });
});
