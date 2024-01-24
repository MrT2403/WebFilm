import { Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const InfoFilm = ({ valueRate, title, season, desc }) => {
  const dispatch = useDispatch();
  const [haveData, isHaveData] = useState(false);
  const { favorite } = useSelector((state) => state.favorite);

  return (
    <>
      {haveData && (
        <Stack spacing={2} justifyContent="left" alignItems="left">
          <Typography>{season}</Typography>
          <Typography>{title}</Typography>
        </Stack>
      )}
    </>
  );
};

export default InfoFilm;
