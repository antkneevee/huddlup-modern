module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  },
  extensionsToTreatAsEsm: ['.jsx'],
  modulePathIgnorePatterns: ['<rootDir>/temp-unzip/']
};
