import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
/* eslint-disable */
import Coupons from "layouts/coupons/coupons";
import Business from "layouts/business";
import Roles from "layouts/roles";
import History from "layouts/history";
import Profile from "layouts/profile";
import CouponSend from "layouts/coupons/couponSend";
import NewAccount from "layouts/profile/NewAccount";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import Icon from "@mui/material/Icon";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import CreditScoreIcon from "@mui/icons-material/CreditScore";

const Role = {
  All: 1,
  AdminBsManager: 2,
  AdminBsUser: 3,
};

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    role: Role.Admin,
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "User Management",
    key: "tables",
    role: Role.Admin,
    icon: <Icon fontSize="small">people</Icon>,
    route: "/tables",
    component: <Tables />,
  },
  {
    type: "collapse",
    name: "Coupon Management",
    key: "coupons",
    role: Role.AdminBsUser,
    icon: <QrCode2Icon fontSize="small" />,
    route: "/coupons",
    component: <Coupons />,
  },
  {
    type: "collapse",
    name: "Business Management",
    key: "business",
    role: Role.AdminBsManager,
    icon: <Icon fontSize="small">business</Icon>,
    route: "/business",
    component: <Business />,
  },
  {
    type: "collapse",
    name: "Role Management",
    key: "roles",
    role: Role.Admin,
    icon: <CreditScoreIcon fontSize="small" />,
    route: "/roles",
    component: <Roles />,
  },
  {
    type: "collapse",
    name: "Coupon History",
    key: "history",
    role: Role.Admin,
    icon: <Icon fontSize="small">history</Icon>,
    route: "/history",
    component: <History />,
  },
  {
    type: "collapse",
    name: "Sign Out",
    key: "sign-in",
    role: Role.Admin,
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  {
    key: "sign-up",
    route: "/authentication/sign-up",
    component: <SignUp />,
  },
  {
    key: "new_user",
    route: "/user/add",
    component: <NewAccount />,
  },
  {
    key: "profile",
    route: "/profile/:id",
    component: <Profile />,
  },
  {
    key: "couponSend",
    route: "/coupon/:id",
    component: <CouponSend />,
  },
];

export default routes;
