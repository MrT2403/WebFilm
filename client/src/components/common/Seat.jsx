import React, { useEffect, useRef } from "react";
import { Box, Button, Typography, Grid } from "@mui/material";

const Seat = ({ selectedSeats, handleSeatClick }) => {
  const totalSeats = 50;
  const rows = 5;
  const seatsPerRow = totalSeats / rows / 2;
  const seatsPerHalf = totalSeats / 2;
  const ws = useRef(null);
  const seatState = useRef({}); // Lưu trạng thái của từng ghế

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:5000");

    ws.current.onopen = () => {
      console.log("WebSocket connection established.");
    };

    ws.current.onmessage = (event) => {
      console.log("Received message:", event.data);
    };

    ws.current.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket connection error:", error);
    };

    return () => {
      ws.current.close();
    };
  }, []);

  const handleSeatSelect = (seatNumber) => {
    const isSeatSelected = seatState.current[seatNumber]; // Kiểm tra xem ghế đã được chọn chưa
    if (isSeatSelected) {
      // Nếu đã chọn, hủy chọn ghế
      handleSeatClick(seatNumber);
    } else {
      // Nếu chưa chọn, chọn ghế
      handleSeatClick(seatNumber);
    }
    seatState.current[seatNumber] = !isSeatSelected; // Cập nhật trạng thái của ghế
  };

  const renderSeats = (start, end) => {
    const seats = [];
    for (let seatNumber = start; seatNumber <= end; seatNumber++) {
      const isSeatSelected = seatState.current[seatNumber];
      seats.push(
        <Button
          key={seatNumber}
          variant={isSeatSelected ? "contained" : "outlined"}
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
            width: "300px",
            height: "5px",
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
              {[...Array(rows)].map((_, rowIndex) => (
                <Grid item xs={12} key={`row1-${rowIndex}`}>
                  <Grid container spacing={2}>
                    {[...Array(seatsPerRow)].map((_, seatIndex) => (
                      <Grid
                        item
                        xs={2}
                        key={`seat1-${rowIndex}-${seatIndex}`}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        {renderSeats(
                          rowIndex * seatsPerRow + seatIndex + 1,
                          rowIndex * seatsPerRow + seatIndex + 1
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
              {[...Array(rows)].map((_, rowIndex) => (
                <Grid item xs={12} key={`row2-${rowIndex}`}>
                  <Grid container spacing={2}>
                    {[...Array(seatsPerRow)].map((_, seatIndex) => (
                      <Grid
                        item
                        xs={2}
                        key={`seat2-${rowIndex}-${seatIndex}`}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        {renderSeats(
                          seatsPerHalf + rowIndex * seatsPerRow + seatIndex + 1,
                          seatsPerHalf + rowIndex * seatsPerRow + seatIndex + 1
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
