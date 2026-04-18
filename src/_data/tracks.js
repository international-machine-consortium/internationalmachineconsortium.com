const releases = require("./releases.js");

// Flatten tracks with their parent release context so each song page
// can be generated via pagination.
module.exports = releases.flatMap((release) =>
  release.tracks.map((track) => ({
    ...track,
    release: {
      slug: release.slug,
      name: release.name,
      type: release.type,
      year: release.year,
      spotifyId: release.spotifyId,
    },
  }))
);
