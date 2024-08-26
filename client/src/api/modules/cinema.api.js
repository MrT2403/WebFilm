import publicClient from "../client/public.client";
import privateClient from "../client/private.client";

const cinemaEndpoints = {
  list: "/cinemas",
  movieId: (mediaId) => `/cinemas/movie/${mediaId}`,
  getCinemaByTypeAndLocation: (type, loca) => `/cinemas/${type}/${loca}`,
  add: "/cinemas",
  update: (id) => `/cinemas/${id}`,
  delete: (id) => `/cinemas/${id}`,
};

const cinemaApi = {
  getAllCinemas: async () => {
    try {
      const response = await publicClient.get(cinemaEndpoints.list);
      return { response };
    } catch (error) {
      return { error };
    }
  },
  getCinemasByMovieId: async (mediaId) => {
    try {
      const response = await publicClient.get(cinemaEndpoints.movieId(mediaId));
      return { response };
    } catch (err) {
      return { err };
    }
  },
  getCinemaByTypeAndLocation: async (type, loca) => {
    try {
      const response = await publicClient.get(
        cinemaEndpoints.getCinemaByTypeAndLocation(type, loca)
      );
      return { response };
    } catch (err) {
      return { err };
    }
  },
  add: async (cinemaData) => {
    try {
      const response = await privateClient.post(
        cinemaEndpoints.add,
        cinemaData
      );
      return { response };
    } catch (error) {
      return { error };
    }
  },
  delete: async (id) => {
    try {
      const response = await privateClient.delete(cinemaEndpoints.delete(id));
      return { response };
    } catch (error) {
      return { error };
    }
  },
  update: async (id, cinemaData) => {
    try {
      const response = await privateClient.put(
        cinemaEndpoints.update(id),
        cinemaData
      );
      return { response };
    } catch (error) {
      return { error };
    }
  },
};

export default cinemaApi;
