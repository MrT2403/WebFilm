import React from "react";
import { Typography, Button, Grid, Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import Container from "../components/common/Container";
import uiConfigs from "../configs/ui.configs";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { name, cinema, date, time, seat, price } = location.state;
  const seatString = seat.join(", ");

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleConfirmClick = () => {};

  return (
    <Box sx={{ ...uiConfigs.style.mainContent, margin: "0 5rem 5rem" }}>
      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs={12}>
          <Container header="payment detail"></Container>
          <Typography variant="body1" gutterBottom sx={{ marginTop: "2rem" }}>
            Movie: {name}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Cinema: {cinema}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Date: {date}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Time: {time}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Seat: {seatString}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Price: {price}$
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={handleBackClick}>
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirmClick}
            sx={{ marginLeft: "1rem" }}
          >
            Confirm
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Payment;
