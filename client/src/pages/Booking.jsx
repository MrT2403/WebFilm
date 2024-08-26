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
import io from "socket.io-client";
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
import ProtectedPage from "../components/common/ProtectedPage";

const formatDate = (isoString) => {
  if (!isoString) return "";
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
  const socket = useRef(null);
  const [blockedSeats, setBlockedSeats] = useState([]);
  const [seatSelectionEnabled, setSeatSelectionEnabled] = useState(false);

  useEffect(() => {
    const getMedia = async () => {
      try {
        const { response, error } = await mediaApi.getDetail({
          mediaType,
          mediaId,
        });
        if (response) setMedia(response);
        if (error) toast.error(error.message);
      } catch (error) {
        console.error("Error fetching media:", error);
        toast.error("Failed to fetch media details.");
      }
    };
    getMedia();
  }, [mediaType, mediaId]);

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
        if (error) toast.error(error.message);
      } catch (error) {
        console.error("Error fetching cinemas:", error);
        toast.error("Failed to fetch cinemas.");
      }
    };
    fetchCinemas();
  }, [mediaId]);

  useEffect(() => {
    socket.current = io("http://localhost:5000");

    socket.current.on("connect", () =>
      console.log("Socket.io connection opened")
    );
    socket.current.on("disconnect", () =>
      console.log("Socket.io connection closed")
    );

    socket.current.on("seatBlocked", ({ seatNumber }) => {
      setBlockedSeats((prevBlockedSeats) => [...prevBlockedSeats, seatNumber]);
    });

    return () => socket.current?.disconnect();
  }, []);

  const handleCinemaChange = (event) => {
    console.log("event: ", event);
    const selectedCi = event.target.value;
    console.log(selectedCi);
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
    setSelectedSeats([]);
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
    setSelectedSeats([]);
  };

  const handleShowtimeClick = (showtime, time) => {
    setSelectedShowtime({ ...showtime, time });
    setSelectedSeats([]);
    setTotalPrice(0);
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
    setTotalPrice(selectedSeats.length * pricePerTicket);
  }, [selectedSeats]);

  const handlePaymentClick = () => {
    if (!selectedShowtime) {
      toast.error("Please select a showtime.");
      return;
    }
    setShowPaymentModal(true);
  };

  const handleModalClose = () => {
    setShowPaymentModal(false);
  };

  const handlePaymentSuccess = () => {
    if (socket.current) {
      selectedSeats.forEach((seatNumber) => {
        console.log("Emitting blockSeat event for seat:", seatNumber);
        socket.current.emit("blockSeat", {
          seatNumber,
          showtime: selectedShowtime?.time,
          cinemaId: selectedCinemaId,
          date: formatDate(selectedShowtime?.date),
        });
      });
    }
    setSeatSelectionEnabled(true);
    setPaymentSuccess(true);
    setBlockedSeats((prevBlockedSeats) => [
      ...prevBlockedSeats,
      ...selectedSeats,
    ]);
    setSelectedSeats([]);
    setTotalPrice(0);
    setSelectedShowtime(null);
    setShowPaymentModal(false);

    console.log(paymentSuccess);
  };

  useEffect(() => {
    socket.current = io("http://localhost:5000");

    socket.current.on("connect", () =>
      console.log("Socket.io connection opened")
    );
    socket.current.on("disconnect", () =>
      console.log("Socket.io connection closed")
    );

    socket.current.on("seatBlocked", ({ seatNumber }) => {
      console.log("Received seatBlocked event for seat:", seatNumber);
      setBlockedSeats((prevBlockedSeats) => [...prevBlockedSeats, seatNumber]);
    });

    return () => socket.current?.disconnect();
  }, []);

  const handleConfirmPayment = async () => {
    setIsLoading(true);
    try {
      const { response, err } = await vnpayApi.accessPay({
        orderId: Math.floor(Math.random() * 1000),
        amount: totalPrice,
      });
      if (response) {
        window.location.href = response.data.paymentUrl;
        handlePaymentSuccess();
      } else {
        console.error("Error Payment:", err);
      }
    } catch (error) {
      console.error(error.message);
      toast.error("Payment processing failed.");
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
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Choose Showtime:
                </Typography>
                <Typography>
                  {selectedDate && showtimes.length > 0 ? (
                    showtimes.map((showtime, index) => (
                      <div
                        key={index}
                        style={{
                          margin: "0.5rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "50px",
                        }}
                      >
                        {showtime.times.map((time, timeIndex) => (
                          <Button
                            key={timeIndex}
                            onClick={() => handleShowtimeClick(showtime, time)}
                            sx={{
                              backgroundColor:
                                selectedShowtime?.time === time
                                  ? "red"
                                  : "inherit",
                              color:
                                selectedShowtime?.time === time
                                  ? "white"
                                  : "inherit",
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
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Seat
                  selectedSeats={selectedSeats}
                  handleSeatClick={handleSeatClick}
                  blockedSeats={blockedSeats}
                  paymentSuccess={paymentSuccess}
                  showtime={selectedShowtime?.time}
                  cinemaId={selectedCinemaId}
                  date={formatDate(selectedShowtime?.date)}
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
                    onClick={() => navigate(-1)}
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
      <ProtectedPage>
        <Modal
          open={showPaymentModal}
          onClose={handleModalClose}
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
                    Cinema:
                      cinemas.find((cinema) => cinema._id === selectedCinemaId)
                        ?.name || "",
                    Date: selectedDate,
                    Time: selectedShowtime?.time,
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
                    onClick={handleModalClose}
                  >
                    Close
                  </Button>
                </Grid>
                <Grid item xs={6}>
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
      </ProtectedPage>
    </>
  );
};

export default Booking;
