import React, { useEffect, useState } from "react";
import mediaApi from "../api/modules/media.api";
import { TextField } from "@mui/material";
import { useParams } from "react-router-dom";

const mediaTypes = ["movie", "tv", "people"];

const TestMediaSearch = () => {
  const [movies, setMovies] = useState([]);
  const { mediaType } = useParams();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const getSearch = async () => {
      try {
        const { response, err } = await mediaApi.search({
          mediaType,
          query,
          page,
        });
        console.log("REsponse test: ", response);
      } catch (err) {
        throw err;
      }
    };

    getSearch();
  }, [mediaType, query, page]);

  const onQueryChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
  };

  return (
    <div>
      <TextField
        color="success"
        placeholder="Search...."
        sx={{ width: "100%", marginTop: 10 }}
        autoFocus
        autoComplete="new-password"
        onChange={onQueryChange}
      />
    </div>
  );
};

export default TestMediaSearch;
