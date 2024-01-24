import React from "react";
import { Box, Modal } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Logo from "./Logo";
import { setAuthModalOpen } from "../../redux/features/authModalSlice";
import Signin from "./Signin";
import Signup from "./Signup";

const actionState = {
  signin: "signin",
  signup: "signup",
};

const Auth = () => {
  const { authModalOpen } = useSelector((state) => state.authModal);
  const dispatch = useDispatch();
  const [action, setAction] = useState(actionState.signin);

  useEffect(() => {
    if (authModalOpen) setAction(actionState.signin);
  }, [authModalOpen]);

  const handleClose = () => dispatch(setAuthModalOpen(false));

  const switchAuthState = (state) => setAction(state);

  return (
    <Modal open={authModalOpen} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          maxWidth: "600px",
          padding: 4,
          outline: "none",
        }}
      >
        <Box
          sx={{
            padding: 4,
            boxShadow: 24,
            backgroundColor: "background.paper",
          }}
        >
          <Box sx={{ textAlign: "center", marginBottom: "2rem" }}>
            <Logo></Logo>
          </Box>

          {action === actionState.signin && (
            <Signin
              switchAuthState={() => switchAuthState(actionState.signup)}
            ></Signin>
          )}
          {action === actionState.signup && (
            <Signup
              switchAuthState={() => switchAuthState(actionState.signin)}
            ></Signup>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default Auth;
