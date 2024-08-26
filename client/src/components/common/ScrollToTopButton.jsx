import React, { useState, useEffect } from "react";
import { Button, IconButton } from "@mui/material";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    const scrollTop = document.documentElement.scrollTop;
    setIsVisible(scrollTop > 0);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <Button>
          <IconButton
            onClick={scrollToTop}
            color="primary"
            sx={{
              height: "3rem",
              width: "3rem",
              position: "fixed",
              bottom: "2rem",
              right: "2rem",
            }}
          >
            <KeyboardArrowUpOutlinedIcon fontSize="large" />
          </IconButton>
        </Button>
      )}
    </>
  );
};

export default ScrollToTopButton;
