# Prisma

## Install Prisma
npm install prisma --save-dev
npx prisma init --datasource-provider postgresql

## Select database
Set DATABASE_URL in .env to connection string

## Pull database
npx prisma db pull

## Push database after schema change
npx prisma migrate dev --name=..comment..

## Update local prisma client:
npx prisma generate

## Run prisma UI
npx prisma studio