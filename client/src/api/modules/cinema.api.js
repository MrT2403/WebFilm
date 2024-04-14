import publicClient from "../client/public.client";
import privateClient from "../client/private.client";

const cinemaEndpoints = {
  list: "/cinemas",
  movieId: ({ mediaId }) => `/cinemas/${mediaId}`,
  getCinemaByTypeAndLocation: ({ type, loca }) => `/cinemas/${type}/${loca}`,
  add: "/cinemas",
  update: "/cinemas/:id",
  delete: "/cinemas",
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
  getCinemasByMovieId: async ({ mediaId }) => {
    try {
      console.log("mediaIDDD: ", mediaId);
      const response = await publicClient.get(
        cinemaEndpoints.movieId({ mediaId })
      );
      console.log(response);
      return { response };
    } catch (err) {
      return { err };
    }
  },
  getCinemaByTypeAndLocation: async ({ type, loca }) => {
    try {
      const response = await publicClient.get(
        cinemaEndpoints.movieDetail({ type, loca })
      );
      return { response };
    } catch (err) {
      return { err };
    }
  },
  add: async () => {
    try {
      const response = await privateClient.post(cinemaEndpoints.add, {});
      return { response };
    } catch (error) {
      return { error };
    }
  },
  delete: async () => {
    try {
      const response = await privateClient.delete(cinemaEndpoints.delete);
      return { response };
    } catch (error) {
      return { error };
    }
  },
  update: async () => {
    try {
      const response = await privateClient.put(cinemaEndpoints.update, {
        params: { id: privateClient.user },
      });

      return { response };
    } catch (error) {
      return { error };
    }
  },
};

export default cinemaApi;
