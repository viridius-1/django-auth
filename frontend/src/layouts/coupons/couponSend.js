import axios from "utils/axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import Button from "@mui/material/Button";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import burceMars from "assets/images/bruce-mars.jpg";
import backgroundImage from "assets/images/bg-profile.jpeg";
import SendIcon from "@mui/icons-material/Send";
import Card from "@mui/material/Card";
import { notification } from "antd";

function Overview() {
  const { id } = useParams();
  const signData = JSON.parse(sessionStorage.getItem("userData"));
  const [userInfo, setUserInfo] = useState(null);
  const [couponCode, setCouponCode] = useState(null);
  const navigate = useNavigate();

  const getDetailinfo = () => {
    axios
      .get(`/users/${id}`)
      .then((res) => {
        setUserInfo(res.data);
      })
      .catch((err) => console.log(err));
  };

  const getCouponCode = () => {
    axios
      .post(`/coupons/${signData.id}`, { count: 1 })
      .then((res) => {
        setCouponCode(res.data.data[0].code);
      })
      .catch((err) => console.log(err));
  };

  const handleBack = () => {
    navigate("/tables");
  };

  const handleSend = () => {
    const sendInfo = {
      sendBy_id: signData.id,
      sendBy_email: signData.email,
      sendTo_email: userInfo.email,
      send_code: couponCode,
      history: {
        fullName: userInfo.fullName,
        email: userInfo.email,
        couponCount: 1,
        createdBy: signData.fullName,
      },
    };
    axios
      .post(`/coupons/sendToCustomer/`, sendInfo)
      .then(() => {
        notification.success({
          /* eslint-disable */
          message: "Successfully to send Coupon Code to " + userInfo.email,
        });
        navigate("/tables");
      })
      .catch(() => {
        notification.error({
          message: "Fail to send email.",
        });
      });
  };

  useEffect(() => {
    getDetailinfo();
    getCouponCode();
  }, []);

  return (
    <DashboardLayout sx={{ width: "50%" }}>
      <DashboardNavbar />
      <MDBox mb={2} />
      <MDBox position="relative" mb={5}>
        <MDBox
          display="flex"
          alignItems="center"
          position="relative"
          minHeight="18.75rem"
          borderRadius="xl"
          sx={{
            backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
              `${linearGradient(
                rgba(gradients.info.main, 0.6),
                rgba(gradients.info.state, 0.6)
              )}, url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "50%",
            overflow: "hidden",
          }}
        />
        <Card
          sx={{
            position: "relative",
            py: 2,
            px: 2,
            width: "50%",
            margin: "-90px auto 0 auto",
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <MDAvatar src={burceMars} alt="profile-image" size="xl" shadow="sm" />
            </Grid>
            <Grid item>
              <MDBox height="100%" mt={0.5} lineHeight={1}>
                <MDTypography variant="h5" fontWeight="medium">
                  Send Coupon Code
                </MDTypography>
              </MDBox>
            </Grid>
          </Grid>
          <MDBox mt={5} mb={3}>
            <Grid container spacing={1}>
              <Grid item xs={12} md={12} xl={12} sx={{ display: "flex", justifyContent: "center" }}>
                {userInfo && (
                  <MDBox sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
                    <MDBox sx={{ width: "80%", height: "100%", boxShadow: true, margin: "auto" }}>
                      <MDBox alignItems="center" pt={2} px={2}>
                        <MDBox display="flex" mb={2}>
                          <MDTypography
                            variant="h5"
                            fontWeight="regular"
                            textTransform="capitalize"
                          >
                            Name:&nbsp;&nbsp;&nbsp;
                          </MDTypography>
                          <MDTypography variant="h5" fontWeight="medium">
                            {userInfo.fullName}
                          </MDTypography>
                        </MDBox>
                        <MDBox display="flex" mb={2}>
                          <MDTypography
                            variant="h5"
                            fontWeight="regular"
                            textTransform="capitalize"
                          >
                            Email:&nbsp;&nbsp;&nbsp;
                          </MDTypography>
                          <MDTypography variant="h5" fontWeight="medium">
                            {userInfo.email}
                          </MDTypography>
                        </MDBox>
                        <MDBox display="flex" mb={2}>
                          <MDTypography
                            variant="h5"
                            fontWeight="regular"
                            textTransform="capitalize"
                          >
                            Coupon Code:&nbsp;&nbsp;&nbsp;
                          </MDTypography>
                          <MDTypography variant="h5" fontWeight="medium">
                            {couponCode}
                          </MDTypography>
                        </MDBox>
                      </MDBox>
                      <MDBox pt={5} width="100%" display="flex" justifyContent="space-between">
                        <Button variant="contained">
                          <MDTypography
                            variant="caption"
                            color="white"
                            fontSize="20px"
                            fontWeight="medium"
                            onClick={() => handleBack()}
                          >
                            Back
                          </MDTypography>
                        </Button>
                        <Button
                          variant="contained"
                          startIcon={<SendIcon color="white" />}
                          onClick={() => handleSend()}
                        >
                          <MDTypography
                            variant="caption"
                            fontSize="20px"
                            color="white"
                            fontWeight="medium"
                          >
                            Send
                          </MDTypography>
                        </Button>
                      </MDBox>
                    </MDBox>
                  </MDBox>
                )}
              </Grid>
            </Grid>
          </MDBox>
        </Card>
      </MDBox>
    </DashboardLayout>
  );
}

export default Overview;
