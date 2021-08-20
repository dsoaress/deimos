import { Factory, Seeder } from 'typeorm-seeding'

import { Role } from '../common/enums/role.enum'
import { User } from './user.entity'

export default class CreateUsers implements Seeder {
  public async run(factory: Factory) {
    await factory(User)().createMany(100, { role: Role.designer })
    await factory(User)().createMany(10, { role: Role.account_manager })
    await factory(User)().createMany(5, { role: Role.supervisor })
    await factory(User)().createMany(5, { role: Role.admin })
  }
}
