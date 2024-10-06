import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const username = req.query.username || 'defaultUser';
  const period = req.query.period || 'overall'; // Default to 'overall' if no period is provided.
  const apiKey = process.env.LASTFM_API_KEY;

  const lastFmTopArtistsUrl = `http://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${username}&period=${period}&api_key=${apiKey}&format=json`;
  const lastFmTopTracksUrl = `http://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${username}&period=${period}&api_key=${apiKey}&format=json`;
  const lastFmTopAlbumsUrl = `http://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${username}&period=${period}&api_key=${apiKey}&format=json`;
  const lastFmRecentTracksUrl = `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json`;
  const lastFmUserInfoUrl = `http://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${username}&api_key=${apiKey}&format=json`;

  try {
    const [
      topArtistsResponse,
      topTracksResponse,
      topAlbumsResponse,
      recentTracksResponse,
      userInfoResponse,
    ] = await Promise.all([
      axios.get(lastFmTopArtistsUrl),
      axios.get(lastFmTopTracksUrl),
      axios.get(lastFmTopAlbumsUrl),
      axios.get(lastFmRecentTracksUrl),
      axios.get(lastFmUserInfoUrl),
    ]);

    const topArtists = topArtistsResponse.data.topartists.artist.slice(0, 5);
    const topTracks = topTracksResponse.data.toptracks.track.slice(0, 5);
    const topAlbums = topAlbumsResponse.data.topalbums.album.slice(0, 5);
    const recentTracks = recentTracksResponse.data.recenttracks.track.slice(0, 5);
    const profilePic = userInfoResponse.data.user.image[2]['#text']; // Medium-sized image
    const totalScrobbles = userInfoResponse.data.user.playcount; // Total scrobbles
    const totalArtists = userInfoResponse.data.user.artist_count; // Total artists

    let svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="660" height="550" viewBox="0 0 660 550" fill="none">
        <style>
          .bg { fill: url(#grad); }
          .title { font: bold 22px 'Segoe UI', sans-serif; fill: #ffffff; }
          .section-title { font: bold 18px 'Segoe UI', sans-serif; fill: #ffd700; }
          .item { font: 14px 'Segoe UI', sans-serif; fill: #f5f5f5; }
          .index { font: bold 14px 'Segoe UI', sans-serif; fill: #ff6b6b; }
          .profile { clip-path: circle(40px at center); }
          .subtitle { font: italic 12px 'Segoe UI', sans-serif; fill: #e0e0e0; }
          .stats { font: bold 12px 'Segoe UI', sans-serif; fill: #f5f5f5; }
        </style>

        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#1a2a3a;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#3d6073;stop-opacity:1" />
          </linearGradient>
        </defs>

        <rect width="660" height="550" class="bg"/>

        <text x="20" y="40" class="title">Music Stats for ${username}</text>
        <text x="20" y="60" class="subtitle">Top Artists, Tracks, and Albums</text>

        <image href="${profilePic}" x="560" y="25" height="80" width="80" class="profile"/>

        <text x="20" y="120" class="stats">Total Scrobbles: ${totalScrobbles}</text>
        <text x="20" y="140" class="stats">Total Artists: ${totalArtists}</text>

        <text x="20" y="180" class="section-title">Top 5 Artists</text>
    `;

    topArtists.forEach((artist: any, index: number) => {
      svgContent += `
        <text x="20" y="${210 + index * 25}" class="index">${index + 1}.</text>
        <text x="40" y="${210 + index * 25}" class="item">${artist.name}</text>`;
    });

    svgContent += `
        <text x="320" y="180" class="section-title">Top 5 Songs</text>`;

    topTracks.forEach((track: any, index: number) => {
      svgContent += `
        <text x="320" y="${210 + index * 25}" class="index">${index + 1}.</text>
        <text x="340" y="${210 + index * 25}" class="item">${track.name} - ${track.artist.name}</text>`;
    });

    svgContent += `
        <text x="20" y="370" class="section-title">Top 5 Albums</text>`;

    topAlbums.forEach((album: any, index: number) => {
      svgContent += `
        <text x="20" y="${400 + index * 25}" class="index">${index + 1}.</text>
        <text x="40" y="${400 + index * 25}" class="item">${album.name} - ${album.artist.name}</text>`;
    });

    svgContent += `
        <text x="320" y="370" class="section-title">Recent 5 Tracks</text>`;

    recentTracks.forEach((track: any, index: number) => {
      const artistName = track.artist['#text'] || 'Unknown Artist';
      svgContent += `
        <text x="320" y="${400 + index * 25}" class="index">${index + 1}.</text>
        <text x="340" y="${400 + index * 25}" class="item">${track.name} - ${artistName}</text>`;
    });

    svgContent += `</svg>`;

    res.setHeader('Content-Type', 'image/svg+xml');
    res.status(200).send(svgContent);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data from Last.fm' });
  }
}
