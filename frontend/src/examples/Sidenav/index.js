import { useEffect } from "react";

// react-router-dom components
import { useLocation, NavLink } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
// import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import SidenavCollapse from "examples/Sidenav/SidenavCollapse";

// Custom styles for the Sidenav
import SidenavRoot from "examples/Sidenav/SidenavRoot";
import sidenavLogoLabel from "examples/Sidenav/styles/sidenav";

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
} from "context";

function Sidenav({ color, brand, brandName, routes, ...rest }) {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode } = controller;
  const location = useLocation();
  const collapseName = location.pathname.replace("/", "");
  const userinfo = JSON.parse(sessionStorage.getItem("userData"));

  let textColor = "white";

  if (transparentSidenav || (whiteSidenav && !darkMode)) {
    textColor = "dark";
  } else if (whiteSidenav && darkMode) {
    textColor = "inherit";
  }

  const closeSidenav = () => setMiniSidenav(dispatch, true);

  useEffect(() => {
    // A function that sets the mini state of the sidenav.
    function handleMiniSidenav() {
      setMiniSidenav(dispatch, window.innerWidth < 1200);
      setTransparentSidenav(dispatch, window.innerWidth < 1200 ? false : transparentSidenav);
      setWhiteSidenav(dispatch, window.innerWidth < 1200 ? false : whiteSidenav);
    }

    /** 
     The event listener that's calling the handleMiniSidenav function when resizing the window.
    */
    window.addEventListener("resize", handleMiniSidenav);

    // Call the handleMiniSidenav function to set the state with the initial value.
    handleMiniSidenav();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleMiniSidenav);
  }, [dispatch, location]);

  // Render all the routes from the routes.js (All the visible items on the Sidenav)

  const Role = {
    Admin: 1,
    AdminBsManager: 2,
    AdminBsUser: 3,
  };

  const renderRoutes = (
    <List>
      <NavLink key={routes[0].key} to={routes[0].route}>
        <SidenavCollapse
          name={routes[0].name}
          icon={routes[0].icon}
          active={routes[0].key === collapseName}
        />
      </NavLink>
      <NavLink key={routes[1].key} to={routes[1].route}>
        <SidenavCollapse
          name={routes[1].name}
          icon={routes[1].icon}
          active={routes[1].key === collapseName}
        />
      </NavLink>
      {userinfo && userinfo.role.id === Role.Admin && (
        <NavLink key={routes[2].key} to={routes[2].route}>
          <SidenavCollapse
            name={routes[2].name}
            icon={routes[2].icon}
            active={routes[2].key === collapseName}
          />
        </NavLink>
      )}
      {userinfo && userinfo.role.id !== Role.AdminBsUser && (
        <NavLink key={routes[3].key} to={routes[3].route}>
          <SidenavCollapse
            name={routes[3].name}
            icon={routes[3].icon}
            active={routes[3].key === collapseName}
          />
        </NavLink>
      )}
      {userinfo && userinfo.role.id === Role.Admin && (
        <NavLink key={routes[4].key} to={routes[4].route}>
          <SidenavCollapse
            name={routes[4].name}
            icon={routes[4].icon}
            active={routes[4].key === collapseName}
          />
        </NavLink>
      )}
      {userinfo && userinfo.role.id === Role.Admin && (
        <NavLink key={routes[5].key} to={routes[5].route}>
          <SidenavCollapse
            name={routes[5].name}
            icon={routes[5].icon}
            active={routes[5].key === collapseName}
          />
        </NavLink>
      )}
      <NavLink key={routes[6].key} to={routes[6].route}>
        <SidenavCollapse
          name={routes[6].name}
          icon={routes[6].icon}
          active={routes[6].key === collapseName}
        />
      </NavLink>
    </List>
  );

  return (
    <SidenavRoot
      {...rest}
      variant="permanent"
      ownerState={{ transparentSidenav, whiteSidenav, miniSidenav, darkMode }}
    >
      <MDBox pt={3} pb={1} px={4} textAlign="center">
        <MDBox
          display={{ xs: "block", xl: "none" }}
          position="absolute"
          top={0}
          right={0}
          p={1.625}
          onClick={closeSidenav}
          sx={{ cursor: "pointer" }}
        >
          <MDTypography variant="h6" color="secondary">
            <Icon sx={{ fontWeight: "bold" }}>account</Icon>
          </MDTypography>
        </MDBox>
        <MDBox component={NavLink} to="/" display="flex" alignItems="center">
          {brand && <MDBox component="img" src={brand} alt="Brand" width="2rem" />}
          <MDBox
            width={!brandName && "100%"}
            sx={(theme) => sidenavLogoLabel(theme, { miniSidenav })}
          >
            <MDTypography component="h6" variant="button" fontWeight="medium" color={textColor}>
              {brandName}
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>
      <Divider
        light={
          (!darkMode && !whiteSidenav && !transparentSidenav) ||
          (darkMode && !transparentSidenav && whiteSidenav)
        }
      />
      <List>{renderRoutes}</List>
    </SidenavRoot>
  );
}

// Setting default values for the props of Sidenav
Sidenav.defaultProps = {
  color: "info",
  brand: "",
};

// Typechecking props for the Sidenav
Sidenav.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  brand: PropTypes.string,
  brandName: PropTypes.string.isRequired,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidenav;
