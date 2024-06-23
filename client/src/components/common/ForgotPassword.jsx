import React, { useState } from "react";
import { Stack, TextField, Typography, Alert, Box } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import userApi from "../../api/modules/user.api";
import { useTheme } from "@emotion/react";

const ForgotPassword = ({ switchAuthState }) => {
  const [loading, setLoading] = useState(false);
  const [errMessage, setErrMessage] = useState();
  const theme = useTheme();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required!"),
    }),
    onSubmit: async (values) => {
      setErrMessage(undefined);
      setLoading(true);
      const { response, err } = await userApi.forgotPassword(values);
      setLoading(false);
      if (response) {
        toast.success("Password reset link sent to your email");
        formik.resetForm();
      }

      if (err) setErrMessage(err.message);
    },
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit}>
      <Stack spacing={3} justifyContent="center" alignItems="center">
        <Typography variant="h5">Forgot Password</Typography>
        <TextField
          label="Email"
          placeholder="email"
          variant="outlined"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          color="success"
          error={formik.touched.email && formik.errors.email !== undefined}
          helperText={formik.touched.email && formik.errors.email}
          fullWidth
          required
        />

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
          loading={loading}
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

        <Stack
          sx={{ cursor: "pointer" }}
          onClick={() => switchAuthState("signin")}
        >
          <Typography>
            Remember your password?
            <span style={{ color: theme.palette.primary.main }}>
              {" "}
              Sign in here!
            </span>
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ForgotPassword;
