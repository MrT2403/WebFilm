import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Stack,
  Toolbar,
  useScrollTrigger,
} from "@mui/material";
import { cloneElement, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import menuConfigs from "../../configs/menu.configs";
import { themeModes } from "../../configs/theme.configs";
import { setAuthModalOpen } from "../../redux/features/authModalSlice";
import { setThemeMode } from "../../redux/features/themeModeSlice";
import Logo from "./Logo";
import { useDispatch, useSelector } from "react-redux";
import UserMenu from "./UserMenu";
import SideBar from "./SideBar";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";

const ScrollAppBar = ({ children, window }) => {
  const { themeMode } = useSelector((state) => state.themeMode);
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 50,
    target: window ? window() : undefined,
  });

  return cloneElement(children, {
    sx: {
      color: trigger
        ? "text.primary"
        : themeMode === themeModes.dark
        ? "primary.contrastText"
        : "text.primary",
      backgroundColor: trigger
        ? "background.paper"
        : themeMode === themeModes.dark
        ? "transparent"
        : "background.paper",
    },
  });
};

const Header = () => {
  const { user } = useSelector((state) => state.user);
  const { themeMode } = useSelector((state) => state.themeMode);
  const location = useLocation();
  const dispatch = useDispatch();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const onSwitchTheme = () => {
    const theme =
      themeMode === themeModes.dark ? themeModes.light : themeModes.dark;
    dispatch(setThemeMode(theme));
  };

  const isActiveState = (state, path) => {
    if (state === "home" && path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.includes(state);
  };

  const toggleSideBar = () => setSidebarOpen(!sidebarOpen);

  const toggleNotification = () => setNotificationOpen(!notificationOpen);

  return (
    <>
      <SideBar open={sidebarOpen} toggleSideBar={toggleSideBar}></SideBar>
      <ScrollAppBar>
        <AppBar
          elevation={0}
          sx={{
            zIndex: 9999,
          }}
        >
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <IconButton
                color="inherit"
                sx={{ mr: 2, display: { md: "none" } }}
                onClick={toggleSideBar}
              >
                <MenuIcon />
              </IconButton>
              <Box
                sx={{
                  display: { xs: "none", md: "inline-block" },
                  marginRight: "30px",
                }}
              >
                <Logo />
              </Box>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              {menuConfigs.main.map((item, index) => (
                <Button
                  key={index}
                  sx={{
                    color:
                      isActiveState(item.state, item.path) ||
                      (item.state === "home" && location.pathname === "/")
                        ? "primary.contrastText"
                        : "inherit",
                    mr: 2,
                  }}
                  component={Link}
                  to={item.path}
                  variant={
                    isActiveState(item.state, item.path) ||
                    (item.state === "home" && location.pathname === "/")
                      ? "contained"
                      : "text"
                  }
                >
                  {item.display}
                </Button>
              ))}
            </Stack>

            <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
              <IconButton
                sx={{
                  color: "inherit",
                  ml: 2,
                  mr: 1,
                }}
                onClick={toggleNotification}
              >
                {/* {toggleNotification ? (
                  <Notification></Notification>
                ) : (
                  <NotificationsOutlinedIcon />
                )} */}
                <NotificationsOutlinedIcon />
              </IconButton>
              <IconButton
                sx={{
                  color: "inherit",
                  ml: 1,
                  mr: 3,
                }}
                onClick={onSwitchTheme}
              >
                {themeMode === themeModes.dark ? (
                  <DarkModeOutlinedIcon />
                ) : (
                  <WbSunnyOutlinedIcon />
                )}
              </IconButton>
              <Stack spacing={3} direction="row" alignItems="center">
                {!user ? (
                  <Button
                    variant="contained"
                    onClick={() => dispatch(setAuthModalOpen(true))}
                  >
                    sign in
                  </Button>
                ) : (
                  <UserMenu></UserMenu>
                )}
              </Stack>
            </Box>
          </Toolbar>
        </AppBar>
      </ScrollAppBar>
    </>
  );
};

export default Header;
