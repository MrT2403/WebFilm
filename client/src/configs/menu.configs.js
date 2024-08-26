import HomeOutLinedIcon from "@mui/icons-material/HomeOutlined";
import SlideshowOutLinedIcon from "@mui/icons-material/SlideshowOutlined";
import LiveTvOutLinedIcon from "@mui/icons-material/LiveTvOutlined";
import FavoriteBorderOutLinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import SearchOutLinedIcon from "@mui/icons-material/SearchOutlined";
import RateReviewOutLinedIcon from "@mui/icons-material/RateReviewOutlined";
import LockResetOutLinedIcon from "@mui/icons-material/LockResetOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

const main = [
  {
    display: "home",
    path: "/",
    icon: <HomeOutLinedIcon></HomeOutLinedIcon>,
    state: "home",
  },
  {
    display: "tv series",
    path: "/tv",
    icon: <LiveTvOutLinedIcon></LiveTvOutLinedIcon>,
    state: "tv",
  },
  {
    display: "movie",
    path: "/movie",
    icon: <SlideshowOutLinedIcon></SlideshowOutLinedIcon>,
    state: "movie",
  },
  {
    display: "search",
    path: "/search",
    icon: <SearchOutLinedIcon></SearchOutLinedIcon>,
    state: "search",
  },
];

const user = [
  {
    display: "favorites",
    path: "/favorites",
    icon: <FavoriteBorderOutLinedIcon></FavoriteBorderOutLinedIcon>,
    state: "favorites",
  },
  {
    display: "reviews",
    path: "/reviews",
    icon: <RateReviewOutLinedIcon></RateReviewOutLinedIcon>,
    state: "reviews",
  },
  {
    display: "password update",
    path: "/password-update",
    icon: <LockResetOutLinedIcon></LockResetOutLinedIcon>,
    state: "password.update",
  },
  {
    display: "ticket booked",
    path: "/ticket-booked",
    icon: <ShoppingCartOutlinedIcon></ShoppingCartOutlinedIcon>,
    state: "ticket.booked",
  },
];

const admin = [
  {
    display: "favorites",
    path: "/favorites",
    icon: <FavoriteBorderOutLinedIcon></FavoriteBorderOutLinedIcon>,
    state: "favorites",
  },
  {
    display: "reviews",
    path: "/reviews",
    icon: <RateReviewOutLinedIcon></RateReviewOutLinedIcon>,
    state: "reviews",
  },
  {
    display: "password update",
    path: "/password-update",
    icon: <LockResetOutLinedIcon></LockResetOutLinedIcon>,
    state: "password.update",
  },
];

const menuConfigs = { main, user, admin };

export default menuConfigs;
