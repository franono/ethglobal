import React from "react";
import PropTypes from "prop-types";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Check from "@material-ui/icons/Check";
import SettingsIcon from "@material-ui/icons/Settings";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import Grid from '@material-ui/core/Grid';
import VideoLabelIcon from "@material-ui/icons/VideoLabel";
import Typography from "@material-ui/core/Typography";
import BuyerInteraction from 'views/Components/Secret/BuyerInteraction.js'

//Import custom style
const useQontoStepIconStyles = require('assets/styles/IconStyle.js');
const useStyles = require('assets/styles/CustomStyleOne.js');
const useColorlibStepIconStyles = require('assets/styles/ColorLibStepIconStyle.js');

function QontoStepIcon(props) {
  const classes = useQontoStepIconStyles();
  const { active, completed } = props;

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active
      })}
    >
      {completed ? (
        <Check className={classes.completed} />
      ) : (
        <div className={classes.circle} />
      )}
    </div>
  );
}

QontoStepIcon.propTypes = {
  active: PropTypes.bool,
  completed: PropTypes.bool
};

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


export default function CustomizedSteppers() {
  const classes = useStyles();
  const [state, setState] = React.useState(0);

  return (
    <div  id="buying" className={classes.section}>
    <div>
            <div>

      <Grid container direction={'column'} justify = "center" className={classes.grid}>
        {/* <Paper className={classes.root}> */}
        <Grid item align="center">
          <Typography variant="h5" component="h3">
          Step 1: Find a seller
          </Typography><br/>
          </Grid>
        <div class={classes.steps}>
          
          <h5>Find a trader looking to sell ETH through Paypal or Revolut on: <ul><li><a href="http://www.reddit.com/r/SecretPay/">SecretPay subreddit</a></li><li><a href="https://t.me/joinchat/E8SAPEUVQHSiKjSyGWkf9g">SecretPay Telegram group</a></li></ul>
          <h5>Provide only the following information to the other party:</h5>
          <ol><li>Your ETH address to receive the purchased ETH</li><li>Agreed upon trade amounts in ETH and FIAT</li></ol></h5>
          </div>
          {/* <Divider variant="middle" /> */}
        <Grid item align="center">
          <Typography variant="h5" component="h2">
          Step 2: Find and verify contract
          </Typography>
          </Grid>
          <div class={classes.steps}>
          <div><h5>It is of utmost importance to take the following precautions when buying ETH using SecretPay: <ol><li> Do not interact with any payment details sent to you directly by a seller, as fraudsters may send a different invoice from the one listed on the SecretPay contract, resulting in the ETH not being unlocked when paid.</li> <li>Ask the seller to provide the newly created SecretPay contract, which will have it's details loaded below if it was created using the verified SecretPay contract creator.</li><li>Make sure that the oracles chosen by the seller are SecretPay Verified, as noted in the below table. Should the seller input dummy Chainlink node details and the payment is affected from your end, there may be no way of redeeming the ETH if the Chainlink nodes are not responding.  </li></ol>  </h5><BuyerInteraction/></div> 
          </div>
          
          {/* Step 3: Find and verify contract
          <div class={classes.steps}>
          <Typography variant="h5" component="h2">
          <div><ContractSearch/></div>;
          </Typography><br/>
          </div> */}
        </Grid>
      </div>
      </div>
    </div>
  );
}
