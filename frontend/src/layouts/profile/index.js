import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import { useParams } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import Header from "layouts/profile/components/Header";
import { useEffect, useState } from "react";
import axios from "utils/axios";

function Overview() {
  const { id } = useParams();
  const [userInfo, setUserInfo] = useState(null);
  const [roleList, setRoleList] = useState([]);

  const getDetailinfo = () => {
    axios
      .get(`/users/${id}`)
      .then((res) => {
        setUserInfo(res.data);
      })
      .catch((err) => console.log(err));
  };

  const getRoleList = () => {
    axios
      .get(`/roles/`)
      .then((res) => {
        setRoleList(res.data.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getDetailinfo();
    getRoleList();
  }, []);

  return (
    <DashboardLayout sx={{ width: "50%" }}>
      <DashboardNavbar />
      <MDBox mb={2} />
      <Header>
        <MDBox mt={5} mb={3}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={12} xl={12} sx={{ display: "flex", justifyContent: "center" }}>
              {userInfo && roleList && (
                <ProfileInfoCard
                  title="profile information"
                  info={{
                    fullName: userInfo.fullName,
                    Email: userInfo.email,
                    Phone: userInfo.phone,
                    Address: userInfo.address,
                    Business: userInfo.business.businessType,
                    // Role: userInfo.role.roleType,
                    Birthday: userInfo.birthday,
                  }}
                  userid={userInfo.id}
                  roleid={userInfo.role.id}
                  roles={roleList}
                />
              )}
            </Grid>
          </Grid>
        </MDBox>
      </Header>
    </DashboardLayout>
  );
}

export default Overview;
