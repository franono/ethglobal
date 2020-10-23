import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { List, ListItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Favorite from "@material-ui/icons/Favorite";
import styles from "assets/jss/material-kit-react/components/footerStyle.js";

const useStyles = makeStyles(styles);

export default function Footer(props) {
  const classes = useStyles();
  const { whiteFont } = props;
  const footerClasses = classNames({
    [classes.footer]: true,
    [classes.footerWhiteFont]: whiteFont
  });
  const aClasses = classNames({
    [classes.a]: true,
    [classes.footerWhiteFont]: whiteFont
  });
  return (
    <footer className={footerClasses}>
      <div className={classes.container}>
        <div className={classes.left}>
           
        </div>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  whiteFont: PropTypes.bool
};
