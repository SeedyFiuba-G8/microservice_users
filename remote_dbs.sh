#! /bin/sh

# This script will automatically update remote dbs
# DANGER: This sould be removed when repository is made public!

DEV_URL='postgres://zdbfqwpsneskcl:9148d81905978537b11b44d550cd6cb084442b222e4f61f201abd4f5d3736845@ec2-34-225-103-117.compute-1.amazonaws.com:5432/detsgssv9es357'
PROD_URL='postgres://dxzvsxkwzuwccr:a6a9908d32cae04209f12945b655184986fe6480b450da6bec60d09c14e381b1@ec2-18-233-83-165.compute-1.amazonaws.com:5432/d5f581nh6vcg3f'

echo "\n> Updating dev..."
DATABASE_URL=$DEV_URL ./init_db.sh

echo "\n> Updating prod..."
DATABASE_URL=$PROD_URL ./init_db.sh
