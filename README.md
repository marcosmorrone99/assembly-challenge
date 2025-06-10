# Assembly Challenge - Pexels Gallery

A simple web application that recreates the Unsplash homepage experience using the Pexels API.

## Technologies Used

- **Next.js 14 (App Router)**
- **tRPC** (for calling server-side API functions)
- **React Query** (for fetching & caching data)
- **Tailwind CSS** (for styling)
- **TypeScript**

## Features

- Display the top photos of the day from Pexels
- Responsive grid layout with masonry-style columns
- Photo search functionality with URL persistence
- Click on photos to view more information
- Infinite scroll for loading more photos

## URL Persistence for Search

The application now supports URL persistence for search queries, which means:

- **Shareable URLs**: When you search for something, the search query is added to the URL (e.g., `/?q=nature`)
- **Bookmarkable**: You can bookmark a search result page and return to it later
- **Browser back/forward**: Search state is preserved when navigating with browser buttons
- **Direct links**: You can share a direct link with a search query to others
- **Clear search**: When you click "Clear search", the URL is cleaned and returns to the homepage

### Testing URL Persistence

To test the URL persistence feature:

1. Start the development server: `npm run dev`
2. Go to `http://localhost:3000`
3. Search for something (e.g., "nature")
4. Notice the URL changes to `http://localhost:3000/?q=nature`
5. Refresh the page - the search results should persist
6. Click "Clear search" - the URL should return to `http://localhost:3000`
7. Use browser back/forward buttons to navigate between search states

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env.local` file with your Pexels API key:
   ```
   PEXELS_API_KEY=your_pexels_api_key_here
   ```
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
