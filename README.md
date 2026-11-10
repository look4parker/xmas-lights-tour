# Christmas Lights Tour

A single-page holiday site with a greeting, a map of houses, and a Spotify playlist. Built with Vite, React and TypeScript, and hosted on AWS Amplify.

## Run locally

Requires Node 20.19 or newer.

```sh
npm install
cp .env.example .env.local   # then add your Google Maps API key
npm run dev
```

The site runs without a key, but shows a placeholder in place of the map.

## Update the content

- **Houses:** edit `src/data/houses.json`. Stops are numbered in file order. To get coordinates, right-click a spot in Google Maps and click the numbers at the top of the menu to copy them.
- **Greeting and headings:** edit `src/content.ts`.
- **Playlist:** set `spotifyPlaylistId` in `src/content.ts`. The playlist must be public.

Pushing to `main` deploys the changes.

## Google Maps setup

1. In a Google Cloud project with billing enabled, enable the **Maps JavaScript API**.
2. Create an API key. Restrict it to the Maps JavaScript API and to your site's addresses, such as `https://main.<app-id>.amplifyapp.com/*` and `http://localhost:5173/*`.
3. Set `VITE_GOOGLE_MAPS_API_KEY` in `.env.local` and in Amplify's environment variables. Redeploy after changing it in Amplify, because the value is built into the site.

## Deploy

In the AWS Amplify console, choose **Create new app**, connect this GitHub repo and the `main` branch, and add the environment variable above. The build settings come from `amplify.yml`.
