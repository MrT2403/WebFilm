import React from "react";
import { Box, useTheme } from "@mui/material";
import uiConfigs from "../../configs/ui.configs";

const ImgHeader = ({ imgPath, customStyles }) => {
  const theme = useTheme();

  const defaultStyles = {
    zIndex: "-1",
    position: "relative",
    paddingTop: { xs: "60%", sm: "40%", md: "35%" },
    backgroundPosition: "top",
    backgroundSize: "cover",
    backgroundImage: `url(${imgPath})`,
    backgroundAttachment: "fixed",
    "&::before": {
      content: '""',
      position: "absolute",
      left: 0,
      bottom: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      ...uiConfigs.style.gradientBgImage[theme.palette.mode],
    },
  };

  const styles = { ...defaultStyles, ...customStyles };

  return <Box sx={styles} />;
};

export default ImgHeader;
