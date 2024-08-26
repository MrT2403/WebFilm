import React from "react";
import { useLocation } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import uiConfigs from "../../configs/ui.configs.js";
import Container from "../common/Container.jsx";

const PaymentResult = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const vnp_ResponseCode = query.get("vnp_ResponseCode");
  const vnp_TransactionStatus = query.get("vnp_TransactionStatus");

  const isSuccess = vnp_ResponseCode === "00" && vnp_TransactionStatus === "00";

  return (
    <Box>
      <Box sx={{ ...uiConfigs.style.mainContent, margin: "0 5rem 5rem" }}>
        <Container header="Payment Result" maxWidth="md" sx={{ padding: 0 }}>
          <Typography variant="h4" gutterBottom>
            {isSuccess ? "Payment Successful" : "Payment Failed"}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {isSuccess
              ? "Your payment has been processed successfully."
              : "There was an issue processing your payment. Please try again."}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => (window.location.href = "/movie")}
          >
            Go to Movies
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default PaymentResult;
