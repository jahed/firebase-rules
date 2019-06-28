module.exports = {
  'moduleFileExtensions': [
    'js',
    'ts'
  ],
  'transform': {
    '^.+\\.ts$': 'ts-jest'
  },
  'testMatch': [
    '**/?(*.)test.ts'
  ],
  'globals': {
    'ts-jest': {
      'tsConfig': 'tsconfig.json'
    }
  }
}
