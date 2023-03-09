import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { CSVLink } from "react-csv";
import axios from "utils/axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";

function Tables() {
  const userinfo = JSON.parse(sessionStorage.getItem("userData"));
  const [rows, setRows] = useState([]);
  const [users, setUsers] = useState([]);
  const [businesslist, setBusinessList] = useState([]);
  const [bsIdx, setBSIdx] = useState();
  const [mailUsers, setMailUsers] = useState([]);
  const [msgtext, setMsgtext] = useState("");
  const navigate = useNavigate();
  const [downCount, setDownCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [couponCount, setCouponCount] = useState(0);
  const [downableNum, setDownableNum] = useState(0);
  const [downloadData, setDownloadData] = useState([]);
  const [downUserIDList, setDownUserIDList] = useState([]);
  const headers = [
    { label: "FullName", key: "FullName" },
    { label: "Email", key: "Email" },
    { label: "Business", key: "Business" },
    { label: "Role", key: "Role" },
    { label: "Phone", key: "Phone" },
    { label: "Address", key: "Address" },
    { label: "Birthday", key: "Birthday" },
  ];
  const columns = [
    { Header: "no", accessor: "no", width: "10%", align: "left" },
    { Header: "fullName", accessor: "fullName", width: "30%", align: "left" },
    { Header: "email", accessor: "email", width: "30%", align: "left" },
    { Header: "business", accessor: "business", align: "center" },
    { Header: "role", accessor: "role", align: "left" },
    { Header: "phone", accessor: "phone", align: "center" },
    { Header: "address", accessor: "address", align: "left" },
    { Header: "birthday", accessor: "birthday", align: "center" },
    { Header: "action", accessor: "action", align: "center" },
  ];

  const showTableData = (array) => {
    const datalist = [];
    let eachRow = [];
    setTotal(array.length);
    const data = array.map((item, idx) => {
      eachRow = {
        FullName: item.fullName,
        Email: item.email,
        Business: item.business.businessType,
        Role: item.role.roleType,
        Phone: item.phone,
        Address: item.address,
        Birthday: item.birthday,
      };
      datalist.push(eachRow);
      return {
        no: (
          <MDBox lineHeight={1} textAlign="center">
            <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
              {idx + 1}
            </MDTypography>
          </MDBox>
        ),
        fullName: (
          <MDBox lineHeight={1} textAlign="center">
            <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
              {item.fullName}
            </MDTypography>
          </MDBox>
        ),
        email: (
          <MDBox lineHeight={1} textAlign="left">
            <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
              {item.email}
            </MDTypography>
          </MDBox>
        ),
        business: (
          <MDBox lineHeight={1} textAlign="center">
            {/* eslint-disable */}
            <Button variant="text" onClick={() => handleBusinessFilter(item.business.id)}>
              <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
                {item.business.businessType}
              </MDTypography>
            </Button>
          </MDBox>
        ),
        role: (
          <MDBox lineHeight={1} textAlign="left">
            <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
              {item.role.roleType}
            </MDTypography>
          </MDBox>
        ),
        phone: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            {item.phone}
          </MDTypography>
        ),
        address: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            {item.address}
          </MDTypography>
        ),
        birthday: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            {item.birthday}
          </MDTypography>
        ),
        action:
          userinfo.role.id == 3 ? (
            <MDTypography
              component="a"
              href={`/coupon/${item.id}`}
              variant="caption"
              color="text"
              fontWeight="medium"
            >
              Send
            </MDTypography>
          ) : (
            <MDTypography
              component="a"
              href={`/profile/${item.id}`}
              variant="caption"
              color="text"
              fontWeight="medium"
            >
              Edit
            </MDTypography>
          ),
      };
    });
    setRows(data);
    setDownloadData(datalist);
  };

  const getBusinessList = () => {
    axios
      .get(`/businesses/`)
      .then((res) => {
        setBusinessList(res.data.data);
      })
      .catch((err) => console.log(err));
  };

  const getUsersData = () => {
    const sendData = {
      role: userinfo.role.id,
      business: userinfo.role.id === 1 ? null : userinfo.business.id,
    };
    axios
      .post(`/users/list/`, sendData)
      .then((res) => {
        setUsers(res.data.data);
        showTableData(res.data.data);
      })
      .catch((err) => console.log(err));
  };

  const handleBusinessFilter = (business_id) => {
    setBSIdx(business_id);
    const sendInfo = {
      business: business_id,
      role: userinfo.role.id == 3 ? 4 : null,
    };
    axios
      .post(`/users/list/`, sendInfo)
      .then((res) => {
        showTableData(res.data.data);
      })
      .catch((err) => console.log(err));
  };

  const handleUserSelect = (e, newVal) => {
    setMailUsers(newVal);
  };

  const handleSendMessage = () => {
    let list = [];
    mailUsers.forEach((item) => {
      list.push(item.email);
    });
    const sendInfo = {
      subject: `New Message From ${userinfo.email}`,
      message: msgtext,
      from_email: userinfo.email,
      recipient_list: list,
    };
    axios
      .post(`/email/message/`, sendInfo)
      .then(() => {
        notification.success({
          message: "Successfully to send email.",
        });
      })
      .catch(() => {
        notification.error({
          message: "Fail to send email.",
        });
      });
  };

  const handleMessageText = (e) => {
    setMsgtext(e.target.value);
  };

  const selectDownloadUserData = (val) => {
    console.log(val);
    const sendData = {
      from_user: userinfo.id,
      business: userinfo.business.id,
      downCount: val,
      role: userinfo.role.id,
    };
    axios
      .post(`/users/download/select/`, sendData)
      .then((res) => {
        let list = [];
        let eachRow = [];
        let id_list = [];
        res.data.data.map((item) => {
          id_list.push(item.id);
          eachRow = {
            FullName: item.fullName,
            Email: item.email,
            Business: item.business.businessType,
            Role: item.role.roleType,
            Phone: item.phone,
            Address: item.address,
            Birthday: item.birthday,
          };
          list.push(eachRow);
        });
        console.log(list);
        setDownloadData(list);
        setDownUserIDList(id_list);
      })
      .catch((err) => console.log(err));
  };

  const saveDownloadUserData = () => {
    const sendData = {
      from_user: userinfo.id,
      downUsers: downUserIDList,
    };
    axios
      .post(`/users/download/save/`, sendData)
      .then(() => {
        setDownableNum(downableNum - downUserIDList.length);
      })
      .catch((err) => console.log(err));
  };

  const getDownableCount = () => {
    const sendData = {
      from_user: userinfo.id,
      business: userinfo.business.id,
      role: userinfo.role.id,
    };
    axios
      .post(`/users/downableCount/`, sendData)
      .then((res) => {
        console.log(res.data.downableCount);
        setDownableNum(res.data.downableCount);
        setDownCount(res.data.downableCount);
        selectDownloadUserData(res.data.downableCount);
      })
      .catch((err) => console.log(err));
  };

  const handleAdd = () => {
    if (couponCount === 0) {
      notification.warning({
        message: "You haven' t any coupon.",
        placement: "bottomRight",
      });
    } else {
      navigate(`/user/add`);
    }
  };

  const getCouponCount = () => {
    axios
      .get(`/coupons/count/${userinfo.id}`)
      .then((res) => {
        setCouponCount(res.data.count);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getUsersData();
    getBusinessList();
    if (userinfo.role.id != 1) {
      getDownableCount();
      if (userinfo.role.id === 3) {
        getCouponCount();
      }
    }
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
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
                {userinfo.role.id == 3 ? (
                  <MDTypography variant="h3" color="white">
                    Coupons: {couponCount}
                  </MDTypography>
                ) : (
                  <MDTypography variant="h3" color="white">
                    Users
                  </MDTypography>
                )}
                {userinfo.role.id == 1 && (
                  <FormControl size="large" sx={{ m: 1, minWidth: 200, fontSize: "20px" }}>
                    <InputLabel id="ddemo-simple-select-standard-label" style={{ color: "white" }}>
                      Filter By Business
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      color="white"
                      value={bsIdx}
                      label="Filter By Business"
                      onChange={(e) => handleBusinessFilter(e.target.value)}
                      style={{ height: "50px" }}
                    >
                      <MenuItem value={null}>
                        <em>All</em>
                      </MenuItem>
                      {businesslist &&
                        businesslist.map((item, idx) => {
                          return (
                            <MenuItem key={idx} value={item.id}>
                              {item.businessType}
                            </MenuItem>
                          );
                        })}
                    </Select>
                  </FormControl>
                )}
                {(userinfo.role.id == 2 || userinfo.role.id == 3) && (
                  <MDTypography
                    variant="caption"
                    color="white"
                    fontWeight="medium"
                    sx={{ fontSize: "20px" }}
                  >
                    Total: {total}&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;Download Available:{" "}
                    {downableNum}
                  </MDTypography>
                )}
                <MDBox>
                  {userinfo.role.id == 1 && (
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon color="white" />}
                      sx={{ marginRight: "10px" }}
                    >
                      <MDTypography
                        component="a"
                        href="/user/add"
                        variant="caption"
                        color="white"
                        fontWeight="medium"
                        sx={{ fontSize: "15px" }}
                      >
                        Add
                      </MDTypography>
                    </Button>
                  )}
                  {(userinfo.role.id == 2 || userinfo.role.id == 3) && (
                    <TextField
                      id="outlined-number"
                      label="Count"
                      type="number"
                      style={{ marginRight: "20px" }}
                      InputLabelProps={{
                        shrink: true,
                        style: { color: "#fff" },
                      }}
                      value={downCount}
                      onChange={(e) => {
                        var value = parseInt(e.target.value, 10);

                        if (value > downableNum) {
                          value = downableNum;
                        } else if (value < 0) {
                          value = 0;
                        }
                        setDownCount(value);
                        selectDownloadUserData(value);
                      }}
                    />
                  )}
                  <Button
                    variant="outlined"
                    startIcon={<CloudDownloadIcon color="white" />}
                    mx="10px"
                  >
                    <CSVLink data={downloadData} headers={headers}>
                      <MDTypography
                        variant="caption"
                        color="white"
                        fontWeight="medium"
                        sx={{ fontSize: "15px" }}
                        onClick={() => saveDownloadUserData()}
                      >
                        Download
                      </MDTypography>
                    </CSVLink>
                  </Button>
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
        </Grid>
        {userinfo.role.id == 3 && (
          <MDBox width="100%" mt={2} px={2} display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              startIcon={<AddIcon color="white" />}
              onClick={() => handleAdd()}
            >
              <MDTypography variant="caption" fontSize="20px" color="white" fontWeight="medium">
                New Account
              </MDTypography>
            </Button>
          </MDBox>
        )}
        {userinfo.role.id == 1 && (
          <MDBox>
            <MDBox mt={4} width="50%" mx="auto">
              <MDBox my={3}>
                {users && (
                  <Autocomplete
                    options={users}
                    getOptionLabel={(option) => option.email}
                    id="disable-close-on-select"
                    disableCloseOnSelect
                    multiple
                    onChange={handleUserSelect}
                    renderInput={(params) => (
                      <TextField {...params} label="Business Users" variant="standard" />
                    )}
                  />
                )}
              </MDBox>
              <MDBox my={3}>
                <TextField
                  id="outlined-multiline-static"
                  label="Message"
                  multiline
                  rows={4}
                  fullWidth
                  onChange={handleMessageText}
                />
              </MDBox>
              <MDBox my={3} sx={{ display: "flex", justifyContent: "flex-end" }}>
                <MDBox width="30%">
                  <Button variant="contained" fullWidth onClick={() => handleSendMessage()}>
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
        )}
      </MDBox>
    </DashboardLayout>
  );
}

export default Tables;
