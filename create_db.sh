#! /bin/sh

cd ./scripts
echo "Seedy FIUBA - Users microservice\n"

echo "Creating database..."

psql $DATABASE_URL -f create_db.sql
echo "Database created!\n"

echo "Creating tables..."
psql $DATABASE_URL -f users.sql
echo "Tables created!\n"

echo "Inserting data..."
psql $DATABASE_URL -f add_users.sql
echo "Data inserted!\n"

echo "Database migration completed."