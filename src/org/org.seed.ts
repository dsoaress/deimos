import { Factory, Seeder } from 'typeorm-seeding'

import { Org } from './org.entity'

export default class CreateTeams implements Seeder {
  public async run(factory: Factory) {
    await factory(Org)().createMany(1000)
  }
}
