import React, { useState } from "react";
import { Stack, TextField, Alert, Box } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import userApi from "../../api/modules/user.api";
import { useParams } from "react-router-dom";
import Container from "./Container.jsx";

const ResetPassword = ({ switchAuthState }) => {
  const [loading, setLoading] = useState(false);
  const [errMessage, setErrMessage] = useState();
  const { token } = useParams();

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Required!"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Required!"),
    }),
    onSubmit: async (values) => {
      setErrMessage(undefined);
      setLoading(true);
      const { response, err } = await userApi.resetPassword({
        ...values,
        token,
      });
      setLoading(false);
      if (response) {
        toast.success("Password reset successful");
        formik.resetForm();
        switchAuthState("signin");
      }
      if (err) setErrMessage(err.message);
    },
  });

  return (
    <Box sx={{ padding: 5 }}>
      <Container header="reset password" />
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 2,
        }}
      >
        <Stack
          spacing={3}
          maxWidth="400px"
          width="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <TextField
            label="New Password"
            type="password"
            variant="outlined"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            color="success"
            error={formik.touched.password && !!formik.errors.password}
            helperText={formik.touched.password && formik.errors.password}
            fullWidth
            required
          />
          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            name="confirmPassword"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            color="success"
            error={
              formik.touched.confirmPassword && !!formik.errors.confirmPassword
            }
            helperText={
              formik.touched.confirmPassword && formik.errors.confirmPassword
            }
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
        </Stack>
      </Box>
    </Box>
  );
};

export default ResetPassword;
