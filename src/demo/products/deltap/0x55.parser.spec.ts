/// <reference path='0x55.parser.ts' />

import { expect } from 'chai';
import 'mocha';

describe('Deltap0x55Parser', () => {
  let deltap0x55Parser: codec.Deltap0x55Parser;

  beforeEach(() => {
    deltap0x55Parser = new codec.Deltap0x55Parser();
  });

  it('should parse data frame with historic, WITHOUT known configuration', () => {
    const payloadString = '55A0D8F0EC78000013882710';
    const content = deltap0x55Parser.parseFrame(Buffer.from(payloadString, 'hex'), Buffer.from(''), 'unknown');
    expect(content.type).to.equal('0x55 Delta P - periodic 0-10 V');
    expect(content['instantaneous_voltage_mv']).to.equal(-10000);
    expect(content['voltage_tminus1_mv']).to.equal(-5000);
    expect(content['voltage_tminus2_mv']).to.equal(0);
    expect(content['voltage_tminus3_mv']).to.equal(5000);
    expect(content['voltage_tminus4_mv']).to.equal(10000);
  });

  it('should parse data frame with historic, WITH known configuration', () => {
    const payloadString = '55A0D8F0EC78000013882710';
    const configurationString = '100021c000060001012c';
    const content = deltap0x55Parser.parseFrame(Buffer.from(payloadString, 'hex'),
      Buffer.from(configurationString, 'hex'),
      'unknown');

      expect(content.type).to.equal('0x55 Delta P - periodic 0-10 V');
      expect(content['instantaneous_voltage_mv']).to.equal(-10000);
      expect(content['voltage_tminus1_mv']).to.equal(-5000);
      expect(content['voltage_tminus2_mv']).to.equal(0);
      expect(content['voltage_tminus3_mv']).to.equal(5000);
      expect(content['voltage_tminus4_mv']).to.equal(10000);
  });
});

