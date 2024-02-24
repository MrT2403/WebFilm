import { Box, Button, Stack, TextField, Toolbar } from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import MediaGrid from "../components/common/MediaGrid";
import uiConfigs from "../configs/ui.configs";
import mediaApi from "../api/modules/media.api";

const mediaTypes = ["movie", "tv", "people"];
const API_KEY = "d68c27ee1c61dfababe4a994a5dac309";

const MediaSearch = () => {
  const [query, setQuery] = useState("");
  const [mediaType, setMediaType] = useState(mediaTypes[0]);
  const [medias, setMedias] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [noResults, setNoResults] = useState(false);

  const search = useCallback(async () => {
    setLoading(true);

    const url = `https://api.themoviedb.org/3/search/${mediaType}?api_key=${API_KEY}&query=${query}&page=${page}`;
    const response = await axios.get(url);
    // const { response, err } = await mediaApi.search({
    //   mediaType,
    //   query,
    //   page,
    // });
    // console.log("response search: ", response);
    // if (err) toast.error(err.message);

    if (response) {
      const results = response.data.results;
      if (page > 1) {
        setMedias((m) => [...m, ...results.data]);
      } else {
        setMedias([...response.data.results]);
      }
      setNoResults(results.length === 0);
    }

    setLoading(false);
  }, [mediaType, query, page]);

  useEffect(() => {
    if (query.trim().length === 0) {
      setMedias([]);
      setPage(1);
      setNoResults(false);
    } else {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
      const timeout = setTimeout(search, 1000);
      setSearchTimeout(timeout);
    }
  }, [query, mediaType, page, searchTimeout, search]);

  useEffect(() => {
    setMedias([]);
    setPage(1);
    setNoResults(false);
  }, [mediaType]);

  const onCategoryChange = (selectedCategory) => {
    setMediaType(selectedCategory);
  };

  const onQueryChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
  };

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <>
      <Toolbar />
      <Box sx={{ ...uiConfigs.style.mainContent }}>
        <Stack spacing={2}>
          <Stack
            spacing={2}
            direction="row"
            justifyContent="center"
            sx={{ width: "100%" }}
          >
            {mediaTypes.map((item, index) => (
              <Button
                size="large"
                key={index}
                variant={mediaType === item ? "contained" : "text"}
                sx={{
                  color:
                    mediaType === item
                      ? "primary.contrastText"
                      : "text.primary",
                }}
                onClick={() => onCategoryChange(item)}
              >
                {item}
              </Button>
            ))}
          </Stack>
          <TextField
            color="success"
            placeholder="Search...."
            sx={{ width: "100%" }}
            autoFocus
            autoComplete="new-password"
            onChange={onQueryChange}
          />

          {noResults ? (
            <Box sx={{ textAlign: "center" }}>
              <p>No results found.</p>
            </Box>
          ) : (
            <MediaGrid medias={medias} mediaType={mediaType} />
          )}

          {medias.length > 0 && (
            <Button
              variant="contained"
              disabled={loading}
              onClick={loadMore}
              sx={{ mt: 2 }}
            >
              Load more
            </Button>
          )}
        </Stack>
      </Box>
    </>
  );
};

export default MediaSearch;
