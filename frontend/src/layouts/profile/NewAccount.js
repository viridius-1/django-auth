import * as React from "react";
import { useState, useEffect } from "react";
import axios from "utils/axios";
import MDButton from "components/MDButton";
import Grid from "@mui/material/Grid";
import MDInput from "components/MDInput";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";

function ProfileInfoCard() {
  const [business, setBusiness] = useState([]);
  const [rolelist, setRolelist] = useState([]);
  const [bsIndex, setBsIndex] = useState(0);
  const [roleIdx, setRoleIdx] = useState(0);
  const [couponCode, setCouponCode] = useState(null);
  const navigate = useNavigate();
  const userinfo = JSON.parse(sessionStorage.getItem("userData"));

  const getRoleList = () => {
    axios
      .get(`/roles/`)
      .then((res) => {
        setRolelist(res.data.data);
      })
      .catch((err) => console.log(err));
  };

  const getBusinessList = () => {
    axios
      .get(`/businesses/`)
      .then((res) => {
        setBusiness(res.data.data);
      })
      .catch((err) => console.log(err));
  };

  const getCouponCode = () => {
    axios
      .post(`/coupons/${userinfo.id}`, { count: 1 })
      .then((res) => {
        setCouponCode(res.data.data[0].code);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getBusinessList();
    getRoleList();
    getCouponCode();
  }, []);

  const handleBusinessChange = (e) => {
    setBsIndex(e.target.value);
  };

  const handleRoleChange = (e) => {
    setRoleIdx(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (data.get("fullName") === "" || data.get("email") === "" || data.get("password") === "") {
      notification.warning({
        message: "Input into fields correctly",
        placement: "bottomRight",
      });
    } else {
      /* eslint-disable */
      if (bsIndex === 0 && userinfo.role.id !== 3) {
        notification.warning({
          message: "Business isn't selected.",
          placement: "bottomRight",
        });
      } else {
        /* eslint-disable */
        if (roleIdx === 0 && userinfo.role.id !== 3) {
          notification.warning({
            message: "Role isn't selected.",
            placement: "bottomRight",
          });
        } else {
          const mailData =
            userinfo.role.id === 3
              ? {
                  sendTo_email: data.get("email"),
                  sendBy_email: userinfo.email,
                  sendBy_id: userinfo.id,
                  send_code: couponCode,
                  business: userinfo.business.id,
                  role: 4,
                }
              : {
                  business: bsIndex,
                  role: roleIdx,
                };
          const signInfo = {
            fullName: data.get("fullName"),
            email: data.get("email"),
            address: data.get("address"),
            birthday: data.get("birthday"),
            phone: data.get("phone"),
            password: data.get("password"),
            couponCount: 0,
            ...mailData,
          };
          axios
            .post(`/users/add/`, signInfo)
            .then(() => {
              let msg = "";
              if (userinfo.role.id === 3) {
                msg = "Successfully to send a Coupon Code to New account.";
              } else {
                msg = "Successfully to create a new account.";
              }
              notification.success({
                message: msg,
                placement: "bottomRight",
              });
              navigate("/tables");
            })
            .catch(() => {
              let msg = "";
              if (userinfo.role.id === 3) {
                msg = "Fail to send a Coupon Code to New account.";
              } else {
                msg = "Fail to create a new account.";
              }
              notification.error({
                message: msg,
                placement: "bottomRight",
              });
            });
        }
      }
    }
  };

  return (
    <MDBox mb={5}>
      <Card
        sx={{
          py: 2,
          px: 2,
          width: "50%",
          margin: "100px auto",
        }}
      >
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
          {userinfo.role.id === 3 ? (
            <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
              Send a Coupon Code to New Account:
              <MDTypography variant="h3" color="yellow" fontWeight="medium">
                {couponCode}
              </MDTypography>
            </MDTypography>
          ) : (
            <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
              Create a New Account
            </MDTypography>
          )}
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
            {userinfo.role.id !== 3 && (
              <MDBox>
                <MDBox mb={2}>
                  <FormControl fullWidth size="large">
                    <InputLabel id="demo-select-small">Business</InputLabel>
                    <Select
                      labelId="demo-select-small"
                      id="demo-select-small"
                      sx={{ height: "45px" }}
                      value={bsIndex}
                      label="Business"
                      onChange={handleBusinessChange}
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
                      value={roleIdx}
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
              </MDBox>
            )}
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                name="password"
                variant="standard"
                fullWidth
              />
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDBox width="50%" mx="auto">
                <MDButton variant="gradient" color="info" fullWidth type="submit">
                  {userinfo.role.id === 3 ? (
                    <MDTypography variant="caption" color="white" fontWeight="medium">
                      Send
                    </MDTypography>
                  ) : (
                    <MDTypography variant="caption" color="white" fontWeight="medium">
                      Create
                    </MDTypography>
                  )}
                </MDButton>
              </MDBox>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </MDBox>
  );
}

export default ProfileInfoCard;
