## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Run migrations

```bash
# generate migrations on local and prod
$ npm run migration:generate:local --name=User
$ npm run migration:generate:prod --name=User

# run generated migrations on local and prod
$ npm run migration:run:local
$ npm run migration:run:prod

# revert LAST migration on local and prod
$ npm run migration:revert:local
$ npm run migration:revert:prod

# show list of unaplied migrations. Or we can also test config, db connection on local and prod
$ npm run migration:show:local
$ npm run migration:show:prod
