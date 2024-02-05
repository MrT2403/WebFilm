import { useEffect, useState } from "react";
import { SwiperSlide } from "swiper/react";
import mediaApi from "../../api/modules/media.api";
import AutoSwiper from "./AutoSwiper";
import { toast } from "react-toastify";
import Item from "./Item";

const ContentSlide = ({ mediaType, mediaCategory }) => {
  const [medias, setMedias] = useState([]);

  useEffect(() => {
    const getMedias = async () => {
      console.log(mediaCategory, "hihihiihih");
      if (mediaCategory === "trending") {
        const { response, err } = await mediaApi.getTrending({
          mediaType: "all",
          mediaCategory,
          timeWindow: "week",
        });
        console.log("response trend: ", response);
        if (response) setMedias(response.results);
        if (err) toast.error(err.message);
      } else {
        const { response, err } = await mediaApi.getList({
          mediaType,
          mediaCategory,
          page: 1,
        });
        if (response) setMedias(response.results);
        if (err) toast.error(err.message);
      }
    };

    getMedias();
  }, [mediaType, mediaCategory]);

  return (
    <AutoSwiper>
      <div
        style={{
          display: "flex",
          margin: "-10px",
        }}
      >
        {medias.map((media, index) => (
          <SwiperSlide key={index}>
            <div
              style={{
                marginRight: "20px",
              }}
            >
              <Item media={media} mediaType={mediaType} />
            </div>
          </SwiperSlide>
        ))}
      </div>
    </AutoSwiper>
  );
};

export default ContentSlide;
