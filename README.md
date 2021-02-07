<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

### GitLab CI

- Получаем приватный ключ и копируем его в буфер

```bash
ssh-keygen -f ~/.ssh/id_rsa


cat ~/.ssh/id_rsa
```

- Добавляем ключ на сервер

```bash
ssh-copy-id root@myenergy.stream
```

- Устанавливаем переменные окружения в gitlab `Settings -> CL/CD -> Variables`

- `HOST` - адрес сервера (root@**myenergy.stream**)
- `USER` - имя пользователя (**root**@myenergy.stream)
- `SSH_PRIVATE_KEY` - приватный ключ, результат `cat ~/.ssh/id_rsa`

### Получаем подмодули

```bash
git submodule init && git submodule update
```

### Docker

* Установить docker:
    https://docs.docker.com/engine/install/ubuntu/

* Установить docker-compose:
    https://docs.docker.com/compose/install/

```bash
  chmod +x install-docker.sh && ./install-docker.sh
  ```

* Запускам контейнеры:

    * В конфиге nginx nginx.conf.template закоментировать строку
    * `ssl_trusted_certificate   /etc/letsencrypt/live/${DOMAIN_NAME}/chain.pem;`

    * Запустить init-letsencrypt.sh
    * `source .env && chmod +x nginx/init-letsencrypt.sh && sudo nginx/init-letsencrypt.sh $DOMAIN_NAME`

    * Собираем docker image (лучше выполнить команду несколько раз, с первого раза почему-то не подхватыет .env): 
    * `docker build .`

    * Создаем базу и мигруруем: 
    * `docker-compose run web python /app/manage.py migrate --noinput`

    * Создаем таблицу для кешей
    * `docker-compose run web python /app/manage.py createcachetable`

    * Создаем админа: 
    * `docker-compose run web python /app/manage.py createsuperuser`

    * Запускаем сервис:
    * `docker-compose up -d --build`

    * Для остановки сервиса 
    * `docker-compose down`

    * Очистка всего докера
    * `docker system prune`
