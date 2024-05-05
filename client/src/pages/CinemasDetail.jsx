import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  Container,
  Card,
  CardContent,
  CardHeader,
} from "@mui/material";
import cinemaApi from "../api/modules/cinema.api.js";

const CinemaDetail = () => {
  const { type, loca } = useParams();
  const [cinema, setCinema] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getCinemaDetail = async () => {
      try {
        const { response, error } = await cinemaApi.getCinemaByTypeAndLocation(
          type,
          loca
        );

        if (response) {
          setCinema(response);
        } else {
          setError(error);
        }
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    getCinemaDetail();
  }, [type, loca]);

  if (loading) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  if (error) {
    return <Typography variant="h6">Error: {error.message}</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ marginTop: 10 }}>
      <Typography variant="h4" gutterBottom>
        Cinema Detail: {cinema.name}
      </Typography>
      <Card sx={{ height: "100%" }}>
        <CardHeader title={cinema.name} />
        <CardContent sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="body2" color="textSecondary" component="p">
            Address: {cinema.address}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default CinemaDetail;
