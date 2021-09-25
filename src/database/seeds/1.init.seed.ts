import { CategoryEntity } from 'src/entities/category.entity';
import { PostEntity } from 'src/entities/post.entity';
import { ThemeEntity } from 'src/entities/theme.entity';
import { UserEntity } from 'src/entities/user.entity';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

export default class InitSeed implements Seeder {
  async run(factory: Factory, connection: Connection): Promise<void> {
    console.log('wefwfewf');
    const categories = [
      {
        name: 'Dev Battle',
        slug: 'dev-battle',
      },
      {
        name: 'Design Battle',
        slug: 'design-battle',
      },
      {
        name: 'Design Review',
        slug: 'design-review',
      },
      {
        name: 'Дизайн за чаем',
        slug: 'design-tea',
      },
    ];

    const themes = ['разработка', 'советы', 'дизайн', 'инструкции', 'mvp', 'проектирование', 'инструментарий'];

    for (const category of categories) {
      await CategoryEntity.save(CategoryEntity.create(category));
    }

    for (const theme of themes) {
      await ThemeEntity.save(ThemeEntity.create({ name: theme }));
    }

    const users = await factory(UserEntity)()
      .map(async (user: UserEntity) => {
        return user;
      })
      .createMany(15);

    for (const user of users) {
      for (let i = 0; i <= 5; i++) {
        const category = await CategoryEntity.createQueryBuilder('c')
          .orderBy('RANDOM()')
          .limit(1)
          .getOne();

        const fakerPost = await factory(PostEntity)({
          user,
          category,
          themes: await ThemeEntity.createQueryBuilder('t')
            .orderBy('RANDOM()')
            .limit(3)
            .getMany(),
        }).make();

        await PostEntity.save(fakerPost);
      }
    }
  }
}
