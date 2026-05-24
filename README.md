# Job Application Tracker

A full-stack job application tracker built with Next.js, Better Auth, MongoDB, Mongoose, and drag-and-drop kanban boards.

## Project Status

The core project is complete and ready to run locally. It includes:

- Email and password authentication
- User-specific kanban boards
- Drag-and-drop job application management
- Job cards with details, notes, links, and status columns
- Seed data for quickly populating a demo board

## Requirements

- Node.js 20 or newer
- MongoDB database connection string
- A local `.env.local` file with the required auth and database values

## Environment Variables

Create a `.env.local` file in the project root with values similar to this:

```bash
# Required
MONGODB_URI=mongodb+srv://<your-user>:<your-password>@<your-cluster>/<your-db>

# Optional, but recommended for local auth redirects and previews
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

# Required only if you want to seed demo data
SEED_USER_ID=<your-user-id>
```

Example `.env.local`:

```bash
MONGODB_URI=mongodb+srv://job-tracker_user:examplePassword@cluster0.mongodb.net/job-tracker
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
SEED_USER_ID=69e4f392352696aa5054123b
```

## Install

```bash
npm install
```

## Run Locally

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Seed Demo Data

After creating an account, copy that user id into `SEED_USER_ID` and run:

```bash
npm run seed:jobs
```

This clears existing job applications for that user and repopulates the board with sample data.

## Available Scripts

- `npm run dev` - start the development server
- `npm run build` - build the app for production
- `npm run start` - start the production server
- `npm run lint` - run ESLint
- `npm run seed:jobs` - seed sample job applications using `.env.local`

## Tech Stack

- Next.js 16
- React 19
- Better Auth
- MongoDB and Mongoose
- DnD Kit
- Tailwind CSS
