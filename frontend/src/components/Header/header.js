import React from "react";
import Button from "@material-ui/core/Button";
import { NavLink, Link } from "react-router-dom";
import { Toolbar, AppBar, IconButton, Menu, Typography, makeStyles} from '@material-ui/core';
import styles from "../../assets/jss/material-kit-react/components/headerStyle";
const useStyles = makeStyles(styles);

export default function Header() {
  const classes = useStyles();

  return (
    <AppBar style={{ background: '#630000' }}>
    <Toolbar >
      <IconButton color="inherit" aria-label="open drawer" >
        <Menu />
      </IconButton>
      <Typography variant="h6" className={classes.title}> SecretPay </Typography>

      <Button 
        color="inherit" 
        style={{ marginLeft: "auto" }}
        component={ Link }
        to="/"> Home
      </Button>

      <Button 
        color="inherit" 
        component={ Link }
        to="/Secret"> Secret
      </Button>

    </Toolbar>
    </AppBar>
  );
}