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
import Seat from "../components/common/Seat";

const Booking = () => {
  const navigate = useNavigate();
  const { mediaType, mediaId } = useParams();
  const [media, setMedia] = useState();
  const [cinemas, setCinemas] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedCinemaId, setSelectedCinemaId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0); // State để lưu trữ tổng giá tiền

  useEffect(() => {
    const getMedia = async () => {
      try {
        const { response, error } = await mediaApi.getDetail({
          mediaType,
          mediaId,
        });
        if (response) {
          setMedia(response);
        }
        if (error) {
          toast.error(error.message);
        }
      } catch (error) {
        console.error("Error fetching media:", error);
      }
    };
    getMedia();
  }, [mediaType, mediaId]);

  const handleBackClick = () => {
    navigate(-1);
  };

  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        const { response, error } = await cinemaApi.getAllCinemas();
        if (response) {
          const filteredCinemas = response.filter((cinema) =>
            cinema.movie_playing.some((movie) => movie.movieId === mediaId)
          );
          setCinemas(filteredCinemas);
        }
        if (error) {
          toast.error(error.message);
        }
      } catch (error) {
        console.error("Error fetching cinemas:", error);
      }
    };
    fetchCinemas();
  }, [mediaId]);

  const handleCinemaChange = (event) => {
    event.preventDefault();
    const selectedCi = event.target.value;
    setSelectedCinemaId(selectedCi);
    const selectedCinema = cinemas.find((cinema) => cinema.name === selectedCi);
    if (selectedCinema) {
      const selectedMovie = selectedCinema.movie_playing.find(
        (movie) => movie.movieId === mediaId
      );
      if (selectedMovie) {
        setShowtimes(selectedMovie.showtime || []);
      } else {
        setShowtimes([]);
      }
    } else {
      setShowtimes([]);
    }
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    const selectedCinema = cinemas.find(
      (cinema) => cinema.name === selectedCinemaId
    );
    if (selectedCinema && selectedCinema.movie_playing) {
      const selectedMovie = selectedCinema.movie_playing.find(
        (movie) => movie.movieId === mediaId
      );
      if (selectedMovie && selectedMovie.showtime) {
        const selectedShowtimes = selectedMovie.showtime.filter(
          (showtime) => showtime.date === event.target.value
        );
        setShowtimes(selectedShowtimes);
      } else {
        setShowtimes([]);
      }
    } else {
      setShowtimes([]);
    }
  };

  const handlePaymentClick = () => {
    if (!selectedShowtime) {
      toast.error("Please select a showtime.");
      return;
    }
    const paymentDetails = {
      mediaType: mediaType,
      name: media.title || media.name,
      cinema: selectedCinemaId,
      date: selectedDate,
      time: selectedShowtime,
      seat: selectedSeats,
      price: totalPrice,
    };
    navigate("/payment", { state: paymentDetails });
  };

  const handleShowtimeClick = (selectedTime) => {
    setSelectedShowtime(selectedTime);
  };

  const handleSeatClick = (seatNumber) => {
    setSelectedSeats((prevSelectedSeats) => {
      // Check if seatNumber is already selected
      const isSeatSelected = prevSelectedSeats.includes(seatNumber);
      // If selected, remove from selectedSeats
      if (isSeatSelected) {
        return prevSelectedSeats.filter(
          (selectedSeat) => selectedSeat !== seatNumber
        );
      } else {
        // If not selected, add to selectedSeats
        return [...prevSelectedSeats, seatNumber];
      }
    });
  };

  useEffect(() => {
    const pricePerTicket = 100;
    const totalPrice = selectedSeats.length * pricePerTicket;
    setTotalPrice(totalPrice);
  }, [selectedSeats]);

  return (
    <>
      <Box>
        {/* Header */}
        <ImgHeader
          imgPath={
            media
              ? tmdbConfigs.backdropPath(
                  media.backdrop_path || media.poster_path
                )
              : ""
          }
        />
        {/* Main content */}
        <Box sx={{ ...uiConfigs.style.mainContent, margin: "0 5rem 5rem" }}>
          <Container header="Booking" maxWidth="md" sx={{ padding: 0 }}>
            {/* Booking content */}
            <Grid container spacing={2} sx={{ marginTop: "2rem" }}>
              {/* Movie title */}
              <Grid item xs={12}>
                <Typography variant="h4" gutterBottom sx={{ padding: 0 }}>
                  Movie:{" "}
                  {media &&
                    `${media.title || media.name} - ${
                      mediaType === tmdbConfigs.mediaType.movie
                        ? media.release_date.split("-")[0]
                        : media.first_air_date.split("-")[0]
                    }`}
                </Typography>
              </Grid>
              {/* Select cinema */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Select Cinema:
                </Typography>
                <Select
                  value={selectedCinemaId || ""}
                  onChange={handleCinemaChange}
                  fullWidth
                >
                  {cinemas.map((cinema) => (
                    <MenuItem key={cinema._id} value={cinema.name}>
                      {cinema.name}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              {/* Select date */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Select Date:
                </Typography>
                <Select
                  value={selectedDate}
                  onChange={handleDateChange}
                  fullWidth
                  sx={{ display: "inline-block" }}
                >
                  {selectedCinemaId && showtimes.length > 0 ? (
                    showtimes.map((showtime, _id) => (
                      <MenuItem key={_id} value={showtime.date}>
                        {showtime.date}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No date available</MenuItem>
                  )}
                </Select>
              </Grid>
              {/* Showtimes */}
              <Box
                sx={{
                  display: "flex",
                  gap: "1rem",
                  overflowX: "auto",
                  padding: "1rem 0 0 1rem",
                  flexWrap: "wrap",
                }}
              >
                {selectedDate && showtimes.length > 0 ? (
                  showtimes.map((showtime, index) => (
                    <div
                      key={index}
                      variant="contained"
                      sx={{
                        margin: "0.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "auto",
                      }}
                    >
                      {showtime.times.map((time, timeIndex) => (
                        <Button
                          key={timeIndex}
                          onClick={() => handleShowtimeClick(time)}
                          sx={{
                            backgroundColor:
                              selectedShowtime === time ? "red" : "inherit",
                            color:
                              selectedShowtime === time ? "white" : "inherit",
                          }}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  ))
                ) : (
                  <Typography sx={{ paddingLeft: "1rem" }}>
                    No showtimes available
                  </Typography>
                )}
              </Box>
              {/* Seat selection */}
              <Grid item xs={12}>
                <Seat
                  selectedSeats={selectedSeats}
                  handleSeatClick={handleSeatClick}
                />
              </Grid>
              {/* Total price */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Total Price: ${totalPrice}
                </Typography>
              </Grid>
              {/* Back and Payment buttons */}
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
      </Box>
    </>
  );
};

export default Booking;
