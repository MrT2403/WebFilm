import React, { useEffect, useRef, useState } from "react";
import {
  Typography,
  Button,
  Grid,
  Box,
  Select,
  MenuItem,
  Modal,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import uiConfigs from "../configs/ui.configs";
import Container from "../components/common/Container";
import ImgHeader from "../components/common/ImgHeader";
import tmdbConfigs from "../api/configs/tmdb.config";
import mediaApi from "../api/modules/media.api";
import cinemaApi from "../api/modules/cinema.api";
import { toast } from "react-toastify";
import Seat from "../components/common/Seat";
import vnpayApi from "../api/modules/vnpay.api";
import { format, parseISO } from "date-fns";

const formatDate = (isoString) => {
  const date = parseISO(isoString);
  return format(date, "yyyy-MM-dd");
};

const Booking = () => {
  const navigate = useNavigate();
  const { mediaType, mediaId } = useParams();
  const [media, setMedia] = useState(null);
  const [cinemas, setCinemas] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedCinemaId, setSelectedCinemaId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const ws = useRef(null);
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
    const selectedCi = event.target.value;
    setSelectedCinemaId(selectedCi);
    const selectedCinema = cinemas.find((cinema) => cinema._id === selectedCi);
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
    setSelectedDate("");
    setSelectedShowtime(null);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    const selectedCinema = cinemas.find(
      (cinema) => cinema._id === selectedCinemaId
    );
    if (selectedCinema) {
      const selectedMovie = selectedCinema.movie_playing.find(
        (movie) => movie.movieId === mediaId
      );
      if (selectedMovie) {
        const selectedShowtimes = selectedMovie.showtime.filter(
          (showtime) => formatDate(showtime.date) === event.target.value
        );
        setShowtimes(selectedShowtimes);
      } else {
        setShowtimes([]);
      }
    } else {
      setShowtimes([]);
    }
    setSelectedShowtime(null);
  };

  const handlePaymentClick = () => {
    if (!selectedShowtime) {
      toast.error("Please select a showtime.");
      return;
    }
    setShowPaymentModal(true);
  };

  const handleShowtimeClick = (selectedTime) => {
    setSelectedShowtime(selectedTime);
  };

  const handleSeatClick = (seatNumber) => {
    setSelectedSeats((prevSelectedSeats) => {
      const isSeatSelected = prevSelectedSeats.includes(seatNumber);
      if (isSeatSelected) {
        return prevSelectedSeats.filter(
          (selectedSeat) => selectedSeat !== seatNumber
        );
      } else {
        return [...prevSelectedSeats, seatNumber];
      }
    });
  };

  useEffect(() => {
    const pricePerTicket = 100000;
    const totalPrice = selectedSeats.length * pricePerTicket;
    setTotalPrice(totalPrice);
  }, [selectedSeats]);

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    setTimeout(() => {
      selectedSeats.forEach((seatNumber) => {
        ws.current.send(JSON.stringify({ action: "blockSeat", seatNumber }));
      });
    }, 3000);
  };

  const handleConfirmPayment = async () => {
    setIsLoading(true);
    try {
      const { response, err } = await vnpayApi.accessPay({
        orderId: Math.floor(Math.random() * 1000),
        amount: totalPrice,
      });
      if (response) {
        window.location.href = response.data.paymentUrl;
      } else {
        console.error("Error Payment:", err);
      }
    } catch (error) {
      console.error(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Box>
        <ImgHeader
          imgPath={
            media
              ? tmdbConfigs.backdropPath(
                  media.backdrop_path || media.poster_path
                )
              : ""
          }
        />
        <Box sx={{ ...uiConfigs.style.mainContent, margin: "0 5rem 5rem" }}>
          <Container header="Booking" maxWidth="md" sx={{ padding: 0 }}>
            <Grid container spacing={2} sx={{ marginTop: "2rem" }}>
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
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Choose Cinema:
                </Typography>
                <Select
                  value={selectedCinemaId}
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
                  Choose Date:
                </Typography>
                <Select
                  value={selectedDate}
                  onChange={handleDateChange}
                  fullWidth
                >
                  {showtimes
                    .map((showtime) => showtime.date)
                    .filter(
                      (date, index, self) =>
                        self.findIndex(
                          (d) => formatDate(d) === formatDate(date)
                        ) === index
                    )
                    .map((date, index) => (
                      <MenuItem key={index} value={formatDate(date)}>
                        {formatDate(date)}
                      </MenuItem>
                    ))}
                </Select>
              </Grid>
              <Box sx={{ width: "100%", padding: "1rem" }}>
                {selectedDate ? (
                  showtimes.map((showtime, index) => (
                    <div
                      key={index}
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
              <Grid item xs={12}>
                <Seat
                  selectedSeats={selectedSeats}
                  handleSeatClick={handleSeatClick}
                  paymentSuccess={paymentSuccess}
                />
              </Grid>
              <Grid item xs={12} sx={{ marginTop: "2rem" }}>
                <Typography variant="h6" gutterBottom>
                  Total Price:{" "}
                  {totalPrice.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                    currencyDisplay: "code",
                  })}
                </Typography>
              </Grid>
              <Grid
                container
                spacing={2}
                justifyContent="center"
                marginTop="2rem"
              >
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
                    onClick={() => {
                      handlePaymentClick();
                      handlePaymentSuccess();
                    }}
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
      <Modal
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        aria-labelledby="payment-modal-title"
        aria-describedby="payment-modal-description"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography
            id="payment-modal-title"
            variant="h4"
            component="h1"
            gutterBottom
            color="primary"
          >
            Payment Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item>
              <Typography id="payment-modal-description">
                {Object.entries({
                  Movie: media?.title || media?.name,
                  Cinema: selectedCinemaId,
                  Date: selectedDate,
                  Time: selectedShowtime,
                  Seat: selectedSeats.join(", "),
                  Price: `${totalPrice.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                    currencyDisplay: "code",
                  })}`,
                }).map(([key, value]) => (
                  <div key={key}>
                    <Typography
                      variant="body2"
                      sx={{ fontSize: 18, fontFamily: "500" }}
                    >
                      {key}: {value}
                    </Typography>
                  </div>
                ))}
              </Typography>
            </Grid>
            <Grid container xs={12} sx={{ marginTop: "2rem" }}>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setShowPaymentModal(false)}
                >
                  Close
                </Button>
              </Grid>
              <Grid item xs={6} sx={{}}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleConfirmPayment}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Confirm"}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

export default Booking;
