import HomePage from "../pages/HomePage";
import PersonDetail from "../pages/PersonDetail";
import FavoriteList from "../pages/FavoriteList";
import MediaDetail from "../pages/MediaDetail";
import MediaList from "../pages/MediaList";
import MediaSearch from "../pages/MediaSearch";
import ReviewList from "../pages/ReviewList";
import ProtectedPage from "../components/common/ProtectedPage";
import PasswordUpdate from "../pages/PasswordUpdate";
import Booking from "../pages/Booking";
import CinemaList from "../pages/CinemaList";
import CinemaDetail from "../pages/CinemasDetail";
import Payment from "../pages/Payment";
import PaymentResult from "../components/common/PaymentResult";
import ForgotPassword from "../components/common/ForgotPassword";
import ResetPassword from "../components/common/ResetPassword";

export const routesGen = {
  home: "/",
  mediaList: (type) => `/${type}`,
  mediaDetail: (type, id) => `/${type}/${id}`,
  person: (id) => `/person/${id}`,
  favoriteList: "/favorites",
  reviewList: "reviews",
  passwordUpdate: "password-update",
  mediaSearch: "/search",
  booking: (type, id) => `/booking/${type}/:id`,
  cinema: "/cinemas",
  payment: "/payment",
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
    path: "/booking/:mediaType/:mediaId",
    element: <Booking></Booking>,
    state: "booking",
  },
  {
    path: "/:mediaType",
    element: <MediaList></MediaList>,
  },
  {
    path: "/:mediaType/:mediaId",
    element: <MediaDetail></MediaDetail>,
  },
  {
    path: "/cinemas",
    element: <CinemaList></CinemaList>,
  },
  {
    path: "/cinemas/:type/:loca",
    element: <CinemaDetail></CinemaDetail>,
  },
  {
    path: "/payment",
    element: <Payment></Payment>,
  },
  {
    path: "/payment/result",
    element: <PaymentResult></PaymentResult>,
  },
  {
    path: "/seats/status",
    element: <></>,
  },
  {
    path: "/user/forgot-password",
    element: <ForgotPassword></ForgotPassword>,
  },
  {
    path: "/user/reset-password/:token",
    element: <ResetPassword></ResetPassword>,
  },
];

export default routes;
