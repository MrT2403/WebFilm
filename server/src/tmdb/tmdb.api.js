import axiosClient from "../axios/axios.client.js";
import tmdbEnpoints from "./tmdb.endpoints.js";

const tmdbApi = {
  mediaList: async ({ mediaType, mediaCategory, page }) =>
    await axiosClient.get(
      tmdbEnpoints.mediaList({ mediaType, mediaCategory, page })
    ),
  mediaDetail: async ({ mediaType, page }) =>
    await axiosClient.get(tmdbEnpoints.mediaDetail({ mediaType, page })),
  mediaGenres: async ({ mediaType }) =>
    await axiosClient.get(tmdbEnpoints.mediaGenres({ mediaType })),
  mediaCredits: async ({ mediaType, mediaId }) =>
    await axiosClient.get(tmdbEnpoints.mediaCredits({ mediaType, mediaId })),
  mediaVideos: async ({ mediaType, mediaId }) =>
    await axiosClient.get(tmdbEnpoints.mediaVideos({ mediaType, mediaId })),
  mediaRecommend: async ({ mediaType, mediaId }) =>
    await axiosClient.get(tmdbEnpoints.mediaRecommend({ mediaType, mediaId })),
  mediaSearch: async ({ mediaType, query, page }) =>
    await axiosClient.get(tmdbEnpoints.mediaSearch({ mediaType, query, page })),
  personDetail: async ({ personId }) =>
    await axiosClient.get(tmdbEnpoints.personDetail({ personId })),
  personMedias: async ({ personId }) =>
    await axiosClient.get(tmdbEnpoints.personMedias({ personId })),
};

export default tmdbApi;
