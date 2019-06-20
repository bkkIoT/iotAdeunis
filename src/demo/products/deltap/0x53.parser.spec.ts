/// <reference path='0x53.parser.ts' />

import { expect } from 'chai';
import 'mocha';

describe('Deltap0x53Parser', () => {
  let deltap0x53Parser: codec.Deltap0x53Parser;

  beforeEach(() => {
    deltap0x53Parser = new codec.Deltap0x53Parser();
  });

  it('should parse data frame with historic, WITHOUT known configuration', () => {
    const payloadString = '5320FE0CFF06000000FA01F4';
    const content = deltap0x53Parser.parseFrame(Buffer.from(payloadString, 'hex'), Buffer.from(''), 'unknown');
    expect(content.type).to.equal('0x53 Delta P periodic data');
    expect(content['instantaneous_delta_pressure_pa']).to.equal(-500);
    expect(content['delta_pressure_tminus1_pa']).to.equal(-250);
    expect(content['delta_pressure_tminus2_pa']).to.equal(0);
    expect(content['delta_pressure_tminus3_pa']).to.equal(250);
    expect(content['delta_pressure_tminus4_pa']).to.equal(500);
  });


  it('should parse data frame with historic, WITH known configuration', () => {
    const payloadString = '5320FE0CFF06000000FA01F4';
    const configurationString = '100021c000060001012c';
    const content = deltap0x53Parser.parseFrame(Buffer.from(payloadString, 'hex'),
      Buffer.from(configurationString, 'hex'),
      'unknown');

      expect(content.type).to.equal('0x53 Delta P periodic data');
      expect(content['instantaneous_delta_pressure_pa']).to.equal(-500);
      expect(content['delta_pressure_tminus1_pa']).to.equal(-250);
      expect(content['delta_pressure_tminus2_pa']).to.equal(0);
      expect(content['delta_pressure_tminus3_pa']).to.equal(250);
      expect(content['delta_pressure_tminus4_pa']).to.equal(500);
  });
});
