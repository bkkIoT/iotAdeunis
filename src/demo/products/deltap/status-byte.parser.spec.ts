/// <reference path='status-byte.parser.ts' />

import { expect } from 'chai';
import 'mocha';

describe('DeltapStatusByteParser', () => {
  let deltapStatusByteParser: codec.DeltapStatusByteParser;

  beforeEach(() => {
    deltapStatusByteParser = new codec.DeltapStatusByteParser();
  });

  it('should return Deltap configuration inconsistency for frame 3008', () => {
    const content = deltapStatusByteParser.parseFrame(Buffer.from('3008', 'hex'), Buffer.from(''));
    expect(content['configuration_inconsistency']).to.equal(true);
  });

  it('should not return Deltap configuration inconsistency for frame 1000000c00010002012c', () => {
    const content = deltapStatusByteParser.parseFrame(Buffer.from('1000000c00010002012c', 'hex'), Buffer.from(''));
    // tslint:disable-next-line:no-unused-expression
    expect(content['configuration_inconsistency']).to.equal(false);
  });
});
