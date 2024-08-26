import { Box } from "@mui/material";
import { SwiperSlide } from "swiper/react";
import tmdbConfigs from "../../api/configs/tmdb.config";
import PaginationDot from "./PaginationDot";

const BackdropSlide = ({ backdrops }) => {
  return (
    <PaginationDot>
      {[...backdrops].splice(0, 10).map((item, index) => (
        <SwiperSlide key={index}>
          <Box
            sx={{
              paddingTop: "60%",
              backgroundPosition: "top",
              backgroundSize: "cover",
              backgroundImage: `url(${tmdbConfigs.backdropPath(
                item.file_path
              )})`,
            }}
          />
        </SwiperSlide>
      ))}
    </PaginationDot>
  );
};

export default BackdropSlide;
