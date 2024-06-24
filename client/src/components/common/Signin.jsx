import React, { useState } from "react";
import {
  Stack,
  TextField,
  Typography,
  Alert,
  Box,
  IconButton,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/features/userSlice";
import { setAuthModalOpen } from "../../redux/features/authModalSlice";
import userApi from "../../api/modules/user.api";
import { useTheme } from "@emotion/react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Signin = ({ switchAuthState }) => {
  const dispatch = useDispatch();
  const [LoginRequest, setLoginRequest] = useState(false);
  const [errMessage, setErrMessage] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const signinForm = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().min(3, "User name").required("Required!"),
      password: Yup.string().min(8, "Password").required("Required!"),
    }),
    onSubmit: async (values) => {
      setErrMessage(undefined);
      setLoginRequest(true);
      const { response, err } = await userApi.signin(values);
      setLoginRequest(false);
      if (response) {
        signinForm.resetForm();
        dispatch(setUser(response));
        dispatch(setAuthModalOpen(false));
        toast.success("Sign in success");
      }

      if (err) setErrMessage(err.message);
    },
  });

  return (
    <Box component="form" onSubmit={signinForm.handleSubmit}>
      <Stack spacing={3} justifyContent="center" alignItems="center">
        <Typography variant="h5">Sign In</Typography>
        <TextField
          label="User name"
          placeholder="username"
          variant="outlined"
          name="username"
          value={signinForm.values.username}
          onChange={signinForm.handleChange}
          color="success"
          error={
            signinForm.touched.username &&
            signinForm.errors.username !== undefined
          }
          helperText={signinForm.touched.username && signinForm.errors.username}
          fullWidth
          required
        />
        <TextField
          type={showPassword ? "text" : "password"}
          label="Password"
          variant="outlined"
          name="password"
          value={signinForm.values.password}
          onChange={signinForm.handleChange}
          color="success"
          error={
            signinForm.touched.password &&
            signinForm.errors.password !== undefined
          }
          helperText={signinForm.touched.password && signinForm.errors.password}
          fullWidth
          required
          InputProps={{
            endAdornment: (
              <IconButton onClick={togglePasswordVisibility} size="small">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            ),
          }}
        />

        <Stack
          sx={{ cursor: "pointer" }}
          onClick={() => switchAuthState("signup")}
        >
          <Typography>
            You don't have an account?
            <span style={{ color: theme.palette.primary.main }}>
              {" "}
              Register here!
            </span>
          </Typography>
        </Stack>

        <Stack
          sx={{ cursor: "pointer" }}
          onClick={() => switchAuthState("forgotPassword")}
        >
          <Typography>
            Forgot your password?
            <span style={{ color: theme.palette.primary.main }}>
              {" "}
              Reset here!
            </span>
          </Typography>
        </Stack>

        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          sx={{
            color: "white",
            backgroundColor: "primary.main",
            ":hover": {
              opacity: "0.8",
            },
          }}
          loading={LoginRequest}
        >
          Submit
        </LoadingButton>

        {errMessage && (
          <Box sx={{ marginTop: 2 }}>
            <Alert severity="error" variant="outlined">
              {errMessage}
            </Alert>
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default Signin;
