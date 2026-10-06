# EventHub: backend

API афиши мероприятий на NestJS, PostgreSQL и TypeORM.

## Что нужно установить
- Node.js (LTS) и npm
- PostgreSQL

## Запуск
1. Установи зависимости:
```bash
   npm install
```
2. Создай в PostgreSQL базу, например `eventhub`.
3. Скопируй `.env.example` в `.env` и впиши свои значения (пользователь и пароль PostgreSQL, `JWT_SECRET`).
4. Запусти:
```bash
   npm run start:dev
```
5. Сервер работает на `http://localhost:3000`, документация Swagger: `http://localhost:3000/api/docs`.

Таблицы создаются сами при первом запуске (`synchronize: true`, только для разработки).

## Первые данные
Категорий в базе сначала нет. Чтобы создать:
1. В Swagger выполни `POST /auth/register`, скопируй `access_token` из ответа.
2. Нажми Authorize и вставь токен.
3. Выполни `POST /category` с телом `{ "name": "Концерт" }`, повтори для остальных категорий.

## Загрузка картинок
Файлы сохраняются в папку `uploads/` и раздаются по адресу `/uploads/...`.