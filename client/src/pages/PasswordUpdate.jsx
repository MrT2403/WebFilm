import { LoadingButton } from "@mui/lab";
import { Box, Stack, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import Container from "../components/common/Container";
import uiConfigs from "../configs/ui.configs";
import { useState } from "react";
import userApi from "../api/modules/user.api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/features/userSlice";
import { setAuthModalOpen } from "../redux/features/authModalSlice";

const PasswordUpdate = () => {
  const [onRequest, setOnRequest] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const form = useFormik({
    initialValues: {
      password: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, "password minimum 8 characters")
        .required("password is required"),
      newPassword: Yup.string()
        .min(8, "newPassword minimum 8 characters")
        .required("newPassword is required"),
      confirmNewPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "confirmNewPassword not match")
        .min(8, "confirmNewPassword minimum 8 characters")
        .required("confirmNewPassword is required"),
    }),
    onSubmit: async (values) => onUpdate(values),
  });
  const onUpdate = async (values) => {
    if (onRequest) return setOnRequest(true);

    const { response, err } = await userApi.passwordUpdate(values);

    setOnRequest(false);

    if (err) toast.error(err.message);

    if (response) {
      form.resetForm();
      navigate("/");
      dispatch(setUser(null));
      dispatch(setAuthModalOpen(true));
      toast.success("Update password success! Please relogin");
    }
  };
  return (
    <Box sx={{ ...uiConfigs.style.mainContent }}>
      <Container header="update password">
        <Box component="form" maxWidth="400px" onSubmit={form.handleSubmit}>
          <Stack spacing={2}>
            <TextField
              type="password"
              label="Password"
              variant="outlined"
              name="password"
              value={form.values.password}
              onChange={form.handleChange}
              color="success"
              error={
                form.touched.password && form.errors.password !== undefined
              }
              helperText={form.touched.password && form.errors.password}
              fullWidth
              required
            />
            <TextField
              type="password"
              label="New Password"
              variant="outlined"
              name="newPassword"
              value={form.values.newPassword}
              onChange={form.handleChange}
              color="success"
              error={
                form.touched.newPassword &&
                form.errors.newPassword !== undefined
              }
              helperText={form.touched.newPassword && form.errors.newPassword}
              fullWidth
              required
            />
            <TextField
              type="password"
              label="Confirm New Password"
              variant="outlined"
              name="confirmNewPassword"
              value={form.values.confirmNewPassword}
              onChange={form.handleChange}
              color="success"
              error={
                form.touched.confirmNewPassword &&
                form.errors.confirmNewPassword !== undefined
              }
              helperText={
                form.touched.confirmNewPassword &&
                form.errors.confirmNewPassword
              }
              fullWidth
              required
            />
            <LoadingButton
              type="submit"
              variant="contained"
              fullWidth
              sx={{ marginTop: 4 }}
              loading={onRequest}
            >
              Update Password
            </LoadingButton>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default PasswordUpdate;
