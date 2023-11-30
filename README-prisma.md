# Prisma

## Install Prisma
```bash
npm install prisma --save-dev
```
```bash
npx prisma init --datasource-provider postgresql
```

## Select database
Create an .env file in the root folder of your project, if it does not yet exist,
add an DATABASE_URL variable and set it to a valid connection string, e.g.
```bash
DATABASE_URL="postgresql://xxxxx:yyyyy-little-credit-30716388.eu-central-1.aws.neon.tech/IsarAmper?sslmode=require"
```

## Pull database
```bash
npx prisma db pull
```

## Push database after schema change
```bash
npx prisma migrate dev --name=..comment..
```

## Update local prisma client
```bash
npx prisma generate
```

## Run prisma UI
```bash
npx prisma studio
```