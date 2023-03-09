import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import Button from "@mui/material/Button";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import axios from "utils/axios";
import { useEffect, useState } from "react";

function BusinessManagement() {
  const [rows, setRows] = useState([]);
  const [visible, setVisible] = useState(false);
  const [bsName, setBSName] = useState(null);
  const [bsId, setBSId] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const columns = [
    { Header: "No", accessor: "No", align: "left" },
    { Header: "Business", accessor: "Business", width: "40%", align: "left" },
    { Header: "Action", accessor: "action", align: "center" },
  ];

  const handleEdit = (id, name) => {
    setBSId(id);
    setBSName(name);
    setIsEdit(true);
    setVisible(true);
  };
  const handleAdd = () => {
    setVisible(true);
    setIsEdit(false);
  };

  const settingTableValues = (res) => {
    const bslist = res.data.map((item, idx) => ({
      No: (
        <MDBox lineHeight={1} textAlign="left">
          <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
            {idx + 1}
          </MDTypography>
        </MDBox>
      ),
      Business: (
        <MDBox lineHeight={1} textAlign="left">
          <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
            {item.businessType}
          </MDTypography>
        </MDBox>
      ),
      action: (
        <MDBox
          lineHeight={1}
          textAlign="left"
          sx={{ cursor: "pointer" }}
          onClick={() => handleEdit(item.id, item.businessType)}
        >
          <MDTypography variant="caption" color="text" fontWeight="medium">
            Edit
          </MDTypography>
        </MDBox>
      ),
    }));
    setRows(bslist);
  };

  const getBusinessData = () => {
    axios
      .get(`/businesses/`)
      .then((res) => {
        settingTableValues(res.data);
      })
      .catch((err) => console.log(err));
  };

  const handleOnSave = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const info = {
      businessType: data.get("bsName"),
    };
    if (isEdit) {
      axios
        .put(`/businesses/${bsId}`, info)
        .then((res) => {
          settingTableValues(res.data);
          setBSId(null);
          setBSName(null);
        })
        .then((err) => console.log(err));
    } else {
      axios
        .post(`/businesses/`, info)
        .then((res) => {
          settingTableValues(res.data);
        })
        .then((err) => console.log(err));
    }
    setVisible(false);
  };

  useEffect(() => {
    getBusinessData();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={5}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <MDTypography variant="h3" color="white">
                  Business List
                </MDTypography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon color="white" />}
                  width="100px"
                  onClick={() => handleAdd()}
                >
                  <MDTypography variant="caption" color="white" fontWeight="medium">
                    Add
                  </MDTypography>
                </Button>
              </MDBox>
              <MDBox pt={3}>
                {rows && (
                  <DataTable
                    table={{ columns, rows }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  />
                )}
              </MDBox>
            </Card>
          </Grid>
          <Grid item xs={7}>
            <MDBox mt={3} width="70%" mx="auto">
              {visible && (
                <MDBox component="form" role="form" onSubmit={handleOnSave}>
                  <MDBox mb={2}>
                    <MDInput
                      type="text"
                      label="Business Name"
                      name="bsName"
                      variant="standard"
                      fullWidth
                      defaultValue={bsName}
                    />
                  </MDBox>
                  <MDBox sx={{ display: "flex", justifyContent: "center" }}>
                    <MDBox width="30%" mx={3} my={5}>
                      <Button
                        variant="contained"
                        startIcon={<SaveIcon color="white" />}
                        fullWidth
                        type="submit"
                      >
                        <MDTypography
                          variant="caption"
                          fontSize="20px"
                          color="white"
                          fontWeight="medium"
                        >
                          Save
                        </MDTypography>
                      </Button>
                    </MDBox>
                    <MDBox width="30%" mx={3} my={5}>
                      <Button
                        variant="contained"
                        startIcon={<CancelIcon color="white" />}
                        fullWidth
                        onClick={() => setVisible(false)}
                      >
                        <MDTypography
                          variant="caption"
                          fontSize="20px"
                          color="white"
                          fontWeight="medium"
                        >
                          Cancel
                        </MDTypography>
                      </Button>
                    </MDBox>
                  </MDBox>
                </MDBox>
              )}
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default BusinessManagement;
