

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

// @material-ui/icons
import Chat from "@material-ui/icons/Chat";
import VerifiedUser from "@material-ui/icons/VerifiedUser";
import Fingerprint from "@material-ui/icons/Fingerprint";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import InfoArea from "components/InfoArea/InfoArea.js";

import styles from "assets/jss/material-kit-react/views/landingPageSections/productStyle.js";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

export default function CenteredTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  
  return (
    <div className={classes.section}>

    <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={8}>
        <Paper>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab label="Private"/>
        <Tab label="Public"/>
        <Tab label="Sell" />
        <Tab label="Buy" />
      </Tabs>
    </Paper>
        </GridItem>
      </GridContainer>

    
    </div>
  );
}









