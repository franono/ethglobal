import React from "react";
import PropTypes from "prop-types";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import SettingsIcon from "@material-ui/icons/Settings";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import Grid from '@material-ui/core/Grid';
import VideoLabelIcon from "@material-ui/icons/VideoLabel";
import Typography from "@material-ui/core/Typography";
import BuyerInteraction from 'components/Secret/BuyerInteraction.js'
import particlestyles from "assets/jss/material-kit-react/views/landingPage";
import classNames from "classnames";
import ButtonGroup  from '@material-ui/core/ButtonGroup';
import Button from "@material-ui/core/Button";

const useColorlibStepIconStyles = require('assets/styles/ColorLibStepIconStyle.js');

function ColorlibStepIcon(props) {
  const classes = useColorlibStepIconStyles();
  const { active, completed } = props;

  const icons = {
    1: <SettingsIcon />,
    2: <GroupAddIcon />,
    3: <VideoLabelIcon />
  };

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed
      })}
    >
      {icons[String(props.icon)]}
    </div>
  );
}

ColorlibStepIcon.propTypes = {
  active: PropTypes.bool,
  completed: PropTypes.bool,
  icon: PropTypes.node
};

const useStyles = makeStyles(theme => ({
  root: {
    width: "90%",
    padding: theme.spacing(3, 2),
  },
  button: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    color: "#000000"
  },
  grid: {
    marginBottom: theme.spacing(2),
    color: "#000000"
  },
  steps: {
    margin: theme.spacing(2),
  }
}));

const pStyles = makeStyles(particlestyles);

export default function CustomizedSteppers() {

  const classes = useStyles();
  const [state, setState] = React.useState(0);
  const classesP = pStyles();

  return (
    <div  id="buying" className={classes.section}>
      <div className={classNames(classesP.submain, classesP.submainRaised)}>  
      <div className={classesP.container}>
      <Grid container direction={'column'} justify = "center" className={classes.grid}>
        <br></br>
        <h5 className={classesP.title2}>1: Find a Seller</h5>
        <div class={classesP.subtitle2}>
            <div class={classes.steps}>
              <h5>Find a trader looking to sell ETH through Paypal or Revolut on: 
                <ul>
                  <ButtonGroup
                    orientation="vertical"
                    color="inherited"
                    variant="contained"
                    size = "Large"
                    fullWidth = "true"
                  >
                  <Button href="https://www.reddit.com/r/SecretPay/"> Subreddit </Button>
                  <Button href="https://t.me/joinchat/E8SAPEUVQHSiKjSyGWkf9g"> Telegram Group </Button>
                  </ButtonGroup>
                </ul>
              <h5>Provide only the following information to the other party:</h5>
              <ol>
                <li>Your ETH address to receive the purchased ETH</li>
                <li>Agreed upon trade amounts in ETH and FIAT</li>
              </ol>
              </h5>
            </div>
          </div>
          <Grid item align="center">
            <h5 className={classesP.title2}>2: Find and verify contract</h5>
          </Grid>
          <div class={classesP.subtitle2}>
           <div class={classes.steps}>
            <h5>It is of utmost importance to take the following precautions when buying ETH using SecretPay: 
              <ol>
                <li> Do not interact with any payment details sent to you directly by a seller, as fraudsters may send a different invoice from the one listed on the SecretPay contract, resulting in the ETH not being unlocked when paid.</li> <li>Ask the seller to provide the newly created SecretPay contract, which will have it's details loaded below if it was created using the verified SecretPay contract creator.</li><li>Make sure that the oracles chosen by the seller are SecretPay Verified, as noted in the below table. Should the seller input dummy Chainlink node details and the payment is affected from your end, there may be no way of redeeming the ETH if the Chainlink nodes are not responding.</li>
              </ol>  
              </h5>
                <BuyerInteraction/>
              </div> 
          </div>
        </Grid>
      </div>
      </div>
    </div>
  );
}
