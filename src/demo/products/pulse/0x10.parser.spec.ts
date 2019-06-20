/// <reference path='0x10.parser.ts' />

import { expect } from 'chai';
import 'mocha';

describe('Pulse0x10Parser', () => {
  let pulse0x10Parser: codec.Pulse0x10Parser;

  beforeEach(() => {
    pulse0x10Parser = new codec.Pulse0x10Parser();
  });

  it('should parse 1020010003010122003c000000000000000000020001', () => {
    const payloadString = '1020010003010122003c000000000000000000020001';
    const content = pulse0x10Parser.parseFrame(Buffer.from(payloadString, 'hex'), Buffer.from(''), 'lora868');
    expect(content.type).to.equal('0x10 Pulse configuration');
    expect(content['product_mode']).to.equal('PRODUCTION');
    expect(content['transmission_period_min']).to.equal(3);
    expect(content['channelA_configuration_state']).to.equal('enabled');
    expect(content['channelA_configuration_type']).to.equal('other_pull_up_off');
    expect(content['channelA_configuration_tamper_activated']).to.equal(false);
    expect(content['channelB_configuration_state']).to.equal('disabled');
    expect(content['channelB_configuration_type']).to.equal('other_pull_up_off');
    expect(content['channelB_configuration_tamper_activated']).to.equal(false);
    expect(content['historic_mode']).to.equal('historic_log_every_10min');
    expect(content['channelA_configuration_debouncing_period']).to.equal('10msec');
    expect(content['channelB_configuration_debouncing_period']).to.equal('10msec');
    expect(content['flow_calculation_period_min']).to.equal(60);
    expect(content['channelA_leakage_detection_overflow_alarm_trigger_threshold']).to.equal(0);
    expect(content['channelB_leakage_detection_overflow_alarm_trigger_threshold']).to.equal(0);
    expect(content['channelA_leakage_detection_threshold']).to.equal(0);
    expect(content['channelB_leakage_detection_threshold']).to.equal(0);
    expect(content['channelA_leakage_detection_daily_periods_below_which_leakage_alarm_triggered']).to.equal(2);
    expect(content['channelB_leakage_detection_daily_periods_below_which_leakage_alarm_triggered']).to.equal(1);
  });

  it('should parse 1020010003010222003c000000000000000000020001', () => {
    const payloadString = '1020010003010222003c000000000000000000020001';
    const content = pulse0x10Parser.parseFrame(Buffer.from(payloadString, 'hex'), Buffer.from(''), 'lora868');
    expect(content.type).to.equal('0x10 Pulse configuration');
    expect(content['product_mode']).to.equal('PRODUCTION');
    expect(content['transmission_period_min']).to.equal(3);
    expect(content['channelA_configuration_state']).to.equal('enabled');
    expect(content['channelA_configuration_type']).to.equal('other_pull_up_off');
    expect(content['channelA_configuration_tamper_activated']).to.equal(false);
    expect(content['channelB_configuration_state']).to.equal('disabled');
    expect(content['channelB_configuration_type']).to.equal('other_pull_up_off');
    expect(content['channelB_configuration_tamper_activated']).to.equal(false);
    expect(content['historic_mode']).to.equal('historic_log_every_1h');
    expect(content['channelA_configuration_debouncing_period']).to.equal('10msec');
    expect(content['channelB_configuration_debouncing_period']).to.equal('10msec');
    expect(content['flow_calculation_period_min']).to.equal(60);
    expect(content['channelA_leakage_detection_overflow_alarm_trigger_threshold']).to.equal(0);
    expect(content['channelB_leakage_detection_overflow_alarm_trigger_threshold']).to.equal(0);
    expect(content['channelA_leakage_detection_threshold']).to.equal(0);
    expect(content['channelB_leakage_detection_threshold']).to.equal(0);
    expect(content['channelA_leakage_detection_daily_periods_below_which_leakage_alarm_triggered']).to.equal(2);
    expect(content['channelB_leakage_detection_daily_periods_below_which_leakage_alarm_triggered']).to.equal(1);
  });
});
