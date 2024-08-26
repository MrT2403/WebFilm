import { Box, Button, Stack, TextField, Toolbar } from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import MediaGrid from "../components/common/MediaGrid";
import uiConfigs from "../configs/ui.configs";
import useSpeechRecognition from "../hooks/useSpeechRegconition";
import MicOutlinedIcon from "@mui/icons-material/MicOutlined";
import mediaApi from "../api/modules/media.api";
import { toast } from "react-toastify";

const mediaTypes = ["movie", "tv", "people"];
const RESULTS_PER_PAGE = 20;

const MediaSearch = () => {
  const {
    text,
    isListening,
    startListening,
    stopListening,
    hasRecognitionSupport,
  } = useSpeechRecognition();
  const [query, setQuery] = useState("");
  const [mediaType, setMediaType] = useState(mediaTypes[0]);
  const [medias, setMedias] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [fromSpeechRecognition, setFromSpeechRecognition] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchClickedTwice, setSearchClickedTwice] = useState(false);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("searchHistory"));
    if (storedHistory) {
      setSearchHistory(storedHistory);
    }
  }, []);

  useEffect(() => {
    if (query === "" && searchHistory.length > 0 && searchClickedTwice) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [query, searchHistory, searchClickedTwice]);

  const saveSearchHistory = (searchInfo) => {
    const { query, mediaType } = searchInfo;
    if (query.trim() !== "") {
      const updatedHistory = [searchInfo, ...searchHistory.slice(0, 4)];
      localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
      setSearchHistory(updatedHistory);
    }
  };

  const removeSearchHistory = (index) => {
    const updatedHistory = [...searchHistory];
    updatedHistory.splice(index, 1);
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
    setSearchHistory(updatedHistory);
  };

  const search = useCallback(async () => {
    setLoading(true);

    const { response, err } = await mediaApi.search({
      mediaType,
      query,
      page,
    });
    setLoading(false);

    if (err) toast.error(err.message);
    if (response) {
      const results = response.results;
      if (page === 1) {
        setMedias([...results.slice(0, RESULTS_PER_PAGE)]);
      } else {
        setMedias((m) => [
          ...m,
          ...results.slice(
            (page - 1) * RESULTS_PER_PAGE,
            page * RESULTS_PER_PAGE
          ),
        ]);
      }
      setNoResults(results.length === 0);

      saveSearchHistory({ query, mediaType });
    }
  }, [mediaType, query, page]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter" || event.key === " ") {
        if (query.trim().length > 0) {
          search();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [query, search]);

  useEffect(() => {
    setMedias([]);
    setPage(1);
    setNoResults(false);
    setFromSpeechRecognition(false);
  }, [mediaType]);

  const onCategoryChange = (selectedCategory) => {
    setMediaType(selectedCategory);
  };

  const onQueryChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    if (newQuery.trim().length === 0 && query) {
      stopListening();
    }
  };

  const handleSpeechRecognition = (text) => {
    if (text) {
      setQuery(text);
      setFromSpeechRecognition(true);
    }
  };

  useEffect(() => {
    if (text && text.trim().length > 0) {
      handleSpeechRecognition(text);
      setNoResults(false);
    }
  }, [text]);

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    if (page > 1) {
      search();
    }
  }, [page, search]);

  const handleSuggestionClick = (history) => {
    setQuery(history.query);
    setMediaType(history.mediaType);
    setSearchClickedTwice(false);
    search();
  };

  useEffect(() => {
    if (query === "" && searchClickedTwice) {
      search();
    }
  }, [query, searchClickedTwice]);

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
          <div style={{ position: "relative" }}>
            <TextField
              color="success"
              value={query}
              sx={{ width: "100%" }}
              placeholder="Search..."
              autoFocus
              autoComplete="new-password"
              onChange={onQueryChange}
              onClick={() => {
                if (query === "" && searchHistory.length > 0) {
                  setShowSuggestions(true);
                  setSearchClickedTwice(true);
                }
              }}
            />

            {hasRecognitionSupport ? (
              <>
                <MicOutlinedIcon
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                  onClick={isListening ? stopListening : startListening}
                />
                {isListening ? (
                  <div>Your browser is currently listening</div>
                ) : null}
              </>
            ) : (
              <div>Your browser has no speech recognition support</div>
            )}
          </div>

          {showSuggestions && (
            <Stack spacing={1} sx={{ mt: 1 }}>
              <p>Search history:</p>
              {searchHistory.map((history, index) => (
                <Stack key={index} direction="row" alignItems="center">
                  <Button
                    onClick={() => handleSuggestionClick(history)}
                    sx={{ flexGrow: 1 }}
                  >
                    {history.query} - {history.mediaType}
                  </Button>
                  <Button
                    onClick={() => removeSearchHistory(index)}
                    variant="outlined"
                    color="error"
                  >
                    Remove
                  </Button>
                </Stack>
              ))}
            </Stack>
          )}

          {noResults && !fromSpeechRecognition ? (
            <Box sx={{ textAlign: "center" }}>
              <p>No results found.</p>
            </Box>
          ) : (
            <MediaGrid medias={medias} mediaType={mediaType} />
          )}

          {medias.length > 0 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Button
                variant="contained"
                onClick={loadMore}
                sx={{ width: "200px" }}
                disabled={loading}
              >
                Load more
              </Button>
            </Box>
          )}
        </Stack>
      </Box>
    </>
  );
};

export default MediaSearch;
