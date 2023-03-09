import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import axios from "utils/axios";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DeleteIcon from "@mui/icons-material/Delete";
import WarningIcon from "@mui/icons-material/Warning";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";

function ProfileInfoCard({ title, info, roleid, roles, userid, shadow }) {
  const labels = [];
  const values = [];
  const navigate = useNavigate();
  const [prevRole, setPrevRole] = useState(roleid);
  const [roledata, setRoledata] = useState(roleid);
  const [roleVisible, setRoleVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);

  // Convert this form `objectKey` of the object key in to this `object key`
  Object.keys(info).forEach((el) => {
    if (el.match(/[A-Z\s]+/)) {
      const uppercaseLetter = Array.from(el).find((i) => i.match(/[A-Z]+/));
      const newElement = el.replace(uppercaseLetter, ` ${uppercaseLetter.toLowerCase()}`);

      labels.push(newElement);
    } else {
      labels.push(el);
    }
  });

  // Push the object values into the values array
  Object.values(info).forEach((el) => values.push(el));

  // Render the card info items
  const renderItems = labels.map((label, key) => (
    <MDBox key={label} display="flex" py={1} pr={2}>
      <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
        {label}: &nbsp;
      </MDTypography>
      <MDTypography variant="button" fontWeight="regular" color="text">
        &nbsp;{values[key]}
      </MDTypography>
    </MDBox>
  ));

  const handleRoleChange = () => {
    const updatedata = {
      role: roledata,
    };

    axios
      .put(`/users/${userid}`, updatedata)
      .then((res) => {
        setRoledata(res.data.role.id);
        setPrevRole(res.data.role.id);
        notification.success({
          message: "Successfully to update a role.",
          placement: "bottomRight",
        });
      })
      .catch(() => {
        notification.error({
          message: "Fail to update a role.",
          placement: "bottomRight",
        });
      });
    setRoleVisible(false);
  };

  const handleSelectChange = (event) => {
    setRoledata(event.target.value);
  };

  const handleUserDelete = () => {
    axios
      .delete(`users/${userid}`)
      .then(() => {
        notification.success({
          message: "Successfully to delete.",
          placement: "bottomRight",
        });
        navigate("/tables");
      })
      .catch(() => {
        notification.error({
          message: "Fail to delete.",
          placement: "bottomRight",
        });
      });
    setDeleteVisible(false);
  };

  const handleBack = () => {
    navigate("/tables");
  };

  const handleRoleOpen = () => {
    setRoleVisible(true);
  };

  const handleRoleClose = () => {
    setRoleVisible(false);
  };

  const handleDeleteOpen = () => {
    setDeleteVisible(true);
  };

  const handleDelteClose = () => {
    setDeleteVisible(false);
  };

  return (
    <MDBox sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <Card sx={{ height: "100%", boxShadow: !shadow && "none", margin: "auto" }}>
        <MDBox display="flex" justifyContent="space-between" alignItems="center" pt={2} px={2}>
          <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
            {title}
          </MDTypography>
        </MDBox>
        <MDBox p={2}>
          <MDBox opacity={0.3}>
            <Divider />
          </MDBox>
          <MDBox>
            {renderItems}
            <MDBox display="flex" py={1} pr={2}>
              <MDBox display="flex" alignItems="center" height="50px">
                <MDTypography
                  variant="button"
                  fontWeight="bold"
                  textTransform="capitalize"
                  pt="5px"
                >
                  Role: &nbsp;
                </MDTypography>
              </MDBox>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={roledata}
                fullWidth
                defaultValue={roleid}
                onChange={handleSelectChange}
                style={{ height: "40px", marginLeft: "10px" }}
              >
                {roles &&
                  roles.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.roleType}
                    </MenuItem>
                  ))}
              </Select>
            </MDBox>
            {roledata !== prevRole && (
              <MDBox sx={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
                <Button variant="outlined" onClick={handleRoleOpen} sx={{ color: "blue" }}>
                  Change
                </Button>
              </MDBox>
            )}
            <MDBox display="flex" justifyContent="space-between" px={1}>
              <Button variant="outlined" startIcon={<DeleteIcon color="black" />}>
                <MDTypography
                  variant="caption"
                  color="dark"
                  fontWeight="medium"
                  onClick={handleDeleteOpen}
                >
                  Delete
                </MDTypography>
              </Button>
              <Button variant="contained">
                <MDTypography
                  variant="caption"
                  color="white"
                  fontWeight="medium"
                  onClick={handleBack}
                >
                  Back
                </MDTypography>
              </Button>
            </MDBox>
            <MDBox display="flex" py={1} pr={2} />
          </MDBox>
        </MDBox>
      </Card>
      <Dialog
        open={roleVisible}
        onClose={handleRoleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" display="flex" alignItems="center">
          <WarningIcon sx={{ marginRight: "10px", color: "orange" }} />
          Do you really change a role?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleRoleClose}>Cancel</Button>
          <Button onClick={handleRoleChange} autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={deleteVisible}
        onClose={handleDelteClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" display="flex" alignItems="center">
          <WarningIcon sx={{ marginRight: "10px", color: "orange" }} />
          Do you really delete?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleDelteClose}>Cancel</Button>
          <Button onClick={handleUserDelete} autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </MDBox>
  );
}

// Setting default props for the ProfileInfoCard
ProfileInfoCard.defaultProps = {
  shadow: true,
};

// Typechecking props for the ProfileInfoCard
ProfileInfoCard.propTypes = {
  title: PropTypes.string.isRequired,
  info: PropTypes.objectOf(PropTypes.string).isRequired,
  roles: PropTypes.arrayOf(PropTypes.object).isRequired,
  userid: PropTypes.number.isRequired,
  roleid: PropTypes.number.isRequired,
  shadow: PropTypes.bool,
};

export default ProfileInfoCard;
