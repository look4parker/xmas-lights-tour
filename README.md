# Christmas Lights Tour

A single-page holiday site with a greeting, a map of houses, and a Spotify playlist. Built with Vite, React and TypeScript, and hosted on Firebase Hosting.

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
2. Create an API key. Restrict it to the Maps JavaScript API and to your site's addresses: `https://<project-id>.web.app/*`, `https://<project-id>.firebaseapp.com/*` and `http://localhost:5173/*`.
3. Set `VITE_GOOGLE_MAPS_API_KEY` in `.env.local` and as a GitHub Actions repository secret. Redeploy after changing the secret, because the value is built into the site.

## Deploy

1. Create a project in the [Firebase console](https://console.firebase.google.com/).
2. Connect GitHub Actions, using these answers. Sign-in happens in your browser.

   ```sh
   npx firebase-tools login
   npx firebase-tools init hosting:github
   ```

   - Build script: **yes**, `npm ci && npm run build`
   - Deploy to the live channel on merge: **yes**, branch `main`

3. Pass the Maps key to the build step in both files in `.github/workflows/`:

   ```yaml
   env:
     VITE_GOOGLE_MAPS_API_KEY: ${{ secrets.VITE_GOOGLE_MAPS_API_KEY }}
   ```

4. Push to `main`. The site is published at `https://<project-id>.web.app`.
