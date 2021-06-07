#! /bin/sh

DEFAULT_URL='postgres://postgres:postgres@localhost:5432/sf_users'
: "${DATABASE_URL:=$DEFAULT_URL}"

cd ./scripts
echo "Seedy FIUBA - Users microservice\n"

echo "> CREATE TABLE 'users':"
psql $DATABASE_URL -f users.sql

echo "\n> INSERT DATA TO TABLE 'users':"
psql $DATABASE_URL -f add_users.sql

echo "> CREATE TABLE 'admins':"
psql $DATABASE_URL -f admins.sql

echo "\n> INSERT DATA TO TABLE 'admins':"
psql $DATABASE_URL -f add_admins.sql
