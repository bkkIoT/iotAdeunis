/// <reference path='0x10.parser.ts' />

import { expect } from 'chai';
import 'mocha';

describe('Dc0x10Parser', () => {
  let dc0x10Parser: codec.Dc0x10Parser;

  beforeEach(() => {
    dc0x10Parser = new codec.Dc0x10Parser();
  });

  it('should parse 102090010003000302020a', () => {
    const payloadString = '102090010003000302020a';
    const content = dc0x10Parser.parseFrame(Buffer.from(payloadString, 'hex'), Buffer.from(''), 'unknown');
    expect(content.type).to.equal('0x10 Dry Contacts configuration');
    expect(content['transmission_period_keep_alive_sec']).to.equal(2880);
    expect(content['transmission_period_event_counters_sec']).to.equal(20);
    expect(content['channelA_type']).to.equal('disabled');
    expect(content['channelA_waiting_period_duration']).to.equal('no_debounce');
    expect(content['channelB_type']).to.equal('in_periodic_mode_high_and_low_edge');
    expect(content['channelB_waiting_period_duration']).to.equal('no_debounce');
    expect(content['channelC_type']).to.equal('disabled');
    expect(content['channelC_waiting_period_duration']).to.equal('no_debounce');
    expect(content['channelD_type']).to.equal('in_periodic_mode_high_and_low_edge');
    expect(content['channelD_waiting_period_duration']).to.equal('no_debounce');
    expect(content['product_mode']).to.equal('TEST');
  });
});
