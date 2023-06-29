Summarize
Checking queries...


Skip to content
DEV Community
Search...

Create Post


0
Jump to Comments
0
Save

Cover image for Drizzle ORM, Next Auth and PlanetScale
miljan
miljan
Posted on Jun 20


1
Drizzle ORM, Next Auth and PlanetScale
#
drizzle
#
nextjs
#
nextauth
#
planetscale
The so-called "Prisma Killer," has arrived, and that ORM's name is Drizzle. Even though Prisma provides a really great developer experience, and I personally love to use it, it also has its weaknesses.

Prisma seems not to be very performant, as said on the codedamn blog.

There is no concept of SQL-level joins in Prisma. This was one of the most shocking revelations to us. In some queries we inspected that supposedly should have used SQL Joins or subqueries, we discovered that at a low level, Prisma was fetching data from both tables and then combining the result in its “Rust” engine. This was a path for an absolute trash performance.

This has been very nice explained by Mehul Mohan in the following video on codedamn YouTube channel.


So, maybe you want to give a try to a new hot ORM, Drizzle.

What is Drizzle ORM
Drizzle is a TypeScript ORM for SQL databases. Drizzle's main philosophy is "If you know SQL, you know Drizzle ORM," as said on the project's GitHub page.

Drizzle ORM is a TypeScript ORM for SQL databases designed with maximum type safety in mind. It comes with a drizzle-kit CLI companion for automatic SQL migrations generation. Drizzle ORM is meant to be a library, not a framework.

It stays as an opt-in solution all the time at any levels. The ORM's main philosophy is "If you know SQL, you know Drizzle ORM". We follow the SQL-like syntax whenever possible, are strongly typed ground up, and fail at compile time, not in runtime.

How to use Drizzle ORM with PlanetScale and NextAuth
I've seen that many developers are struggling with using Drizzle and NextAuth together. So, let's now see how to use Drizzle along with NextJS 13, PlanetScale, and NextAuth.

Cloning a Drizzle NextAuth repo

You can simple clone drizzle-next-auth repo using the following command
git clone https://github.com/miljan-code/drizzle-next-auth.git
After that you just need to supply .env file with database url and GitHub and/or Google client ID and secret and you are ready to go.
DATABASE_URL='mysql://username:passowrd@0.0.0.0/db' #PlanetScale

NEXTAUTH_URL='http://localhost:3000'
AUTH_SECRET=

GITHUB_ID=
GITHUB_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
Connecting Drizzle, PlanetScale, and NextAuth manually

Install necessary dependencies
npm i drizzle-orm @planetscale/database
npm i -D drizzle-kit
Create Drizzle configuration file drizzle.config.ts inside root directory of your project
To complete this step, we need to install one more dependency, and that is dotenv. Importing dotenv/config inside our drizzle configuration assures that the connection string is in the environment variable file.
npm i dotenv
// drizzle.config.ts

import type { Config } from 'drizzle-kit';
import 'dotenv/config';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing');
}

export default {
  schema: './db/schema.ts',
  out: './db/migrations',
  connectionString: process.env.DATABASE_URL,
} satisfies Config;
Add database url inside environment variable file
DATABASE_URL=your url
Create a db folder inside root directory of your project. Inside db folder create index.ts and schema.ts files. In index.ts file we are going to create a db connection. Inside schema.ts file we will obviously, create our database schema needed for NextAuth.
// index.ts

import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { connect } from '@planetscale/database';

const connection = connect({
  url: process.env.DATABASE_URL,
});

export const db = drizzle(connection);
// schema.ts

import {
  datetime,
  index,
  int,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/mysql-core';

export const accounts = mysqlTable(
  'accounts',
  {
    id: varchar('id', { length: 255 }).primaryKey().notNull(),
    userId: varchar('userId', { length: 255 }).notNull(),
    type: varchar('type', { length: 255 }).notNull(),
    provider: varchar('provider', { length: 255 }).notNull(),
    providerAccountId: varchar('providerAccountId', { length: 255 }).notNull(),
    access_token: text('access_token'),
    expires_in: int('expires_in'),
    id_token: text('id_token'),
    refresh_token: text('refresh_token'),
    refresh_token_expires_in: int('refresh_token_expires_in'),
    scope: varchar('scope', { length: 255 }),
    token_type: varchar('token_type', { length: 255 }),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow().notNull(),
  },
  account => ({
    providerProviderAccountIdIndex: uniqueIndex(
      'accounts__provider__providerAccountId__idx'
    ).on(account.provider, account.providerAccountId),
    userIdIndex: index('accounts__userId__idx').on(account.userId),
  })
);

export const sessions = mysqlTable(
  'sessions',
  {
    id: varchar('id', { length: 255 }).primaryKey().notNull(),
    sessionToken: varchar('sessionToken', { length: 255 }).notNull(),
    userId: varchar('userId', { length: 255 }).notNull(),
    expires: datetime('expires').notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
  },
  session => ({
    sessionTokenIndex: uniqueIndex('sessions__sessionToken__idx').on(
      session.sessionToken
    ),
    userIdIndex: index('sessions__userId__idx').on(session.userId),
  })
);

export const users = mysqlTable(
  'users',
  {
    id: varchar('id', { length: 255 }).primaryKey().notNull(),
    name: varchar('name', { length: 255 }),
    email: varchar('email', { length: 255 }).notNull(),
    emailVerified: timestamp('emailVerified'),
    image: varchar('image', { length: 255 }),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
  },
  user => ({
    emailIndex: uniqueIndex('users__email__idx').on(user.email),
  })
);

export const verificationTokens = mysqlTable(
  'verification_tokens',
  {
    identifier: varchar('identifier', { length: 255 }).primaryKey().notNull(),
    token: varchar('token', { length: 255 }).notNull(),
    expires: datetime('expires').notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
  },
  verificationToken => ({
    tokenIndex: uniqueIndex('verification_tokens__token__idx').on(
      verificationToken.token
    ),
  })
);
Now, since we are using MySQL as our database, Drizzle Kit allows us to alter our database schema with a simple db:push command. So, we are going to add it as our script inside the package.json file.
"db:push": "drizzle-kit push:mysql --config=drizzle.config.ts"
Let's run the db:push script
npm run db:push
Ok, we've got our schema and database connection, so let's create a Drizzle Adapter for NextAuth. Inside the root directory of your project, create a lib folder, and inside the lib folder, let's create an auth folder where we are going to store our drizzle adapter (drizzle-adapter.ts) and auth options (index.ts).
In order to create a drizzle adapter we need to install one more dependency for generating unique IDs.
npm i @paralleldrive/cuid2 
// lib/auth/drizzle-adapter.ts

import { createId } from '@paralleldrive/cuid2';
import { and, eq } from 'drizzle-orm';
import { accounts, sessions, users, verificationTokens } from '@/db/schema';
import type { Adapter } from 'next-auth/adapters';
import type { PlanetScaleDatabase } from 'drizzle-orm/planetscale-serverless';

export function DrizzleAdapter(db: PlanetScaleDatabase): Adapter {
  return {
    async createUser(userData) {
      await db.insert(users).values({
        id: createId(),
        email: userData.email,
        emailVerified: userData.emailVerified,
        name: userData.name,
        image: userData.image,
      });
      const rows = await db
        .select()
        .from(users)
        .where(eq(users.email, userData.email))
        .limit(1);
      const row = rows[0];
      if (!row) throw new Error('User not found');
      return row;
    },
    async getUser(id) {
      const rows = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);
      const row = rows[0];
      return row ?? null;
    },
    async getUserByEmail(email) {
      const rows = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
      const row = rows[0];
      return row ?? null;
    },
    async getUserByAccount({ providerAccountId, provider }) {
      const rows = await db
        .select()
        .from(users)
        .innerJoin(accounts, eq(users.id, accounts.userId))
        .where(
          and(
            eq(accounts.providerAccountId, providerAccountId),
            eq(accounts.provider, provider)
          )
        )
        .limit(1);
      const row = rows[0];
      return row?.users ?? null;
    },
    async updateUser({ id, ...userData }) {
      if (!id) throw new Error('User not found');
      await db.update(users).set(userData).where(eq(users.id, id));
      const rows = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);
      const row = rows[0];
      if (!row) throw new Error('User not found');
      return row;
    },
    async deleteUser(userId) {
      await db.delete(users).where(eq(users.id, userId));
    },
    async linkAccount(account) {
      await db.insert(accounts).values({
        id: createId(),
        userId: account.userId,
        type: account.type,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        access_token: account.access_token,
        expires_in: account.expires_in as number,
        id_token: account.id_token,
        refresh_token: account.refresh_token,
        refresh_token_expires_in: account.refresh_token_expires_in as number,
        scope: account.scope,
        token_type: account.token_type,
      });
    },
    async unlinkAccount({ providerAccountId, provider }) {
      await db
        .delete(accounts)
        .where(
          and(
            eq(accounts.providerAccountId, providerAccountId),
            eq(accounts.provider, provider)
          )
        );
    },
    async createSession(data) {
      await db.insert(sessions).values({
        id: createId(),
        expires: data.expires,
        sessionToken: data.sessionToken,
        userId: data.userId,
      });
      const rows = await db
        .select()
        .from(sessions)
        .where(eq(sessions.sessionToken, data.sessionToken))
        .limit(1);
      const row = rows[0];
      if (!row) throw new Error('User not found');
      return row;
    },
    async getSessionAndUser(sessionToken) {
      const rows = await db
        .select({
          user: users,
          session: {
            id: sessions.id,
            userId: sessions.userId,
            sessionToken: sessions.sessionToken,
            expires: sessions.expires,
          },
        })
        .from(sessions)
        .innerJoin(users, eq(users.id, sessions.userId))
        .where(eq(sessions.sessionToken, sessionToken))
        .limit(1);
      const row = rows[0];
      if (!row) return null;
      const { user, session } = row;
      return {
        user,
        session: {
          id: session.id,
          userId: session.userId,
          sessionToken: session.sessionToken,
          expires: session.expires,
        },
      };
    },
    async updateSession(session) {
      await db
        .update(sessions)
        .set(session)
        .where(eq(sessions.sessionToken, session.sessionToken));
      const rows = await db
        .select()
        .from(sessions)
        .where(eq(sessions.sessionToken, session.sessionToken))
        .limit(1);
      const row = rows[0];
      if (!row) throw new Error('Coding bug: updated session not found');
      return row;
    },
    async deleteSession(sessionToken) {
      await db.delete(sessions).where(eq(sessions.sessionToken, sessionToken));
    },
    async createVerificationToken(verificationToken) {
      await db.insert(verificationTokens).values({
        expires: verificationToken.expires,
        identifier: verificationToken.identifier,
        token: verificationToken.token,
      });
      const rows = await db
        .select()
        .from(verificationTokens)
        .where(eq(verificationTokens.token, verificationToken.token))
        .limit(1);
      const row = rows[0];
      if (!row)
        throw new Error('Coding bug: inserted verification token not found');
      return row;
    },
    async useVerificationToken({ identifier, token }) {
      const rows = await db
        .select()
        .from(verificationTokens)
        .where(eq(verificationTokens.token, token))
        .limit(1);
      const row = rows[0];
      if (!row) return null;
      await db
        .delete(verificationTokens)
        .where(
          and(
            eq(verificationTokens.token, token),
            eq(verificationTokens.identifier, identifier)
          )
        );
      return row;
    },
  };
}
// lib/auth/index.ts

import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { DrizzleAdapter } from '@/lib/auth/drizzle-adapter';
import { db } from '@/db';
import type { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db),
  session: {
    strategy: 'database',
  },
  pages: {
    signIn: '/',
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
};
The next step is to add the GitHub and/or Google Client IDs and secrets inside the environment variable file, along with the Next Auth URL and Auth Secret. The NextAuth url is where your application is hosted, and the Auth Secret is any string of your choice. If you use it in production, make sure it's a strong one.
NEXTAUTH_URL='http://localhost:3000'
AUTH_SECRET=

GITHUB_ID=
GITHUB_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
If you don't know how to get GitHub or Google Client ID and secret, you should read this post.

The last step is to create an API endpoint. I'll assume that you are using an app router. Inside the app folder of your NextJS app, create a few nested folders and a route file like this: api/auth/[...nextauth]/route.ts.
// api/auth/[...nextauth]/route.ts

import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
That's all; you are all set! Happy hacking!
For future use of Next Auth inside your application, you should check out this repo for an example or use the Next Auth docs.

Acknowledgments
Shoutout to mattddean for creating a Drizzle Adapter.

Top comments (0)

Subscribe
pic
Add to the discussion
Code of Conduct • Report abuse
Read next
dsujoydev profile image
NextJs rootLayout and nested layouts on routes (A beginner's guide)
Sujoy C. Das - Jun 3

necatiozmen profile image
Next.js 13.4's Server Actions and Data Fetching
Necati Özmen - May 30

med_code profile image
How To Use Sanity with Next.js 13 full Guide
MedCode - May 22

ku6ryo profile image
Legacy pages/api works in App Router Next.js project
Ryo Kuroyanagi - Jun 2


miljan
Follow
JOINED
May 9, 2023
Trending on DEV Community 
acode123 profile image
Top 5 Websites You'll Love as a Developer👨‍💻
#webdev #javascript #programming #productivity
Ben Halpern profile image
Which Childhood Gadget Ignited Your Coding Passion?
#discuss #codenewbie #beginners
dev.to staff profile image
Which Programming Languages Have You Explored Lately?
#discuss
// lib/auth/drizzle-adapter.ts

import { createId } from '@paralleldrive/cuid2';
import { and, eq } from 'drizzle-orm';
import { accounts, sessions, users, verificationTokens } from '@/db/schema';
import type { Adapter } from 'next-auth/adapters';
import type { PlanetScaleDatabase } from 'drizzle-orm/planetscale-serverless';

export function DrizzleAdapter(db: PlanetScaleDatabase): Adapter {
  return {
    async createUser(userData) {
      await db.insert(users).values({
        id: createId(),
        email: userData.email,
        emailVerified: userData.emailVerified,
        name: userData.name,
        image: userData.image,
      });
      const rows = await db
        .select()
        .from(users)
        .where(eq(users.email, userData.email))
        .limit(1);
      const row = rows[0];
      if (!row) throw new Error('User not found');
      return row;
    },
    async getUser(id) {
      const rows = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);
      const row = rows[0];
      return row ?? null;
    },
    async getUserByEmail(email) {
      const rows = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
      const row = rows[0];
      return row ?? null;
    },
    async getUserByAccount({ providerAccountId, provider }) {
      const rows = await db
        .select()
        .from(users)
        .innerJoin(accounts, eq(users.id, accounts.userId))
        .where(
          and(
            eq(accounts.providerAccountId, providerAccountId),
            eq(accounts.provider, provider)
          )
        )
        .limit(1);
      const row = rows[0];
      return row?.users ?? null;
    },
    async updateUser({ id, ...userData }) {
      if (!id) throw new Error('User not found');
      await db.update(users).set(userData).where(eq(users.id, id));
      const rows = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);
      const row = rows[0];
      if (!row) throw new Error('User not found');
      return row;
    },
    async deleteUser(userId) {
      await db.delete(users).where(eq(users.id, userId));
    },
    async linkAccount(account) {
      await db.insert(accounts).values({
        id: createId(),
        userId: account.userId,
        type: account.type,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        access_token: account.access_token,
        expires_in: account.expires_in as number,
        id_token: account.id_token,
        refresh_token: account.refresh_token,
        refresh_token_expires_in: account.refresh_token_expires_in as number,
        scope: account.scope,
        token_type: account.token_type,
      });
    },
    async unlinkAccount({ providerAccountId, provider }) {
      await db
        .delete(accounts)
        .where(
          and(
            eq(accounts.providerAccountId, providerAccountId),
            eq(accounts.provider, provider)
          )
        );
    },
    async createSession(data) {
      await db.insert(sessions).values({
        id: createId(),
        expires: data.expires,
        sessionToken: data.sessionToken,
        userId: data.userId,
      });
      const rows = await db
        .select()
        .from(sessions)
        .where(eq(sessions.sessionToken, data.sessionToken))
        .limit(1);
      const row = rows[0];
      if (!row) throw new Error('User not found');
      return row;
    },
    async getSessionAndUser(sessionToken) {
      const rows = await db
        .select({
          user: users,
          session: {
            id: sessions.id,
            userId: sessions.userId,
            sessionToken: sessions.sessionToken,
            expires: sessions.expires,
          },
        })
        .from(sessions)
        .innerJoin(users, eq(users.id, sessions.userId))
        .where(eq(sessions.sessionToken, sessionToken))
        .limit(1);
      const row = rows[0];
      if (!row) return null;
      const { user, session } = row;
      return {
        user,
        session: {
          id: session.id,
          userId: session.userId,
          sessionToken: session.sessionToken,
          expires: session.expires,
        },
      };
    },
    async updateSession(session) {
      await db
        .update(sessions)
        .set(session)
        .where(eq(sessions.sessionToken, session.sessionToken));
      const rows = await db
        .select()
        .from(sessions)
        .where(eq(sessions.sessionToken, session.sessionToken))
        .limit(1);
      const row = rows[0];
      if (!row) throw new Error('Coding bug: updated session not found');
      return row;
    },
    async deleteSession(sessionToken) {
      await db.delete(sessions).where(eq(sessions.sessionToken, sessionToken));
    },
    async createVerificationToken(verificationToken) {
      await db.insert(verificationTokens).values({
        expires: verificationToken.expires,
        identifier: verificationToken.identifier,
        token: verificationToken.token,
      });
      const rows = await db
        .select()
        .from(verificationTokens)
        .where(eq(verificationTokens.token, verificationToken.token))
        .limit(1);
      const row = rows[0];
      if (!row)
        throw new Error('Coding bug: inserted verification token not found');
      return row;
    },
    async useVerificationToken({ identifier, token }) {
      const rows = await db
        .select()
        .from(verificationTokens)
        .where(eq(verificationTokens.token, token))
        .limit(1);
      const row = rows[0];
      if (!row) return null;
      await db
        .delete(verificationTokens)
        .where(
          and(
            eq(verificationTokens.token, token),
            eq(verificationTokens.identifier, identifier)
          )
        );
      return row;
    },
  };
}
DEV Community — A constructive and inclusive social network for software developers. With you every step of your journey.

Home
Listings
Podcasts
Videos
Tags
FAQ
Forem Shop
Sponsors
About
Contact
Guides
Software comparisons
Code of Conduct
Privacy Policy
Terms of use
Built on Forem — the open source software that powers DEV and other inclusive communities.

Made with love and Ruby on Rails. DEV Community © 2016 - 2023.