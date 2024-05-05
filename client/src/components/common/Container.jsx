import { Box, Stack, Typography } from "@mui/material";
import React from "react";

const Container = ({ header, children }) => {
  return (
    <Box
      sx={{
        marginTop: "5rem",
        marginX: "auto",
        color: "text.primary",
      }}
    >
      <Stack spacing={4}>
        {header && (
          <Box
            sx={{
              position: "relative",
              maxWidth: "1300px",
              paddingX: "10px",
              marginX: "auto",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "cneter",
              "&::before": {
                content: '""',
                display: "inline-block",
                width: "5px",
                height: "3rem",
                mr: "1rem",
                backgroundColor: "primary.main",
              },
            }}
          >
            <Typography
              variant="h5"
              fontWeight="700"
              textTransform="uppercase"
              sx={{
                display: "inline-block",
              }}
            >
              {header}
            </Typography>
          </Box>
        )}
        {children}
      </Stack>
    </Box>
  );
};

export default Container;
