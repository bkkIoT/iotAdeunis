// CommonJS
if (typeof module !== 'undefined') {
    module.exports = codec;
}

// Test (Mocha)
if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
    (global as any).codec = codec;
}
