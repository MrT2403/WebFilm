import { Box } from "@mui/material";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper } from "swiper/react";

const PaginationDot = ({ children }) => {
  return (
    <Box
      sx={{
        "& .swiper-slide": {
          width: "100%",
          opacity: "0.6",
          paddingBottom: "3rem",
        },
        "& .swiper-slide-active": { opacity: 1 },
        "& .swiper-button-next, & .swiper-button-prev": {
          color: "text.primary",
          "&::after": {
            fontSize: { xs: "1rem", md: "2rem" },
          },
        },
        "& .swiper-pagination-bullet": {
          backgroundColor: "text.primary",
        },
        "& .swiper": {
          paddingX: { xs: "1rem", md: "4rem" },
        },
      }}
    >
      <Swiper
        spaceBetween={30}
        grabCursor={true}
        pagination={{ clickable: true }}
        navigation={true}
        modules={[Navigation, Pagination]}
        style={{ width: "100%", height: "max-content" }}
        loop={true}
      >
        {children}
      </Swiper>
    </Box>
  );
};

export default PaginationDot;
