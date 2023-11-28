# Prisma

## Install Prisma
```bash
npm install prisma --save-dev
npx prisma init --datasource-provider postgresql
```

## Select database
Set DATABASE_URL in .env to connection string

## Pull database
```bash
npx prisma db pull
```

## Push database after schema change
```bash
npx prisma migrate dev --name=..comment..
```

## Update local prisma client:
```bash
npx prisma generate
```

## Run prisma UI
```bash
npx prisma studio
```