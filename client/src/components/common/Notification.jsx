import React, { useState } from "react";
import { Menu } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import NotificationsOutlinedICon from "@mui/icons-material/NotificationsOutlined";

const Notification = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [anchorEL, setAnchorEL] = useState(null);
  const toggleNotification = (e) => {
    setAnchorEL(e.currentTarget);
  };
  return (
    <>
      {user && (
        <Menu
          open={Boolean(anchorEL)}
          anchorEl={anchorEL}
          onClose={() => setAnchorEL(null)}
        ></Menu>
      )}
    </>
  );
};

export default Notification;
