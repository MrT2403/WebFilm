import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Chip,
  Divider,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import Rate from "../components/common/Rate";
import Container from "../components/common/Container";
import ImgHeader from "../components/common/ImgHeader";

import uiConfigs from "../configs/ui.configs";
import tmdbConfigs from "../api/configs/tmdb.config";
import mediaApi from "../api/modules/media.api";
import favoriteApi from "../api/modules/favorite.api";

import { setGlobalLoading } from "../redux/features/globalLoadingSlice";
import { setAuthModalOpen } from "../redux/features/authModalSlice";
import { addFavorite, removeFavorite } from "../redux/features/userSlice";

import Cast from "../components/common/Cast";
import MediaVideos from "../components/common/MediaVideos";
import Backdrop from "../components/common/Backdrop";
import Poster from "../components/common/Poster";
import Recommend from "../components/common/Recommend";
import Media from "../components/common/Media";
import MediaReview from "../components/common/MediaReview";

const MediaDetail = () => {
  const { mediaType, mediaId } = useParams();

  const { user, listFavorites } = useSelector((state) => state.user);

  const [media, setMedia] = useState();
  const [isFavorite, setIsFavorite] = useState(false);
  const [onRequest, setOnRequest] = useState(false);
  const [genres, setGenres] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const [activeTab, setActiveTab] = useState(0);
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const getMedia = async () => {
      dispatch(setGlobalLoading(true));
      const { response, err } = await mediaApi.getDetail({
        mediaType,
        mediaId,
      });
      dispatch(setGlobalLoading(false));
      if (response) {
        setMedia(response);
        setIsFavorite(response.isFavorite);
        setGenres(response.genres.splice(0, 2));
      }

      if (err) toast.error(err.message);
    };

    getMedia();
  }, [mediaType, mediaId, dispatch]);

  const onFavoriteClick = async () => {
    if (!user) return dispatch(setAuthModalOpen(true));

    if (onRequest) return;

    if (isFavorite) {
      onRemoveFavorite();
      return;
    }

    setOnRequest(true);

    const body = {
      mediaId: media.id,
      mediaTitle: media.title || media.name,
      mediaType: mediaType,
      mediaPoster: media.poster_path,
      mediaRate: media.vote_average,
    };

    const { response, err } = await favoriteApi.add(body);
    setOnRequest(false);

    if (err) toast.error(err.message);
    if (response) {
      dispatch(addFavorite(response));
      setIsFavorite(true);
      toast.success("Add favorite success");
    }
  };

  const onRemoveFavorite = async () => {
    if (onRequest) return;
    setOnRequest(true);
    const favorite = listFavorites.find(
      (e) => e.mediaId.toString() === media.id.toString()
    );
    const { response, err } = await favoriteApi.remove({
      favoriteId: favorite.id,
    });

    setOnRequest(false);

    if (err) toast.error(err.message);
    if (response) {
      dispatch(removeFavorite(favorite));
      setIsFavorite(false);
      toast.success("Remove favorite success");
    }
  };

  const handleBookingClick = () => {
    navigate(`/booking/${mediaType}/${media.id}`);
  };

  return media ? (
    <>
      <ImgHeader
        imgPath={tmdbConfigs.backdropPath(
          media.backdrop_path || media.poster_path
        )}
      />
      <Box
        sx={{
          color: "primary.contrastText",
          ...uiConfigs.style.mainContent,
        }}
      >
        <Box
          sx={{
            marginTop: { xs: "-10rem", md: "-15rem", lg: "-20rem" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { md: "row", xs: "column" },
            }}
          >
            <Box
              sx={{
                width: { xs: "70%", sm: "50%", md: "40%" },
                margin: { xs: "0 auto 2rem", md: "0 2rem 0 0" },
              }}
            >
              <Box
                sx={{
                  paddingTop: "140%",
                  ...uiConfigs.style.backgroundImage(
                    tmdbConfigs.posterPath(
                      media.poster_path || media.backdrop_path
                    )
                  ),
                }}
              />
            </Box>
            <Box
              sx={{
                width: { xs: "100%", md: "60%" },
                color: "text.primary",
              }}
            >
              <Stack spacing={5}>
                <Typography
                  variant="h4"
                  fontSize={{ xs: "2rem", md: "2rem", lg: "4rem" }}
                  fontWeight="700"
                  sx={{ ...uiConfigs.style.typoLines(2, "left") }}
                >
                  {`${media.title || media.name} ${
                    mediaType === tmdbConfigs.mediaType.movie
                      ? media.release_date.split("-")[0]
                      : media.first_air_date.split("-")[0]
                  }`}
                </Typography>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Rate value={media.vote_average / 2} />
                  <Divider orientation="vertical" />
                  {genres.map((genre, index) => (
                    <Chip
                      label={genre.name}
                      variant="filled"
                      color="primary"
                      key={index}
                    />
                  ))}
                </Stack>

                <Typography
                  variant="body1"
                  sx={{ ...uiConfigs.style.typoLines(5) }}
                >
                  {media.overview}
                </Typography>

                <Stack direction="row" spacing={1}>
                  <LoadingButton
                    variant="text"
                    sx={{
                      width: "max-content",
                      "& .MuiButon-starIcon": { marginRight: "0" },
                    }}
                    size="large"
                    startIcon={
                      isFavorite ? (
                        <FavoriteIcon />
                      ) : (
                        <FavoriteBorderOutlinedIcon />
                      )
                    }
                    loadingPosition="start"
                    loading={onRequest}
                    onClick={onFavoriteClick}
                  />
                  <Button
                    variant="contained"
                    sx={{ width: "max-content" }}
                    size="large"
                    startIcon={<PlayArrowIcon />}
                    onClick={() => videoRef.current.scrollIntoView()}
                  >
                    watch now
                  </Button>
                  <Button variant="contained" onClick={handleBookingClick}>
                    Book Now
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Box>
        </Box>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          centered
          sx={{ marginTop: "3rem" }}
        >
          <Tab label="CAST" />
          <Tab label="BACKDROPS" />
          <Tab label="POSTERS" />
        </Tabs>
        {activeTab === 0 && (
          <Container header="Cast">
            <Cast casts={media.credits.cast} />
          </Container>
        )}

        {media.images.backdrops.length > 0 && activeTab === 1 && (
          <Container header="backdrops">
            <Backdrop backdrops={media.images.backdrops} />
          </Container>
        )}

        {media.images.posters.length > 0 && activeTab === 2 && (
          <Container header="posters">
            <Poster posters={media.images.posters} />
          </Container>
        )}

        <div ref={videoRef} style={{ paddingTop: "2rem" }}>
          <Container header="Videos">
            <MediaVideos videos={[...media.videos.results].splice(0, 5)} />
          </Container>
        </div>

        <MediaReview
          reviews={media.reviews}
          media={media}
          mediaType={mediaType}
        />

        <Container header="You might also enjoy">
          {media.recommend.length > 0 && (
            <Recommend medias={media.recommend} mediaType={mediaType} />
          )}
          {media.recommend.length === 0 && (
            <Media
              mediaType={mediaType}
              mediaCategory={tmdbConfigs.mediaCategory.top_rated}
            />
          )}
        </Container>
      </Box>
    </>
  ) : null;
};

export default MediaDetail;
