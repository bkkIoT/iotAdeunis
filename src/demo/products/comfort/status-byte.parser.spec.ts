/// <reference path='status-byte.parser.ts' />

import { expect } from 'chai';
import 'mocha';

describe('ComfortStatusByteParser', () => {
  let comfortStatusByteParser: codec.ComfortStatusByteParser;

  beforeEach(() => {
    comfortStatusByteParser = new codec.ComfortStatusByteParser();
  });

  it('should return Comfort configuration inconsistency for frame 4c8800c839', () => {
    const content = comfortStatusByteParser.parseFrame(Buffer.from('4c8800c839', 'hex'), Buffer.from(''));
    expect(content['configuration_inconsistency']).to.equal(true);
  });

  it('should not return Comfort configuration inconsistency for frame 4c8000c839', () => {
    const content = comfortStatusByteParser.parseFrame(Buffer.from('4c8000c839', 'hex'), Buffer.from(''));
    // tslint:disable-next-line:no-unused-expression
    expect(content['configuration_inconsistency']).to.equal(false);
  });
});
