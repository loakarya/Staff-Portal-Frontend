import React from "react";
import MiniDrawer from "../../components/drawer";

import ActiveUser from "./tab/active";

import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

export default function IndexUser(props) {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // const reloadData = (category, tab) => {
  //   switch (category) {
  //     case 0:
  //       loadActiveUser(tab);
  //       setLastLoadedCategory(0);
  //       break;

  //     case 1:
  //       loadAllUser(tab);
  //       setLastLoadedCategory(1);
  //       break;

  //     case 2:
  //       loadDeletedUser(tab);
  //       setLastLoadedCategory(2);
  //       break;
  //   }
  // };

  // const loadAllUser = (page) => {
  //   setUserLoaded(false);
  //   Axios.get(`/user/man/all?data_per_page=${dataPerPage}&page=${page}`, {
  //     headers: {
  //       Authorization: "Bearer " + cookies.access_token,
  //     },
  //   }).then((response) => {
  //     setUsers(response.data.data);
  //     setUserLoaded(true);
  //   });
  // };

  // const loadDeletedUser = (page) => {
  //   setUserLoaded(false);
  //   Axios.get(`/user/man/deleted?data_per_page=${dataPerPage}&page=${page}`, {
  //     headers: {
  //       Authorization: "Bearer " + cookies.access_token,
  //     },
  //   }).then((response) => {
  //     setUsers(response.data.data);
  //     setUserLoaded(true);
  //   });
  // };

  return (
    <MiniDrawer title="User Management" noSpacing={true} master={props.master}>
      <AppBar position="static">
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Active User" />
          <Tab label="All User" />
          <Tab label="Deleted User" />
        </Tabs>
      </AppBar>
      <TabPanel value={tabValue} index={0}>
        <ActiveUser />
      </TabPanel>
      <TabPanel value={tabValue} index={1}></TabPanel>
      <TabPanel value={tabValue} index={2}></TabPanel>
    </MiniDrawer>
  );
}
