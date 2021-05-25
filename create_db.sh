#! /bin/sh

DEFAULT_URL='postgres://postgres:postgres@localhost:5432/postgres'
: "${DATABASE_URL:=$DEFAULT_URL}"

cd ./scripts
echo "Seedy FIUBA - Users microservice\n"

echo "> CREATE DATABASE 'sf_users':"
psql $DATABASE_URL -f create_db.sql
