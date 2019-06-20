/// <reference path='status-byte.parser.ts' />

import { expect } from 'chai';
import 'mocha';

describe('MotionStatusByteParser', () => {
  let motionStatusByteParser: codec.MotionStatusByteParser;

  beforeEach(() => {
    motionStatusByteParser = new codec.MotionStatusByteParser();
  });

  it('should return Motion configuration inconsistency for frame 4e681ed4000000', () => {
    const content = motionStatusByteParser.parseFrame(Buffer.from('4e681ed4000000', 'hex'), Buffer.from(''));
    expect(content['configuration_inconsistency']).to.equal(true);
  });

  it('should not return Motion configuration inconsistency for frame 4e601ed4000000', () => {
    const content = motionStatusByteParser.parseFrame(Buffer.from('4e601ed4000000', 'hex'), Buffer.from(''));
    // tslint:disable-next-line:no-unused-expression
    expect(content['configuration_inconsistency']).to.equal(false);
  });
});
