import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

function escapeXML(str: string) {
  return str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;")
            .replace(/\$/g, "&#36;")
            .replace(/%/g, "&#37;");
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const username = Array.isArray(req.query.username) ? req.query.username[0] : req.query.username;
  if (!username) {
    res.status(400).json({ error: 'Username is required' });
    return;
  }
  const apiKey = process.env.LASTFM_API_KEY;

  const lastFmRecentTracksUrl = `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json`;
  const lastFmUserInfoUrl = `http://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${username}&api_key=${apiKey}&format=json`;

  try {
    const [recentTracksResponse, userInfoResponse] = await Promise.all([
      axios.get(lastFmRecentTracksUrl),
      axios.get(lastFmUserInfoUrl),
    ]);

    const recentTracks = recentTracksResponse.data.recenttracks.track.slice(0, 5);
    const profilePic = userInfoResponse.data.user.image[2]['#text']; 
    const response = await axios.get(profilePic, { responseType: 'arraybuffer' });
    const base64ProfilePic = Buffer.from(response.data, 'binary').toString('base64');
    const fullProfilePic = `data:image/png;base64,${base64ProfilePic}`;

    let svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="500" height="200" viewBox="0 0 500 200" fill="none">
        <style>
          .bg { fill: url(#grad); }
          .title { font: bold 22px 'Segoe UI', sans-serif; fill: #ffffff; }
          .section-title { font: bold 18px 'Segoe UI', sans-serif; fill: #ffd700; }
          .item { font: 12px 'Segoe UI', sans-serif; fill: #f5f5f5; }
          .index { font: bold 12px 'Segoe UI', sans-serif; fill: #ff6b6b; }
        </style>
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%">
            <stop offset="0%" style="stop-color:#1a2a3a;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#3d6073;stop-opacity:1" />
          </linearGradient>
          <clipPath id="clipCircle">
            <circle cx="440" cy="55" r="40" />
          </clipPath>
        </defs>
        <rect width="500" height="200" class="bg"/>

        <circle cx="440" cy="55" r="40" fill="white" />
        <image href="${fullProfilePic}" x="400" y="15" height="80" width="80" clip-path="url(#clipCircle)" />

        <text x="20" y="40" class="title">Recent Tracks for ${escapeXML(username)}</text>
        <text x="20" y="80" class="section-title">Recent 5 Tracks</text>
    `;

    recentTracks.forEach((track: any, index: number) => {
      const artistName = track.artist['#text'] || 'Unknown Artist';
      const trackName = track.name || 'Unknown Track';
      svgContent += `
        <text x="20" y="${100 + index * 18}" class="index">${index + 1}.</text>
        <text x="50" y="${100 + index * 18}" class="item">${escapeXML(trackName)} - ${escapeXML(artistName)}</text>`;
    });

    svgContent += `</svg>`;

    res.setHeader('Content-Type', 'image/svg+xml');
    res.status(200).send(svgContent);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data from Last.fm' });
  }
}
