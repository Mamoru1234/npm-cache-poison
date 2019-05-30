const { describe } = require('mocha');
const { expect } = require('chai');
const bcrypt = require('bcrypt');

describe('test bcrypt  package', () => {
  it('genSalt', async () => {
    const salt = await bcrypt.genSalt(10, 'a');
    expect(salt).to.be.a('string');
  });
  it('generate hash', async () => {
    const salt = await bcrypt.genSalt(10, 'a');
    const hash = await bcrypt.hash('test', salt);
    expect(hash).to.be.a('string');
  });
  it('compare hash', async () => {
    const salt = await bcrypt.genSalt(10, 'a');
    const data = 'test';
    const hash = await bcrypt.hash(data, salt);
    const result = await bcrypt.compare(data, hash);
    expect(result).to.be.eql(true);
  })
});
