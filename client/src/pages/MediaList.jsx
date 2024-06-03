import { Box, Button, Pagination, Stack } from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import tmdbConfigs from "../api/configs/tmdb.config";
import mediaApi from "../api/modules/media.api";
import uiConfigs from "../configs/ui.configs";
import Hero from "../components/common/Hero";
import MediaGrid from "../components/common/MediaGrid";
import { setAppState } from "../redux/features/appStateSlice";
import { setGlobalLoading } from "../redux/features/globalLoadingSlice";
import { toast } from "react-toastify";
import usePrevious from "../hooks/usePrevious";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "../components/common/Container";

const MediaList = () => {
  const { mediaType } = useParams();

  const [mediaList, setMediaList] = useState([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const prevMediaType = usePrevious(mediaType);
  const dispatch = useDispatch();

  const mediaCategories = useMemo(() => ["popular", "top_rated"], []);
  const categoryLabels = ["Popular", "Top Rated"];

  useEffect(() => {
    dispatch(setAppState(mediaType));
    window.scrollTo(0, 0);
  }, [mediaType, dispatch]);

  useEffect(() => {
    const fetchMediaList = async () => {
      if (currentPage === 1) dispatch(setGlobalLoading(true));
      setMediaLoading(true);

      const { response, error } = await mediaApi.getList({
        mediaType,
        mediaCategory: mediaCategories[currentCategory],
        page: currentPage,
      });
      console.log(response);
      setMediaLoading(false);
      dispatch(setGlobalLoading(false));

      if (error) toast.error(error.message);
      if (response) {
        if (currentPage !== 1)
          setMediaList((prevList) => [...prevList, ...response.results]);
        else setMediaList([...response.results]);
      }
    };

    if (mediaType !== prevMediaType) {
      setCurrentCategory(0);
      setCurrentPage(1);
    }

    fetchMediaList();
  }, [
    mediaType,
    currentCategory,
    prevMediaType,
    currentPage,
    mediaCategories,
    dispatch,
  ]);

  const handleCategoryChange = (categoryIndex) => {
    if (currentCategory === categoryIndex) return;
    setMediaList([]);
    setCurrentPage(1);
    setCurrentCategory(categoryIndex);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    setMediaList([]);
  };

  return (
    <>
      <Hero
        mediaType={mediaType}
        mediaCategory={mediaCategories[currentCategory]}
      />
      <Box sx={uiConfigs.style.mainContent}>
        <Stack
          spacing={2}
          direction={{ xs: "column", md: "row" }}
          alignItems="center"
          justifyContent="space-between"
          sx={{ marginBottom: 4, marginTop: 3 }}
        >
          <Container
            header={
              mediaType === tmdbConfigs.mediaType.movie ? "Movies" : "TV Series"
            }
          ></Container>
          <Stack direction="row" spacing={2}>
            {categoryLabels.map((label, index) => (
              <Button
                key={index}
                size="large"
                variant={currentCategory === index ? "contained" : "text"}
                sx={{
                  color:
                    currentCategory === index
                      ? "primary.contrastText"
                      : "text.primary",
                }}
                onClick={() => handleCategoryChange(index)}
              >
                {label}
              </Button>
            ))}
          </Stack>
        </Stack>
        <MediaGrid medias={mediaList} mediaType={mediaType} />
        {mediaLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 8,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 4,
            }}
          >
            <Pagination
              count={10}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        )}
      </Box>
    </>
  );
};

export default MediaList;
