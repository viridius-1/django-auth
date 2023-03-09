import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import Button from "@mui/material/Button";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SendIcon from "@mui/icons-material/Send";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "utils/axios";
import { useEffect, useState } from "react";
import { notification } from "antd";

function Coupons() {
  const [rows, setRows] = useState([]);
  const [filename, setFileName] = useState("");
  const [bsUsers, setbsUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [file, setFile] = useState(null);
  const [sendCount, setSendCount] = useState(0);
  const [sendBSuser, setSendBSuser] = useState();
  const fileReader = new FileReader();
  const userinfo = JSON.parse(sessionStorage.getItem("userData"));

  const columns = [
    { Header: "No", accessor: "No", width: "40%", align: "left" },
    { Header: "Code", accessor: "Code", align: "center" },
  ];

  const settingTableValues = (res) => {
    setTotal(res.data.length);
    const couponlist = res.data.map((item, idx) => ({
      No: (
        <MDBox lineHeight={1} textAlign="left">
          <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
            {idx + 1}
          </MDTypography>
        </MDBox>
      ),
      Code: (
        <MDBox lineHeight={1} textAlign="left">
          <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
            {item.code}
          </MDTypography>
        </MDBox>
      ),
    }));
    setRows(couponlist);
  };

  const getCouponData = () => {
    axios
      .get(`/coupons/${userinfo.id}`)
      .then((res) => {
        settingTableValues(res.data);
      })
      .catch((err) => console.log(err));
  };

  const getBusinessUsers = () => {
    const filter = {
      /* eslint-disable */
      role: 3, //Business User
    };
    axios
      .post(`users/list/`, filter)
      .then((res) => {
        setbsUsers(res.data.data);
      })
      .catch((err) => console.log(err));
  };

  const handleOnChange = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  const csvFileToArray = (string) => {
    const csvRows = string.split("\n");
    let codelist = [];
    csvRows.map((item) => {
      if (item !== "") {
        codelist.push({
          code: item.substring(0, item.length - 1),
          user: userinfo.id,
        });
      }
    });

    axios
      .post(`/coupons/add/${userinfo.id}`, codelist)
      .then((res) => {
        if (res.data.same_code === 0) {
          notification.success({
            message: "Successfully to import" + res.data.success_code + "codes.",
            placement: "bottomRight",
          });
        } else {
          notification.warning({
            message: res.data.same_code + " codes is duplicated.",
            placement: "bottomRight",
          });
        }
        settingTableValues(res.data);
      })
      .catch((err) => console.log(err));
    setFileName("");
    setFile(null);
  };

  const handleSend = () => {
    const sendInfo = {
      sendTo_id: sendBSuser.id,
      sendTo_email: sendBSuser.email,
      sendBy_id: userinfo.id,
      sendBy_email: userinfo.email,
      sendCount: sendCount,
      history: {
        fullName: sendBSuser.fullName,
        email: sendBSuser.email,
        couponCount: sendCount,
        createdBy: userinfo.fullName,
      },
    };
    axios
      .post(`/coupons/sendToBsUser/`, sendInfo)
      .then((res) => {
        notification.success({
          message: "You've just sent " + sendCount + "codes to " + sendBSuser.email + ".",
          placement: "bottomRight",
        });
        settingTableValues(res.data);
      })
      .catch(() => {
        notification.error({
          message: "Fail to send a email.",
          placement: "bottomRight",
        });
      });
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();

    if (file) {
      fileReader.onload = function (event) {
        const text = event.target.result;
        csvFileToArray(text);
      };

      fileReader.readAsText(file);
    } else {
      notification.warning({
        message: "Upload a CSV file.",
        placement: "bottomRight",
      });
    }
  };

  const handleBSuserSelect = (e, val) => {
    console.log(e);
    setSendBSuser(val);
  };

  const handleUploadClick = () => {
    // if (!file) {
    //   notification.warning({
    //     message: "Select a other CSV file.",
    //   });
    // }
  };

  useEffect(() => {
    getCouponData();
    getBusinessUsers();
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
                py={2}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}
              >
                <MDTypography variant="h3" color="white">
                  Total: {total}
                </MDTypography>
                <MDBox>
                  <form>
                    <MDBox display="flex" justifyContent="space-between">
                      <Button
                        variant="outlined"
                        startIcon={<CloudUploadIcon color="white" />}
                        component="label"
                        style={{ marginRight: "10px" }}
                      >
                        Upload
                        <input
                          hidden
                          accept=".csv"
                          multiple
                          type="file"
                          onChange={handleOnChange}
                          onClick={() => handleUploadClick()}
                        />
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={(e) => {
                          handleOnSubmit(e);
                        }}
                      >
                        IMPORT CSV
                      </Button>
                    </MDBox>
                  </form>
                  <MDTypography variant="h5" mt={2} color="white">
                    {filename}
                  </MDTypography>
                </MDBox>
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
              <MDBox fullwidth="true">
                <MDBox>
                  {bsUsers && (
                    <Autocomplete
                      options={bsUsers}
                      getOptionLabel={(option) => option.email}
                      id="disable-close-on-select"
                      disableCloseOnSelect
                      onChange={handleBSuserSelect}
                      renderInput={(params) => (
                        <TextField {...params} label="Business Users" variant="standard" />
                      )}
                    />
                  )}
                  <MDBox mt={3}>
                    <TextField
                      id="outlined-number"
                      label="Count"
                      type="number"
                      fullwidth="true"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={sendCount}
                      onChange={(e) => {
                        var value = parseInt(e.target.value, 10);

                        if (value > total) value = total;
                        if (value < 0) value = 0;

                        setSendCount(value);
                      }}
                    />
                  </MDBox>
                </MDBox>
                <MDBox sx={{ display: "flex", justifyContent: "center" }}>
                  <MDBox width="50%" my={5}>
                    <Button
                      variant="contained"
                      startIcon={<SendIcon color="white" />}
                      fullwidth="true"
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
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Coupons;
