import { Factory, Seeder } from 'typeorm-seeding'

import { Role } from '../common/enums/role.enum'
import { User } from './user.entity'

export default class CreateUsers implements Seeder {
  public async run(factory: Factory) {
    await factory(User)().createMany(100, { role: Role.designer })
    await factory(User)().createMany(10, { role: Role.account_manager })
    await factory(User)().createMany(5, { role: Role.supervisor })
    await factory(User)().createMany(5, { role: Role.admin })

    await factory(User)().create({
      firstName: 'John',
      lastName: 'Doe',
      email: process.env.USER_ADMIN_EMAIL,
      password: process.env.USER_ADMIN_PASS,
      role: Role.admin,
      verified: true
    })

    await factory(User)().create({
      firstName: 'Jane',
      lastName: 'Doe',
      email: process.env.USER_CLIENT_EMAIL,
      password: process.env.USER_CLIENT_PASS,
      role: Role.client,
      verified: true
    })
  }
}
