import { URLSearchParams } from "url";
import "dotenv/config";

const baseUrl = process.env.TMDB_URL;
const key = process.env.TMDB_KEY;

const getUrl = (endpoint, params = {}) => {
  const { page = 1, ...otherParams } = params;
  const validPage = !isNaN(parseInt(page)) ? parseInt(page) : 1;
  const queryParams = new URLSearchParams({ ...otherParams, page: validPage });

  return `${baseUrl}${endpoint}?api_key=${key}&${queryParams}`;
};

const tmdbEndpoints = {
  getUrl,
  mediaList: ({ mediaType, mediaCategory, page }) =>
    getUrl(`${mediaType}/${mediaCategory}`, { page }),
  mediaDetail: ({ mediaType, mediaId }) => getUrl(`${mediaType}/${mediaId}`),
  mediaGenres: ({ mediaType }) => getUrl(`genre/${mediaType}/list`),
  mediaCredits: ({ mediaType, mediaId }) =>
    getUrl(`${mediaType}/${mediaId}/credits`),
  mediaVideos: ({ mediaType, mediaId }) =>
    getUrl(`${mediaType}/${mediaId}/videos`),
  mediaRecommend: ({ mediaType, mediaId }) =>
    getUrl(`${mediaType}/${mediaId}/recommendations`),
  mediaImages: ({ mediaType, mediaId }) =>
    getUrl(`${mediaType}/${mediaId}/images`),
  mediaSearch: ({ mediaType, query, page }) =>
    getUrl(`search/${mediaType}`, { query, page }),
  mediaTrending: ({ mediaType, mediaCategory, timeWindow }) =>
    getUrl(`${mediaType}/${mediaCategory}/${timeWindow}`),
  personDetail: ({ personId }) => getUrl(`person/${personId}`),
  personMedias: ({ personId }) => getUrl(`person/${personId}/combined_credits`),
};

export default tmdbEndpoints;
