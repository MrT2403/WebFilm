import { useTheme } from "@emotion/react";
import { Typography } from "@mui/material";
import React from "react";

const Logo = ({ big }) => {
  const theme = useTheme();

  const handleLinkClick = () => {
    window.location.href = "/";
  };

  return (
    <Typography
      fontWeight="700"
      fontSize={big ? "3rem" : "2rem"}
      onClick={handleLinkClick}
      sx={{ cursor: "pointer", textDecoration: "none" }}
    >
      Not
      <span style={{ color: theme.palette.primary.main }}>Tris</span>
    </Typography>
  );
};

export default Logo;
