import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import React from "react";
import Logo from "./Logo";
import menuConfigs from "../../configs/menu.configs";
import Container from "./Container";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <Container>
      <Paper square={true} sx={{ backgroundImage: "unset", padding: "2rem" }}>
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          sx={{ height: "max-content", textAlign: "center" }}
        >
          <Grid item xs={12} sm={6} md={4} sx={{ alignItems: "center" }}>
            <Stack direction="column" spacing={1}>
              <Logo big />
              <Typography fontSize="0.9rem">
                Khu phố 6, phường Linh Trung, thành phố Thủ Đức, Thành phố Hồ
                Chí Minh
              </Typography>
            </Stack>
          </Grid>

          <Grid
            item
            xs={12}
            sm={6}
            md={2}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Stack direction="column" spacing={1}>
              {menuConfigs.main.map((item, index) => (
                <Button
                  key={index}
                  sx={{ color: "inherit" }}
                  component={Link}
                  to={item.path}
                >
                  {item.display}
                </Button>
              ))}
            </Stack>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Box>
              <h3>About Us</h3>
              <ul
                style={{
                  opacity: 0.7,
                  listStyle: "none",
                  paddingInlineStart: 0,
                }}
              >
                <li>Company Info</li>
                <li>News</li>
                <li>Investors</li>
                <li>Policies</li>
              </ul>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Box
              sx={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <h3>Contact Us</h3>
              <ul
                style={{
                  opacity: 0.7,
                  listStyle: "none",
                  paddingInlineStart: 0,
                }}
              >
                <li>Contact Info</li>
                <li>Customer Support</li>
                <li>FAQs</li>
              </ul>
            </Box>
          </Grid>
        </Grid>
        <Box
          mt={3}
          sx={{ textAlign: "center", marginTop: "3rem", opacity: 0.7 }}
        >
          &copy; 2024 NotTris, Inc. All Rights Reserved T&Cs, Privacy Policy.
        </Box>
      </Paper>
    </Container>
  );
};

export default Footer;
