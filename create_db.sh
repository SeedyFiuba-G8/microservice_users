#! /bin/sh

cd ./scripts
echo "Seedy FIUBA - Users microservice\n"

echo "Creating database..."
psql postgres://postgres:postgres@localhost:3001/postgres -f create_db.sql
echo "Database created!\n"

echo "Creating tables..."
psql postgres://postgres:postgres@localhost:3001/postgres -f users.sql
echo "Tables created!\n"

echo "Inserting data..."
psql postgres://postgres:postgres@localhost:3001/postgres -f add_users.sql
echo "Data inserted!\n"

echo "Database migration completed."