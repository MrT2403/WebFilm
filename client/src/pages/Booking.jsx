import React, { useEffect, useState } from "react";
import { Typography, Button, Grid, Box, Select, MenuItem } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import uiConfigs from "../configs/ui.configs";
import Container from "../components/common/Container";
import ImgHeader from "../components/common/ImgHeader";
import tmdbConfigs from "../api/configs/tmdb.config";
import mediaApi from "../api/modules/media.api";
import cinemaApi from "../api/modules/cinema.api";
import { toast } from "react-toastify";

const Booking = () => {
  const navigate = useNavigate();
  const { mediaType, mediaId } = useParams();
  const [media, setMedia] = useState();
  const [cinemas, setCinemas] = useState([]);
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [showtimes, setShowtimes] = useState([]);

  useEffect(() => {
    const getMedia = async () => {
      const { response, err } = await mediaApi.getDetail({
        mediaType,
        mediaId,
      });
      if (response) {
        setMedia(response);
      }
      if (err) toast.error(err.message);
    };
    getMedia();
  }, [mediaType, mediaId]);

  const handleBackClick = () => {
    navigate(-1);
  };

  useEffect(() => {
    const fetchCinemas = async () => {
      console.log(mediaId);
      try {
        const { response, error } = await cinemaApi.getCinemasByMovieId({
          mediaId,
        });
        console.log("repsonse: ", response);
        if (response) {
          setCinemas(response);
        }
      } catch (error) {
        console.error("Error fetching cinemas:", error);
      }
    };
    fetchCinemas();
  }, [mediaId]);

  const handleCinemaChange = (event) => {
    const selectedCinemaId = event.target.value;
    const selectedCinema = cinemas.find(
      (cinema) => cinema._id === selectedCinemaId
    );
    setSelectedCinema(selectedCinema);
  };

  const handlePaymentClick = () => {
    // Handle payment process
  };

  return (
    <>
      <ImgHeader
        imgPath={
          media
            ? tmdbConfigs.backdropPath(media.backdrop_path || media.poster_path)
            : ""
        }
      />

      <Box sx={{ ...uiConfigs.style.mainContent }}>
        <Container header="booking" maxWidth="md">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h4" gutterBottom>
                Movie:{" "}
                {media &&
                  `${media.title || media.name} - ${
                    mediaType === tmdbConfigs.mediaType.movie
                      ? media.release_date.split("-")[0]
                      : media.first_air_date.split("-")[0]
                  }`}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Select Cinema:
              </Typography>
              <Select
                value={selectedCinema ? selectedCinema._id : ""}
                onChange={handleCinemaChange}
                fullWidth
              >
                {cinemas.map((cinema) => (
                  <MenuItem key={cinema._id} value={cinema._id}>
                    {cinema.name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Select Showtime:
              </Typography>
              <Select value={""} onChange={() => {}} fullWidth></Select>
            </Grid>
            <Grid item xs={12}></Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Total Price: $XXX
              </Typography>
            </Grid>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  sx={{ float: "right", width: "100px" }}
                  onClick={handleBackClick}
                >
                  Back
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handlePaymentClick}
                  sx={{ width: "100px" }}
                >
                  Pay Now
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Booking;
