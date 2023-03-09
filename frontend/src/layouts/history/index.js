// import { format } from "date-fns";
/*eslint-disable*/
import moment from "moment";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import Button from "@mui/material/Button";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import axios from "utils/axios";
import { useEffect, useState } from "react";
import { CSVLink } from "react-csv";

function CouponHistory() {
  const [rows, setRows] = useState([]);
  const headers = [
    { label: "No", key: "No" },
    { label: "FullName", key: "FullName" },
    { label: "Email", key: "Email" },
    { label: "Coupon Count", key: "Coupon_Count" },
    { label: "Created_At", key: "Created_At" },
    { label: "Created_By", key: "Created_By" },
  ];
  const [downloadData, setDownloadData] = useState([]);
  const columns = [
    { Header: "no", accessor: "no", width: "20%", align: "left" },
    { Header: "user", accessor: "user", width: "40%", align: "left" },
    { Header: "couponCount", accessor: "couponCount", align: "center" },
    { Header: "createdAt", accessor: "createdAt", align: "center" },
    { Header: "createdBy", accessor: "createdBy", align: "center" },
  ];

  const getHistoryData = () => {
    axios
      .get(`/coupons/history/`)
      .then((res) => {
        const datalist = [];
        let eachRow = [];
        const data = res.data.data.map((item, idx) => {
          eachRow = {
            No: (idx + 1).toString(),
            FullName: item.fullName,
            Email: item.email,
            Coupon_Count: item.couponCount,
            Created_At: item.createdAt,
            Created_By: item.createdBy,
          };
          datalist.push(eachRow);
          return {
            no: (
              <MDBox lineHeight={1} textAlign="left">
                <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
                  {idx + 1}
                </MDTypography>
              </MDBox>
            ),
            user: (
              <MDBox display="flex" alignItems="center" lineHeight={1}>
                <MDBox ml={2} lineHeight={1}>
                  <MDTypography display="block" variant="button" fontWeight="medium">
                    {item.fullName}
                  </MDTypography>
                  <MDTypography variant="caption">{item.email}</MDTypography>
                </MDBox>
              </MDBox>
            ),
            couponCount: (
              <MDBox lineHeight={1} textAlign="left">
                <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
                  {item.couponCount}
                </MDTypography>
              </MDBox>
            ),
            createdAt: (
              <MDTypography variant="caption" color="text" fontWeight="medium">
                {moment(item.createdAt).format("yyyy/MM/DD hh:mm:ss")}
              </MDTypography>
            ),
            createdBy: (
              <MDTypography variant="caption" color="text" fontWeight="medium">
                {item.createdBy}
              </MDTypography>
            ),
          };
        });
        setRows(data);
        setDownloadData(datalist);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getHistoryData();
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
                <MDTypography variant="h3" color="white">
                  History
                </MDTypography>
                <MDBox>
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
      </MDBox>
    </DashboardLayout>
  );
}

export default CouponHistory;
