import * as Faker from 'faker'
import { define, factory } from 'typeorm-seeding'

import { User } from '../user/user.entity'
import { Org } from './org.entity'

define(Org, (faker: typeof Faker) => {
  const team = faker.company.companyName()

  const org = new Org()
  org.name = team
  org.owner = factory(User)() as any

  return org
})
