import React, { useEffect, useRef, useState } from "react";
import { Button, Typography, Box, Grid } from "@mui/material";
import io from "socket.io-client";
import seatApi from "../../api/modules/seat.api";
import axios from "axios";

const Seat = ({
  selectedSeats = [],
  handleSeatClick,
  paymentSuccess,
  blockedSeats = [],
  showtime,
  cinemaId,
  date,
}) => {
  const [selectedSeatsPaid, setSelectedSeatsPaid] = useState([]);
  const [totalSeats, setTotalSeats] = useState(50);
  const socket = useRef(null);
  const seatState = useRef({});

  useEffect(() => {
    const fetchSeatStatus = async () => {
      try {
        // const { response, error } = await seatApi.seatStatus();
        // console.log(response);
        const response = await axios.get(
          "http://localhost:5000/api/v1/seats/status",
          {
            params: { cinemaId, showtimeId: showtime, date },
          }
        );

        if (response.data) {
          const bookedSeats = response.data.seats
            .filter((seat) => seat.status === "booked")
            .map((seat) => seat.number);
          setSelectedSeatsPaid(bookedSeats);
        }
      } catch (error) {
        console.error("Error fetching seat status:", error);
      }
    };

    fetchSeatStatus();
  }, [cinemaId, showtime, date]);

  useEffect(() => {
    socket.current = io("http://localhost:5000");

    socket.current.on("connect", () => {
      console.log("Socket.IO connection established.");
    });

    socket.current.on("seatBlocked", ({ seatNumber }) => {
      console.log("Seat blocked:", seatNumber);
      handleSeatBlocked(seatNumber);
    });

    socket.current.on("disconnect", () => {
      console.log("Socket.IO connection closed.");
    });

    socket.current.on("error", (error) => {
      console.error("Socket.IO connection error:", error);
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    const rows = 5;
    const seatsPerRow = totalSeats / rows;
    const seatInfo = {};
    let seatIndex = 1;
    for (let rowIndex = 1; rowIndex <= rows; rowIndex++) {
      for (let seatNumber = 1; seatNumber <= seatsPerRow; seatNumber++) {
        seatInfo[seatIndex] = { row: rowIndex, seat: seatNumber };
        seatIndex++;
      }
    }
    seatState.current = seatInfo;
  }, [totalSeats]);

  useEffect(() => {
    if (paymentSuccess && selectedSeatsPaid.length === 0) {
      setSelectedSeatsPaid(selectedSeats);
    }
  }, [paymentSuccess, selectedSeats, selectedSeatsPaid]);

  const handleSeatSelect = (seatNumber) => {
    if (
      selectedSeatsPaid.includes(seatNumber) ||
      blockedSeats.includes(seatNumber)
    ) {
      return;
    }
    handleSeatClick(seatNumber);

    // Emit blockSeat event với các thông tin từ props
    socket.current.emit("blockSeat", {
      seatNumber,
      showtime,
      cinemaId,
      date,
    });
  };

  const handleSeatBlocked = (seatNumber) => {
    setSelectedSeatsPaid((prevSelectedSeats) => [
      ...prevSelectedSeats,
      seatNumber,
    ]);
  };

  const renderSeats = (start, end) => {
    const seats = [];
    for (let seatNumber = start; seatNumber <= end; seatNumber++) {
      const isSeatSelected = selectedSeats.includes(seatNumber);
      const isSeatPaid = selectedSeatsPaid.includes(seatNumber);
      const isSeatBlocked = blockedSeats.includes(seatNumber);
      const variant =
        isSeatPaid || isSeatBlocked
          ? "contained"
          : isSeatSelected
          ? "contained"
          : "outlined";
      seats.push(
        <Button
          key={seatNumber}
          variant={variant}
          disabled={isSeatPaid || isSeatBlocked}
          onClick={() => handleSeatSelect(seatNumber)}
          sx={{ margin: "0.5rem" }}
        >
          {seatNumber}
        </Button>
      );
    }
    return seats;
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Select Seat:
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          margin: "2rem 0",
        }}
      >
        <hr
          style={{
            width: "30%",
            height: "8px",
            borderRadius: "10px",
            backgroundColor: "#000",
          }}
        />
        <Typography variant="body1" gutterBottom>
          Screen
        </Typography>
      </Box>
      <Box
        sx={{
          marginTop: "2rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid
          container
          spacing={2}
          gap={5}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginLeft: "3.5rem",
          }}
        >
          <Grid item xs={12} sm={5}>
            <Grid container spacing={2}>
              {[...Array(5)].map((_, rowIndex) => (
                <Grid item xs={12} key={`row1-${rowIndex}`}>
                  <Grid container spacing={2}>
                    {[...Array(5)].map((_, seatIndex) => (
                      <Grid
                        item
                        xs={2}
                        key={`seat1-${rowIndex}-${seatIndex}`}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        {renderSeats(
                          rowIndex * 5 + seatIndex + 1,
                          rowIndex * 5 + seatIndex + 1
                        )}
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Box sx={{ width: "100%", maxWidth: "2rem", flexGrow: 1 }}></Box>

          <Grid
            item
            xs={12}
            sm={5}
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Grid container spacing={2}>
              {[...Array(5)].map((_, rowIndex) => (
                <Grid item xs={12} key={`row2-${rowIndex}`}>
                  <Grid container spacing={2}>
                    {[...Array(5)].map((_, seatIndex) => (
                      <Grid
                        item
                        xs={2}
                        key={`seat2-${rowIndex}-${seatIndex}`}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        {renderSeats(
                          25 + rowIndex * 5 + seatIndex + 1,
                          25 + rowIndex * 5 + seatIndex + 1
                        )}
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Seat;
