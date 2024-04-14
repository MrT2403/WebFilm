import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios from "axios";

const EmailForm = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/email/subscribe", { email });
      console.log("Server response:", response.data);
      setEmail("");
    } catch (error) {
      console.error("Error submitting email:", error);
    }
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <div
      style={{
        maxWidth: "1122px",
        margin: "3rem auto",
        textAlign: "center",
      }}
    >
      <Typography variant="h4" sx={{ marginBottom: "1rem" }}>
        Leave your email here for notifications
      </Typography>
      <Box display="flex" justifyContent="center">
        <form onSubmit={handleSubmit}>
          <Stack direction="row" spacing={2}>
            <TextField
              type="email"
              label="Enter your email"
              variant="outlined"
              value={email}
              onChange={handleChange}
              required
              sx={{ flexGrow: 1, width: "350px" }}
            />
            <Button type="submit" variant="contained" color="primary">
              Subscribe
            </Button>
          </Stack>
        </form>
      </Box>
    </div>
  );
};

export default EmailForm;
