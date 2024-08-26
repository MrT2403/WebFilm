const mediaType = {
  movie: "movie",
  tv: "tv",
  trending: "trending",
};

const mediaCategory = {
  all: "all",
  popular: "popular",
  top_rated: "top_rated",
  now_playing: "now_playing",
  upcoming: "upcoming",
};

const backdropPath = (imgEndpoint) =>
  `https://image.tmdb.org/t/p/original${imgEndpoint}`;

const posterPath = (imgEndpoint) =>
  `https://image.tmdb.org/t/p/w500${imgEndpoint}`;

const youtubePath = (videoId) =>
  `https://www.youtube.com/embed/${videoId}?controls=0`;

const tmdbConfigs = {
  mediaType,
  mediaCategory,
  backdropPath,
  posterPath,
  youtubePath,
};

export default tmdbConfigs;
