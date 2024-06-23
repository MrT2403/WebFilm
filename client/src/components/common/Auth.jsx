import React, { useEffect, useState } from "react";
import { Box, Modal } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Logo from "./Logo";
import { setAuthModalOpen } from "../../redux/features/authModalSlice";
import Signin from "./Signin";
import Signup from "./Signup";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";

const actionState = {
  signin: "signin",
  signup: "signup",
  forgotPassword: "forgotPassword",
  resetPassword: "resetPassword",
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
            <Logo />
          </Box>

          {action === actionState.signin && (
            <Signin switchAuthState={(state) => switchAuthState(state)} />
          )}
          {action === actionState.signup && (
            <Signup switchAuthState={(state) => switchAuthState(state)} />
          )}
          {action === actionState.forgotPassword && (
            <ForgotPassword
              switchAuthState={(state) => switchAuthState(state)}
            />
          )}
          {action === actionState.resetPassword && (
            <ResetPassword
              switchAuthState={(state) => switchAuthState(state)}
            />
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default Auth;
