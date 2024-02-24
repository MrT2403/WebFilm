import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { routesGen } from "../../routes/routes";
import favoriteUtils from "../../utils/favorite.utils";
import Rate from "./Rate";
import uiConfigs from "../../configs/ui.configs";
import tmdbConfigs from "../../api/configs/tmdb.config";

const Item = ({ media, mediaType, items }) => {
  const { listFavorites } = useSelector((state) => state.user);

  const [title, setTitle] = useState("");
  const [posterPath, setPosterPath] = useState("");
  const [releaseDate, setReleaseDate] = useState(null);
  const [rate, setRate] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  useEffect(() => {
    setTitle(media.title || media.name || media.mediaTitle);

    setPosterPath(
      tmdbConfigs.posterPath(
        media.poster_path ||
          media.backdrop_path ||
          media.mediaPoster ||
          media.profile_path
      )
    );

    if (mediaType === tmdbConfigs.mediaType.movie) {
      setReleaseDate(media.release_date && media.release_date.split("-")[0]);
    } else {
      setReleaseDate(
        media.first_air_date && media.first_air_date.split("-")[0]
      );
    }

    setRate(media.vote_average / 2 || media.mediaRate / 2);
  }, [media, mediaType]);

  const isFavorite = favoriteUtils.check({ listFavorites, mediaId: media.id });

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <Box sx={{ padding: "0 8px" }}>
      <Link
        to={
          mediaType !== "people"
            ? routesGen.mediaDetail(mediaType, media.mediaId || media.id)
            : routesGen.person(media.id)
        }
      >
        <Box
          sx={{
            position: "relative",
            display: "inline-block",
            width: "100%",
            paddingTop: "160%",
            overflow: "hidden",
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {posterPath && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                gap: "10px",
                backgroundImage: `url(${posterPath})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transition: "transform 0.3s ease",
                transform: isHovered ? "scale(1.05)" : "scale(1)",
              }}
            />
          )}

          {isFavorite && (
            <FavoriteIcon
              color="primary"
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
                fontSize: "2rem",
              }}
            />
          )}

          {mediaType !== "people" && isHovered && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button
                className="media-play-btn"
                to={routesGen.mediaDetail(mediaType, media.mediaId || media.id)}
                variant="contained"
                startIcon=<PlayArrowIcon />
                sx={{
                  display: { xs: "none", md: "flex" },
                  transition: "all 0.3s ease",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  "& .MuiButton-startIcon": { marginRight: "-4px" },
                }}
              />
            </div>
          )}

          {rate && releaseDate && (
            <Box
              className="media-info"
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                padding: "1rem",
                backgroundImage: isHovered
                  ? "linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))"
                  : "transparent",
                opacity: isHovered ? 1 : 0,
                transition: "opacity 0.3s ease",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "0.5rem",
                  zIndex: "10",
                }}
              >
                <Rate value={rate} />
              </Box>

              <Typography
                variant="body2"
                sx={{
                  fontWeight: "bold",
                  color: "white",
                  marginBottom: "0.5rem",
                }}
              >
                {releaseDate}
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  fontWeight: "bold",
                  color: "white",
                  ...uiConfigs.style.typoLines(2, "center"),
                }}
              >
                {title}
              </Typography>
            </Box>
          )}
        </Box>
      </Link>
    </Box>
  );
};

export default Item;
