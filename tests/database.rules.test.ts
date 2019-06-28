import { rules } from './database.rules'

test('json rules are up-to-date', () => {
  expect(JSON.stringify(rules(), null, 2)).toMatchSnapshot()
})
