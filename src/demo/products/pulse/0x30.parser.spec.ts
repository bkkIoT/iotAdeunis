/// <reference path='0x30.parser.ts' />

import { expect } from 'chai';
import 'mocha';

describe('Pulse0x30Parser', () => {
  let pulse0x30Parser: codec.Pulse0x30Parser;

  beforeEach(() => {
    pulse0x30Parser = new codec.Pulse0x30Parser();
  });

  it('should parse 30e0010f7800000f780000', () => {
    const payloadString = '30e0010f7800000f780000';
    const content = pulse0x30Parser.parseFrame(Buffer.from(payloadString, 'hex'), Buffer.from(''), 'unknown');
    expect(content.type).to.equal('0x30 Pulse keep alive');
    expect(content['channelA_flow_alarm']).to.equal(true);
    expect(content['channelB_flow_alarm']).to.equal(false);
    expect(content['channelA_fraud_alarm']).to.equal(false);
    expect(content['channelB_fraud_alarm']).to.equal(false);
    expect(content['channelA_leakage_alarm']).to.equal(false);
    expect(content['channelB_leakage_alarm']).to.equal(false);
    expect(content['channelA_last_24h_max_flow']).to.equal(3960);
    expect(content['channelB_last_24h_max_flow']).to.equal(0);
    expect(content['channelA_last_24h_min_flow']).to.equal(3960);
    expect(content['channelB_last_24h_min_flow']).to.equal(0);
  });
});
