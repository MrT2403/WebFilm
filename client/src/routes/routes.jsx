import HomePage from "../pages/HomePage";
import PersonDetail from "../pages/PersonDetail";
import FavoriteList from "../pages/FavoriteList";
import MediaDetail from "../pages/MediaDetail";
import MediaList from "../pages/MediaList";
import MediaSearch from "../pages/MediaSearch";
import ReviewList from "../pages/ReviewList";
import ProtectedPage from "../components/common/ProtectedPage";
import PasswordUpdate from "../pages/PasswordUpdate";
import TestMediaSearch from "../pages/TestMediaSearch";

export const routesGen = {
  home: "/",
  mediaList: (type) => `/${type}`,
  mediaDetail: (type, id) => `/${type}/${id}`,
  person: (id) => `/person/${id}`,
  favoriteList: "/favorites",
  reviewList: "reviews",
  passwordUpdate: "password-update",
  mediaSearch: "/search",
};

const routes = [
  {
    index: true,
    element: <HomePage></HomePage>,
    state: "home",
  },
  {
    path: "/person/:personId",
    element: <PersonDetail></PersonDetail>,
    state: "person.detail",
  },
  {
    path: "/search",
    element: <MediaSearch></MediaSearch>,
    state: "search",
  },
  {
    path: "/password-update",
    element: (
      <ProtectedPage>
        <PasswordUpdate></PasswordUpdate>
      </ProtectedPage>
    ),
    state: "password.update",
  },
  {
    path: "/favorites",
    element: (
      <ProtectedPage>
        <FavoriteList></FavoriteList>
      </ProtectedPage>
    ),
    state: "favorites",
  },
  {
    path: "/reviews",
    element: (
      <ProtectedPage>
        <ReviewList></ReviewList>
      </ProtectedPage>
    ),
    state: "reviews",
  },
  {
    path: "/:mediaType",
    element: <MediaList></MediaList>,
  },
  {
    path: "/:mediaType/:mediaId",
    element: <MediaDetail></MediaDetail>,
  },
];

export default routes;
