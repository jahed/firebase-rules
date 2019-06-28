import { rules } from './database.rules'

test('json rules are up-to-date', () => {
  expect(rules()).toMatchSnapshot()
})
