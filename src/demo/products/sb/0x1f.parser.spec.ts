/// <reference path='0x1f.parser.ts' />

import { expect } from 'chai';
import 'mocha';

describe('Sb0x1fParser', () => {
  let sb0x1fParser: codec.Sb0x1fParser;

  beforeEach(() => {
    sb0x1fParser = new codec.Sb0x1fParser();
  });

  it('should parse frame and return correct Comfort TOR config', () => {
    const payloadString = '1f20410001410001';
    const content = sb0x1fParser.parseFrame(Buffer.from(payloadString, 'hex'), Buffer.from(''), 'unknown');
    expect(content.type).to.equal('0x1f Smart Building channels configuration');
    expect(content['channel1_configuration_type']).to.equal('event_on');
    expect(content['channel1_configuration_debounce_duration']).to.equal('100msec');
    expect(content['channel1_alarm_threshold']).to.equal(1);
    expect(content['channel2_configuration_type']).to.equal('event_on');
    expect(content['channel2_configuration_debounce_duration']).to.equal('100msec');
    expect(content['channel2_alarm_threshold']).to.equal(1);
  });

  it('should parse frame and return correct Motion TOR config', () => {
    const payloadString = '1f20410001000001';
    const content = sb0x1fParser.parseFrame(Buffer.from(payloadString, 'hex'), Buffer.from(''), 'unknown');
    expect(content.type).to.equal('0x1f Smart Building channels configuration');
    expect(content['channel1_configuration_type']).to.equal('event_on');
    expect(content['channel1_configuration_debounce_duration']).to.equal('100msec');
    expect(content['channel1_alarm_threshold']).to.equal(1);
    expect(content['channel2_configuration_type']).to.equal('deactivated');
    expect(content['channel2_configuration_debounce_duration']).to.equal('no_debounce');
    expect(content['channel2_alarm_threshold']).to.equal(1);
  });
});
