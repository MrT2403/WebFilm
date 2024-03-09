import { Box, Button, Stack, TextField, Toolbar } from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import MediaGrid from "../components/common/MediaGrid";
import uiConfigs from "../configs/ui.configs";
import useSpeechRegconition from "../hooks/useSpeechRegconition";
import MicOutlinedIcon from "@mui/icons-material/MicOutlined";
import mediaApi from "../api/modules/media.api";
import { toast } from "react-toastify";

const mediaTypes = ["movie", "tv", "people"];

const MediaSearch = () => {
  const {
    text,
    isListening,
    startListening,
    stopListening,
    hasRecognitionSupport,
  } = useSpeechRegconition();
  const [query, setQuery] = useState("");
  const [mediaType, setMediaType] = useState(mediaTypes[0]);
  const [medias, setMedias] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [fromSpeechRecognition, setFromSpeechRecognition] = useState(false);

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
      if (page > 1) {
        setMedias((m) => [...m, ...results]);
      } else {
        setMedias([...results]);
      }
      setNoResults(results.length === 0);
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

  const loadMore = async () => {
    setPage((prevPage) => prevPage + 1);
    await search();
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
          <div style={{ position: "relative" }}>
            <TextField
              color="success"
              value={query}
              sx={{ width: "100%" }}
              placeholder="Search..."
              autoFocus
              autoComplete="new-password"
              onChange={onQueryChange}
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

          {noResults && !fromSpeechRecognition ? (
            <Box sx={{ textAlign: "center" }}>
              <p>No results found.</p>
            </Box>
          ) : (
            <MediaGrid medias={medias} mediaType={mediaType} />
          )}

          {medias.length > 0 && (
            <Button
              variant="contained"
              onClick={loadMore}
              sx={{ mt: 2 }}
              disabled={loading}
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
