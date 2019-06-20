/// <reference path='0x4d.parser.ts' />

import { expect } from 'chai';
import 'mocha';

describe('Comfort0x4dParser', () => {
  let comfort0x4dParser: codec.Comfort0x4dParser;

  beforeEach(() => {
    comfort0x4dParser = new codec.Comfort0x4dParser();
  });

  it('should parse 4d0009014532', () => {
    const payloadString = '4d0011014532';
    const content = comfort0x4dParser.parseFrame(Buffer.from(payloadString, 'hex'), Buffer.from(''), 'unknown');
    expect(content.type).to.equal('0x4d Comfort alarm');
    expect(content['alarm_status_temperature']).to.equal(1);
    expect(content['alarm_status_humidity']).to.equal(1);
    expect(content['temperature_celsius_degrees']).to.equal(32.5);
    expect(content['humidity_percentage']).to.equal(50);
  });
});
