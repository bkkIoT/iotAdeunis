/// <reference path='0x40.parser.ts' />

import { expect } from 'chai';
import 'mocha';

describe('Dc0x40Parser', () => {
  let dc0x40Parser: codec.Dc0x40Parser;

  beforeEach(() => {
    dc0x40Parser = new codec.Dc0x40Parser();
  });

  it('should parse 4040000100000000000001', () => {
    const payloadString = '4040000100000000000001';
    const content = dc0x40Parser.parseFrame(Buffer.from(payloadString, 'hex'), Buffer.from(''), 'unknown');
    expect(content.type).to.equal('0x40 Dry Contacts data');
    expect(content['channelA_event_counter']).to.equal(1);
    expect(content['channelA_current_state']).to.equal(true);
    expect(content['channelA_previous_frame_state']).to.equal(false);
    expect(content['channelB_event_counter']).to.equal(0);
    expect(content['channelB_current_state']).to.equal(false);
    expect(content['channelB_previous_frame_state']).to.equal(false);
    expect(content['channelC_event_counter']).to.equal(0);
    expect(content['channelC_current_state']).to.equal(false);
    expect(content['channelC_previous_frame_state']).to.equal(false);
    expect(content['channelD_event_counter']).to.equal(0);
    expect(content['channelD_current_state']).to.equal(false);
    expect(content['channelD_previous_frame_state']).to.equal(false);
    expect(content.partialDecoding).to.equal(2); // PartialDecodingReason.MISSING_CONFIGURATION
  });

  it('should parse 4040000100000000000001 + 100001016705464602', () => {
    const payloadString = '4040000100000000000001';
    const configurationString = '100001016705464602';
    const content = dc0x40Parser.parseFrame(Buffer.from(payloadString, 'hex'),
      Buffer.from(configurationString, 'hex'),
      'unknown');
    expect(content.type).to.equal('0x40 Dry Contacts data');
    // tslint:disable-next-line:no-unused-expression
    expect(content['channelA_event_counter']).to.be.undefined;
    expect(content['channelA_current_state']).to.equal(true);
    expect(content['channelA_previous_frame_state']).to.equal(false);
    expect(content['channelB_event_counter']).to.equal(0);
    expect(content['channelB_current_state']).to.equal(false);
    expect(content['channelB_previous_frame_state']).to.equal(false);
    expect(content['channelC_event_counter']).to.equal(0);
    expect(content['channelC_current_state']).to.equal(false);
    expect(content['channelC_previous_frame_state']).to.equal(false);
    expect(content['channelD_event_counter']).to.equal(0);
    expect(content['channelD_current_state']).to.equal(false);
    expect(content['channelD_previous_frame_state']).to.equal(false);
  });
});
