/// <reference path='internal.codec-storage.ts' />

import 'mocha';
import { expect } from 'chai';

describe('CodecInternalStorage', () => {
  let codecInternalStorage: codec.InternalCodecStorage;

  beforeEach(() => {
    codecInternalStorage = new codec.InternalCodecStorage();
  });

  it('should return undefined', () => {
    const value = codecInternalStorage.getItem('key');
    // tslint:disable-next-line:no-unused-expression
    expect(value).to.be.undefined;
  });
});
