import { hash } from 'bcryptjs'
import { Factory, Seeder } from 'typeorm-seeding'

import { Role } from '../common/enums/role.enum'
import { User } from './user.entity'

export default class CreateUsers implements Seeder {
  public async run(factory: Factory) {
    await factory(User)().createMany(100, { role: Role.designer })
    await factory(User)().createMany(10, { role: Role.account_manager })
    await factory(User)().createMany(5, { role: Role.supervisor })
    await factory(User)().createMany(5, { role: Role.admin })

    const { USER_ADMIN_EMAIL, USER_CLIENT_EMAIL, USER_PASS } = process.env

    if (!USER_ADMIN_EMAIL) {
      throw new Error('USER_ADMIN_EMAIL is missing')
    }
    if (!USER_CLIENT_EMAIL) {
      throw new Error('USER_CLIENT_EMAIL is missing')
    }

    if (!USER_PASS) {
      throw new Error('USER_ADMIN_PASS is missing')
    }

    await factory(User)().create({
      firstName: 'John',
      lastName: 'Doe',
      email: USER_ADMIN_EMAIL,
      password: await hash(USER_PASS, 8),
      role: Role.admin,
      verified: true
    })

    await factory(User)().create({
      firstName: 'Jane',
      lastName: 'Doe',
      email: USER_CLIENT_EMAIL,
      password: await hash(USER_PASS, 8),
      role: Role.client,
      verified: true
    })
  }
}
