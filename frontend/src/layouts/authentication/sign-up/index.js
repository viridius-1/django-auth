import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { notification } from "antd";
import axios from "utils/axios";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import bgImage from "assets/images/bg-sign-up-cover.jpeg";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

function Cover() {
  const navigate = useNavigate();
  const [business, setBusiness] = useState([]);
  const [bsIndex, setBsIndex] = useState(0);
  const [roleIndex, setRoleIndex] = useState(0);
  const [rolelist, setRolelist] = useState(null);
  const [visible, setVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const getBusinessList = () => {
    axios
      .get(`/businesses/`)
      .then((res) => {
        setBusiness(res.data.data);
      })
      .catch((err) => console.log(err));
  };

  const getRoleList = () => {
    axios
      .get(`/roles/`)
      .then((res) => {
        // /* eslint-disable */
        // const list = res.data.data.forEach((item) => {
        //   if (item.id !== 1) {
        //     return item;
        //   }
        // });
        // console.log(list);
        setRolelist(res.data.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getBusinessList();
    getRoleList();
  }, []);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSelectChange = (e) => {
    setBsIndex(e.target.value);
  };

  const handleRoleChange = (e) => {
    setRoleIndex(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (data.get("fullName") === "" || data.get("email") === "") {
      notification.warning({
        message: "Input into fields correctly",
        placement: "bottomRight",
      });
    } else {
      /* eslint-disable */
      if (bsIndex === 0) {
        notification.warning({
          message: "Business isn't selected.",
          placement: "bottomRight",
        });
      } else {
        /* eslint-disable */
        if (roleIndex === 0) {
          notification.warning({
            message: "Role isn't selected.",
            placement: "bottomRight",
          });
        } else {
          /* eslint-disable */
          if (data.get("password") !== data.get("confirmPassword")) {
            notification.warning({
              message: "Password isn't matched.",
              placement: "bottomRight",
            });
          } else {
            const signInfo = {
              fullName: data.get("fullName"),
              email: data.get("email"),
              address: data.get("address"),
              birthday: data.get("birthday"),
              phone: data.get("phone"),
              password: data.get("password"),
              business: bsIndex,
              role: roleIndex,
              couponCount: 0,
            };
            axios
              .post(`/auth/signUp/`, signInfo)
              .then((res) => {
                notification.success({
                  message: "Welcome to join us",
                  placement: "bottomRight",
                });
                sessionStorage.setItem("userData", JSON.stringify(res.data));
                navigate("/tables");
                setVisible(false);
              })
              .catch((err) => {
                notification.error({ message: err.response.data, placement: "bottomRight" });
                setVisible(true);
              });
          }
        }
      }
    }
  };

  return (
    <CoverLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Join us today
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <MDInput type="text" label="Full Name" name="fullName" variant="standard" fullWidth />
            </MDBox>
            <MDBox mb={2}>
              <MDInput type="email" label="Email" name="email" variant="standard" fullWidth />
            </MDBox>
            <MDBox>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={6}>
                  <MDBox mb={2}>
                    <MDInput
                      type="date"
                      label="Birthday"
                      name="birthday"
                      variant="standard"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                  <MDBox mb={2}>
                    <MDInput
                      type="text"
                      label="Phone Number"
                      name="phone"
                      variant="standard"
                      fullWidth
                    />
                  </MDBox>
                </Grid>
              </Grid>
            </MDBox>
            <MDBox mb={2}>
              <MDInput type="text" label="Address" name="address" variant="standard" fullWidth />
            </MDBox>
            <MDBox mb={2}>
              <FormControl fullWidth size="large">
                <InputLabel id="demo-select-small">Business</InputLabel>
                <Select
                  labelId="demo-select-small"
                  id="demo-select-small"
                  sx={{ height: "45px" }}
                  value={bsIndex}
                  label="Business"
                  onChange={handleSelectChange}
                >
                  <MenuItem value={0}>
                    <em>None</em>
                  </MenuItem>
                  {business &&
                    business.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.businessType}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </MDBox>
            <MDBox mb={2}>
              <FormControl fullWidth size="large">
                <InputLabel id="demo-select-small">Role</InputLabel>
                <Select
                  labelId="demo-select-small"
                  id="demo-select-small"
                  sx={{ height: "45px" }}
                  value={roleIndex}
                  label="Role"
                  onChange={handleRoleChange}
                >
                  <MenuItem value={0}>
                    <em>None</em>
                  </MenuItem>
                  {rolelist &&
                    rolelist.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.roleType}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </MDBox>
            <MDBox mb={2}>
              <FormControl sx={{ m: 1, width: "45%" }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>
              <FormControl sx={{ m: 1, width: "45%" }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">Confirm Password</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Confirm Password"
                />
              </FormControl>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth type="submit">
                <MDTypography variant="caption" color="white" fontWeight="medium">
                  Sign Up
                </MDTypography>
              </MDButton>
            </MDBox>
            {visible === true && (
              <MDTypography variant="caption" fontWeight="medium" style={{ color: "red" }}>
                Failed Sign Up by bad request.
              </MDTypography>
            )}
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Already have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-in"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign In
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default Cover;
