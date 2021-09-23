const { SnakeNamingStrategy } = require('typeorm-naming-strategies');

module.exports = {
    namingStrategy: new SnakeNamingStrategy(),
    name: 'default',
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    cli: {
        migrationsDir: 'src/database/migrations/',
        entitiesDir: 'src/entities/',
        subscribersDir: 'src/modules/',
    },
    logging: ['query', 'error'],
    migrations: ['dist/database/migrations/*.js',],
    entities: [
        'dist/entities/**/*.entity.js',
        'dist/entities/**/*.view.js'
    ],
    synchronize: false,
    migrationsRun: true,
    keepConnectionAlive: true,
    factories: [ 'dist/database/factories/**/*.js' ],
    seeds: [ 'dist/database/seeds/**/*.js']
}
