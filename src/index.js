const fetch = require('node-fetch');
const { GitHubProfileStatus } = require('github-profile-status');

require('dotenv').config();

const LASTFM_USERNAME = 'odxs';
const LASTFM_API_KEY = process.env.LASTFM_API_KEY;
const ENDPOINT = `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USERNAME}&api_key=${LASTFM_API_KEY}&limit=1&format=json`;

(async () => {
  try {
    const profileStatus = new GitHubProfileStatus({
      token: process.env.GITHUB_ACCESS_TOKEN,
    });
    const response = await fetch(ENDPOINT, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((res) => res.recenttracks.track);

    if (!response || response.length === 0) return;
    const mostRecentTrack = response[0];
    if (mostRecentTrack['@attr'].nowplaying) {
      await profileStatus.set({
        emoji: ':musical_note:',
        message: `${mostRecentTrack.name} - ${mostRecentTrack.artist['#text']}`.toLowerCase(),
      });
    } else {
      await profileStatus.set({
        emoji: ':thought_balloon:',
        message: 'thinking about corgi',
      });
    }
  } catch (_) {
    // haha good 1
  }
})();
