/// <reference path='0x48.parser.ts' />

import { expect } from 'chai';
import 'mocha';

describe('Pulse0x48Parser', () => {
  let pulse0x48Parser: codec.Pulse0x48Parser;

  beforeEach(() => {
    pulse0x48Parser = new codec.Pulse0x48Parser();
  });

  it('should parse 48200000000127000000600000000000000000000000000000000000000000', () => {
    const payloadString = '48200000000127000000600000000000000000000000000000000000000000';
    const content = pulse0x48Parser.parseFrame(Buffer.from(payloadString, 'hex'), Buffer.from(''), 'lora868');
    expect(content.type).to.equal('0x48 Pulse historic data');
    expect(content['frame_index']).to.equal(0);
    expect(content['channelA_index_10min_after_previous_frame']).to.equal(295);
    expect(content['channelB_index_10min_after_previous_frame']).to.equal(96);
    expect(content['channelA_delta_10min_to_20min_after_previous_frame']).to.equal(0);
    expect(content['channelB_delta_10min_to_20min_after_previous_frame']).to.equal(0);
    expect(content['channelA_delta_20min_to_30min_after_previous_frame']).to.equal(0);
    expect(content['channelB_delta_20min_to_30min_after_previous_frame']).to.equal(0);
    expect(content['channelA_delta_30min_to_40min_after_previous_frame']).to.equal(0);
    expect(content['channelB_delta_30min_to_40min_after_previous_frame']).to.equal(0);
    expect(content['channelA_delta_40min_to_50min_after_previous_frame']).to.equal(0);
    expect(content['channelB_delta_40min_to_50min_after_previous_frame']).to.equal(0);
    expect(content['channelA_delta_50min_to_60min_after_previous_frame']).to.equal(0);
    expect(content['channelB_delta_50min_to_60min_after_previous_frame']).to.equal(0);
  });

  it('should parse 48200000000127000000600000000000000000000000000000000000000000 + 1020010003010122003c000000000000'
    + '000000000000', () => {
      const payloadString = '48200000000127000000600000000000000000000000000000000000000000';
      const configurationString = '1020010003010122003c000000000000000000000000';
      const content = pulse0x48Parser.parseFrame(Buffer.from(payloadString, 'hex'),
        Buffer.from(configurationString, 'hex'),
        'lora868');
      expect(content.type).to.equal('0x48 Pulse historic data');
      expect(content['frame_index']).to.equal(0);
      expect(content['channelA_index_10min_after_previous_frame']).to.equal(295);
      expect(content['channelB_index_10min_after_previous_frame']).to.equal(96);
      expect(content['channelA_delta_10min_to_20min_after_previous_frame']).to.equal(0);
      expect(content['channelB_delta_10min_to_20min_after_previous_frame']).to.equal(0);
      expect(content['channelA_delta_20min_to_30min_after_previous_frame']).to.equal(0);
      expect(content['channelB_delta_20min_to_30min_after_previous_frame']).to.equal(0);
      expect(content['channelA_delta_30min_to_40min_after_previous_frame']).to.equal(0);
      expect(content['channelB_delta_30min_to_40min_after_previous_frame']).to.equal(0);
      expect(content['channelA_delta_40min_to_50min_after_previous_frame']).to.equal(0);
      expect(content['channelB_delta_40min_to_50min_after_previous_frame']).to.equal(0);
      expect(content['channelA_delta_50min_to_60min_after_previous_frame']).to.equal(0);
      expect(content['channelB_delta_50min_to_60min_after_previous_frame']).to.equal(0);
    });

  it('should parse 4820010000012700000060000000000000000000000000000000000000000000000000000000000000000000000000000'
    + '00000 + 1020010003010222003c000000000000000000000000', () => {
      const payloadString = '48200100000127000000600000000000000000000000000000000000000000000000000000000000000'
        + '0000000000000000000';
      const configurationString = '1020010003010222003c000000000000000000000000';
      const content = pulse0x48Parser.parseFrame(Buffer.from(payloadString, 'hex'),
        Buffer.from(configurationString, 'hex'),
        'lora868');
      expect(content.type).to.equal('0x48 Pulse historic data');
      expect(content['frame_index']).to.equal(1);
      expect(content['channelA_delta_11h_to_12h_after_previous_frame']).to.equal(0);
      expect(content['channelB_delta_11h_to_12h_after_previous_frame']).to.equal(295);
      expect(content['channelA_delta_12h_to_13h_after_previous_frame']).to.equal(0);
      expect(content['channelB_delta_12h_to_13h_after_previous_frame']).to.equal(96);
      expect(content['channelA_delta_13h_to_14h_after_previous_frame']).to.equal(0);
      expect(content['channelB_delta_13h_to_14h_after_previous_frame']).to.equal(0);
      expect(content['channelA_delta_14h_to_15h_after_previous_frame']).to.equal(0);
      expect(content['channelB_delta_14h_to_15h_after_previous_frame']).to.equal(0);
      expect(content['channelA_delta_15h_to_16h_after_previous_frame']).to.equal(0);
      expect(content['channelB_delta_15h_to_16h_after_previous_frame']).to.equal(0);
      expect(content['channelA_delta_16h_to_17h_after_previous_frame']).to.equal(0);
      expect(content['channelB_delta_16h_to_17h_after_previous_frame']).to.equal(0);
      expect(content['channelA_delta_17h_to_18h_after_previous_frame']).to.equal(0);
      expect(content['channelB_delta_17h_to_18h_after_previous_frame']).to.equal(0);
      expect(content['channelA_delta_18h_to_19h_after_previous_frame']).to.equal(0);
      expect(content['channelB_delta_18h_to_19h_after_previous_frame']).to.equal(0);
      expect(content['channelA_delta_19h_to_20h_after_previous_frame']).to.equal(0);
      expect(content['channelB_delta_19h_to_20h_after_previous_frame']).to.equal(0);
      expect(content['channelA_delta_20h_to_21h_after_previous_frame']).to.equal(0);
      expect(content['channelB_delta_20h_to_21h_after_previous_frame']).to.equal(0);
      expect(content['channelA_delta_21h_to_22h_after_previous_frame']).to.equal(0);
      expect(content['channelB_delta_21h_to_22h_after_previous_frame']).to.equal(0);
      expect(content['channelA_delta_22h_to_23h_after_previous_frame']).to.equal(0);
      expect(content['channelB_delta_22h_to_23h_after_previous_frame']).to.equal(0);
    });
});
