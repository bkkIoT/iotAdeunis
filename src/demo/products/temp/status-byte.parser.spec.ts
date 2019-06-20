/// <reference path='status-byte.parser.ts' />

import { expect } from 'chai';
import 'mocha';

describe('TempStatusByteParser', () => {
  let tempStatusByteParser: codec.TempStatusByteParser;

  beforeEach(() => {
    tempStatusByteParser = new codec.TempStatusByteParser();
  });

  it('should parse 43400100f40200f1', () => {
    const payloadString = '43400100f40200f1';
    const content = tempStatusByteParser.parseFrame(Buffer.from(payloadString, 'hex'), Buffer.from(''), 'unknown');
    // tslint:disable-next-line:no-unused-expression
    expect(content['ambient_probe_alarm']).to.equal(false);
    // tslint:disable-next-line:no-unused-expression
    expect(content['remote_probe_alarm']).to.equal(false);
  });
});
