import React from "react";
import MiniDrawer from "../../components/drawer";

import RegisterUser from "./tab/register";
import ListEmployee from "./tab/list";

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

export default function IndexEmployee(props) {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <MiniDrawer
      title="Employee Management"
      noSpacing={true}
      master={props.master}
    >
      <AppBar position="static">
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Employee List" />
          <Tab label="Register a New Employee" />
        </Tabs>
      </AppBar>
      <TabPanel value={tabValue} index={0}>
        <ListEmployee />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <RegisterUser />
      </TabPanel>
    </MiniDrawer>
  );
}
