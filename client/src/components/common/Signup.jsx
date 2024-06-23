import { Stack, TextField, Typography, Alert, Box } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { setUser } from "../../redux/features/userSlice";
import { setAuthModalOpen } from "../../redux/features/authModalSlice";
import userApi from "../../api/modules/user.api";
import { useTheme } from "@emotion/react";

const Signup = ({ switchAuthState }) => {
  const dispatch = useDispatch();
  const [errMessage, setErrMessage] = useState();
  const [LoginRequest, setLoginRequest] = useState(false);
  const theme = useTheme();

  const signupForm = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, "User name minimum 3 characters")
        .required("Required!"),
      email: Yup.string().email("Invalid email address").required("Required!"),
      password: Yup.string()
        .min(8, "Password minimum 8 characters")
        .required("Required!"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Required!"),
    }),
    onSubmit: async (values) => {
      setErrMessage(undefined);
      setLoginRequest(true);
      const { response, err } = await userApi.signup(values);
      setLoginRequest(false);
      if (response) {
        signupForm.resetForm();
        dispatch(setUser(response));
        dispatch(setAuthModalOpen(false));
        toast.success("Register success");
      }

      if (err && err.message) {
        setErrMessage(err.message);
      }
    },
  });
  return (
    <Box component="form" onSubmit={signupForm.handleSubmit}>
      <Stack spacing={3} justifyContent="center" alignItems="center">
        <Typography variant="h5">Register</Typography>
        <TextField
          type="text"
          label="User name"
          variant="outlined"
          name="username"
          value={signupForm.values.username}
          onChange={signupForm.handleChange}
          color="success"
          error={
            signupForm.touched.username &&
            signupForm.errors.username !== undefined
          }
          helperText={signupForm.touched.username && signupForm.errors.username}
          fullWidth
          required
        />
        <TextField
          type="text"
          label="Email"
          name="email"
          variant="outlined"
          value={signupForm.values.email}
          onChange={signupForm.handleChange}
          color="success"
          error={
            signupForm.touched.email && signupForm.errors.email !== undefined
          }
          helperText={signupForm.touched.email && signupForm.errors.email}
          fullWidth
          required
        />
        <TextField
          type="password"
          label="Password"
          name="password"
          variant="outlined"
          value={signupForm.values.password}
          onChange={signupForm.handleChange}
          color="success"
          error={
            signupForm.touched.password &&
            signupForm.errors.password !== undefined
          }
          helperText={signupForm.touched.password && signupForm.errors.password}
          fullWidth
          required
        />
        <TextField
          type="password"
          label="Confirm password"
          name="confirmPassword"
          variant="outlined"
          value={signupForm.values.confirmPassword}
          onChange={signupForm.handleChange}
          color="success"
          error={
            signupForm.touched.confirmPassword &&
            signupForm.errors.confirmPassword !== undefined
          }
          helperText={
            signupForm.touched.confirmPassword &&
            signupForm.errors.confirmPassword
          }
          fullWidth
          required
        />

        <Stack sx={{ cursor: "pointer" }} onClick={() => switchAuthState()}>
          <Typography>
            You already have an account?
            <span style={{ color: theme.palette.primary.main }}>
              {" "}
              Log in here!
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

export default Signup;
