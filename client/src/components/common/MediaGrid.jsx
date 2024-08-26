import { Grid } from "@mui/material";
import Item from "./Item";

const MediaGrid = ({ medias, mediaType }) => {
  if (medias && Array.isArray(medias) && medias.poster_path !== null) {
    return (
      <Grid container spacing={1}>
        {medias.map((media, index) => (
          <Grid item xs={6} sm={4} md={3} key={index}>
            <Item media={media} mediaType={mediaType} />
          </Grid>
        ))}
      </Grid>
    );
  } else {
    return;
  }
};

export default MediaGrid;
