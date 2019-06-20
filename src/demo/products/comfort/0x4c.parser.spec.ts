/// <reference path='0x4c.parser.ts' />

import { expect } from 'chai';
import 'mocha';

describe('Comfort0x4cParser', () => {
  let comfort0x4cParser: codec.Comfort0x4cParser;

  beforeEach(() => {
    comfort0x4cParser = new codec.Comfort0x4cParser();
  });

  it('should parse data frame with historic, WITHOUT known configuration', () => {
    const payloadString = '4c2000c52000c72000c82000ca1f00cc1f00cd20';
    const content = comfort0x4cParser.parseFrame(Buffer.from(payloadString, 'hex'), Buffer.from(''), 'unknown');
    expect(content.type).to.equal('0x4c Comfort data');
    expect(content['instantaneous_temperature_celsius_degrees']).to.equal(19.7);
    expect(content['humidity_current_percentage']).to.equal(32);
    expect(content['temperature_tminus1_celsius_degrees']).to.equal(19.9);
    expect(content['humidity_tminus1_percentage']).to.equal(32);
    expect(content['temperature_tminus2_celsius_degrees']).to.equal(20);
    expect(content['humidity_tminus2_percentage']).to.equal(32);
    expect(content['temperature_tminus3_celsius_degrees']).to.equal(20.2);
    expect(content['humidity_tminus3_percentage']).to.equal(31);
    expect(content['temperature_tminus4_celsius_degrees']).to.equal(20.4);
    expect(content['humidity_tminus4_percentage']).to.equal(31);
    expect(content['temperature_tminus5_celsius_degrees']).to.equal(20.5);
    expect(content['humidity_tminus5_percentage']).to.equal(32);
  });

  it('should parse data frame with historic, WITH known configuration', () => {
    const payloadString = '4ce000a62b00a42b00a42b00a42b00a32b00a42b';
    const configurationString = '100021c000060001012c';
    const content = comfort0x4cParser.parseFrame(Buffer.from(payloadString, 'hex'),
      Buffer.from(configurationString, 'hex'),
      'unknown');

    expect(content.type).to.equal('0x4c Comfort data');
    expect(content['instantaneous_temperature_celsius_degrees']).to.equal(16.6);
    expect(content['humidity_current_percentage']).to.equal(43);
    expect(content['temperature_tminus1_celsius_degrees']).to.equal(16.4);
    expect(content['humidity_tminus1_percentage']).to.equal(43);
    expect(content['temperature_tminus2_celsius_degrees']).to.equal(16.4);
    expect(content['humidity_tminus2_percentage']).to.equal(43);
    expect(content['temperature_tminus3_celsius_degrees']).to.equal(16.4);
    expect(content['humidity_tminus3_percentage']).to.equal(43);
    expect(content['temperature_tminus4_celsius_degrees']).to.equal(16.3);
    expect(content['humidity_tminus4_percentage']).to.equal(43);
    expect(content['temperature_tminus5_celsius_degrees']).to.equal(16.4);
    expect(content['humidity_tminus5_percentage']).to.equal(43);
  });
});
