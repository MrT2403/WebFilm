import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Container,
  Card,
  CardContent,
  CardHeader,
} from "@mui/material";
import cinemaApi from "../api/modules/cinema.api.js";

const CinemaList = () => {
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getListCinema = async () => {
      try {
        const { response, error } = await cinemaApi.getAllCinemas();

        if (response) {
          setCinemas(response);
        } else {
          setError(error);
        }
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    getListCinema();
  }, []);

  if (loading) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  if (error) {
    return <Typography variant="h6">Error: {error.message}</Typography>;
  }

  const handleCinemaDetail = () => {
    console.log("hehehehe");
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: 10 }}>
      <Typography variant="h4" gutterBottom>
        Cinemas List
      </Typography>
      <Grid container spacing={3}>
        {cinemas.map((cinema) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            key={cinema.id}
            sx={{ height: "200px", cursor: "pointer" }}
            onClick={handleCinemaDetail}
          >
            <Card sx={{ height: "100%" }}>
              <CardHeader title={cinema.name} />
              <CardContent sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="p"
                  sx={{ margin: "auto", textAlign: "left" }}
                >
                  {cinema.address}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CinemaList;
