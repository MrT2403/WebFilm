import { useEffect, useState } from "react";
import { SwiperSlide } from "swiper/react";
import mediaApi from "../../api/modules/media.api";
import AutoSwiper from "./AutoSwiper";
import { toast } from "react-toastify";
import Item from "./Item";
import PaginationDot from "./PaginationDot";

const ContentSlide = ({ mediaType, mediaCategory }) => {
  const [medias, setMedias] = useState([]);

  useEffect(() => {
    const getMedias = async () => {
      if (mediaType === "trending") {
        const { response, err } = await mediaApi.getTrending({
          mediaType,
          mediaCategory,
          timeWindow: "day",
        });
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
        <PaginationDot>
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
        </PaginationDot>
      </div>
    </AutoSwiper>
  );
};

export default ContentSlide;
