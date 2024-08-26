import React from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { toast } from "react-toastify";
import userApi from "../../api/modules/user.api";
import favoriteApi from "../../api/modules/favorite.api";
import Loading from "../common/Loading";
import Footer from "../common/Footer";
import Header from "../common/Header";
import Auth from "../common/Auth";
import { setFavorite, setUser } from "../../redux/features/userSlice";

const MainLayout = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    const authUser = async () => {
      const { response, err } = await userApi.getInfo();
      if (response) dispatch(setUser(response));
      if (err) dispatch(setUser(null));
    };
    authUser();
  }, [dispatch]);

  useEffect(() => {
    const getFavorites = async () => {
      const { response, err } = await favoriteApi.getList();

      if (response) dispatch(setFavorite(response));
      if (err) toast.error(err.message);
    };

    if (user) getFavorites();
    if (!user) dispatch(setFavorite([]));
  }, [user, dispatch]);

  return (
    <>
      <Loading />
      <Auth />
      <Box component="main" flexGrow={1} overflow="hidden" minHeight="100vh">
        <Header />
        <Box component="main" flexGrow={1} overflow="hidden" minHeight="100vh">
          <Outlet />
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default MainLayout;
