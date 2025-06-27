const { createUser, findUserByUsername } = require('./user');
describe('User Model', () => {
  it('should have createUser and findUserByUsername functions', () => {
    expect(typeof createUser).toBe('function');
    expect(typeof findUserByUsername).toBe('function');
  });
});
