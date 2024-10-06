# Lastly

Lastly is a Next.js project that generates SVG images displaying music statistics from Last.fm. The project provides several API endpoints to fetch and visualize top artists, tracks, albums, and recent tracks for a given user.

## API Endpoints

The project provides the following API endpoints:

- `/api/overall`: Fetches and visualizes overall music statistics.
- `/api/top-artists`: Fetches and visualizes the top artists.
- `/api/top-tracks`: Fetches and visualizes the top tracks.
- `/api/top-albums`: Fetches and visualizes the top albums.
- `/api/recent`: Fetches and visualizes the recent tracks.

### Example Usage

#### Overall Statistics

Endpoint: `/api/overall?username=ni5arga&period=overall`

![Overall Statistics](https://lastly.nisarga.me/api/overall?username=ni5arga)

#### Top Artists

Endpoint: `/api/top-artists?username=ni5arga`

![Top Artists](https://lastly.nisarga.me/api/top-artists?username=ni5arga)

#### Top Tracks

Endpoint: `/api/top-tracks?username=ni5arga`

![Top Tracks](https://lastly.nisarga.me/api/top-tracks?username=ni5arga)

#### Top Albums

Endpoint: `/api/top-albums?username=ni5arga`

![Top Albums](https://lastly.nisarga.me/api/top-albums?username=ni5arga)

#### Recent Tracks

Endpoint: `/api/recent?username=ni5arga`

![Recent Tracks](https://lastly.nisarga.me/api/recent?username=ni5arga)

## Embedding in README

To embed in your README:

```md
![alt text](https://lastly.nisarga.me/api/overall?username=USERNAME&period=PERIOD)
```
or

```html
<img src="https://lastly.nisarga.me/api/overall?username=USERNAME&period=PERIOD" alt="Overall Statistics" align="center">
```

The latter will allow you to better format the card (e.g., `align="center"`).

### Options

- `username`: Your [last.fm](last.fm) username.

- `period`: Can be set to `overall`, `7day`, `1month`, `3month`, `6month`, `12month` (defaults to overall if not mentioned).

## Self-Hosting Guide


First, clone the repository and install the dependencies:

```bash
git clone https://github.com/ni5arga/lastly.git
cd lastly
npm install
```

Create a `.env.local` file in the root directory and add your Last.fm API key:

```env
LASTFM_API_KEY=your_lastfm_api_key
```

Run the development server:

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

### Deploy With Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fni5arga%2FLastly&env=LASTFM_API_KEY)
