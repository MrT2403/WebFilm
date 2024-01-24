import { SwiperSlide } from "swiper/react";
import AutoSwiper from "./AutoSwiper";
import Item from "./Item";

const Recommend = ({ medias, mediaType }) => {
  return (
    <AutoSwiper>
      {medias.map((media, index) => (
        <SwiperSlide key={index}>
          <Item media={media} mediaType={mediaType} />
        </SwiperSlide>
      ))}
    </AutoSwiper>
  );
};

export default Recommend;
