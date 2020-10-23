import React from "react";
import PropTypes from "prop-types";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import Grid from '@material-ui/core/Grid';
import StepLabel from "@material-ui/core/StepLabel";
import Check from "@material-ui/icons/Check";
import SettingsIcon from "@material-ui/icons/Settings";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import VideoLabelIcon from "@material-ui/icons/VideoLabel";
import CreateSecretPay from "views/Components/Standard/CreateContract.js";
import InteractContract from "views/Components/Standard/InteractContract.js";
import StepConnector from "@material-ui/core/StepConnector";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Input2 from "boxes"
import styles from "assets/jss/material-kit-react/components/typographyStyle.js";
import { Link } from 'react-router-dom';
import PaypalInvoiceStepper from './verticalStepper'
import Paper from '@material-ui/core/Paper';

const useQontoStepIconStyles = makeStyles({
  root: {
    color: "#eaeaf0",
    display: "flex",
    height: 22,
    alignItems: "center"
  },
  active: {
    color: "#784af4"
  },
  circle: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "currentColor"
  },
  completed: {
    color: "#784af4",
    zIndex: 1,
    fontSize: 18
  }
});


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

const ColorlibConnector = withStyles({
  alternativeLabel: {
    top: 22
  },
  active: {
    "& $line": {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)"
    }
  },
  completed: {
    "& $line": {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)"
    }
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: "#eaeaf0",
    borderRadius: 1
  }
})(StepConnector);


var newSecretPayAddress = ''
var newOracleCount = 0

function onContractCreation (address,oracleCount){
  newSecretPayAddress = address;
  newOracleCount = oracleCount;
}

// function toggleNextEnabled (){
//   nextEnabled= !nextEnabled;
// }

const useColorlibStepIconStyles = makeStyles({
  root: {
    backgroundColor: "#ccc",
    zIndex: 1,
    color: "#fff",
    width: 50,
    height: 50,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center"
  },
  active: {
    backgroundImage:
      "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)"
  },
  completed: {
    backgroundImage:
      "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)"
  }
});

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
  }
}));

function getSteps() {
  return ["Find a buyer", "Create a PayPal invoice", "Create contract","Fuel contract", "Interacting with buyer"];
}

function getStepContent(step,handleChange) {
  switch (step) {
    case 0:
      return <div><h5>Find a trader looking to buy ETH through Paypal on: <ul><li><a href="https://www.reddit.com/r/SecretPay/">SecretPay subreddit</a></li><li><a href="https://t.me/joinchat/E8SAPEUVQHSiKjSyGWkf9g">SecretPay Telegram group</a></li></ul></h5> 
       {/* <Input2/> */}
       </div>;
    case 1:
      return <div><PaypalInvoiceStepper/></div>;
    case 2:
      return <div><CreateSecretPay createHandler={onContractCreation} toggleNextEnabled={handleChange}/></div>;
    case 3:
      return <div><InteractContract newSecretPayAddress={newSecretPayAddress} newOracleCount={newOracleCount}/></div>;
    case 4:
      return <div><h5>Now that you have your contract set up:<ul><li>Inform the buyer that the ETH is in lock up pending their payment</li><li>If payment is not done within 24 hours of deployment, you may withdraw your ETH and LINK.</li><li>Once payment is done, the oracles must be queried through the menu in the the Buying section to confirm and send the ETH to the buyer. </li></ul></h5></div>;
    default:
      return "Unknown step";
  }
}

export default function CustomizedSteppers(props) {

  const [nextEnabled, setNextEnabled] = React.useState(true);
  
  const handleChange = () => 
      {
        setNextEnabled(!nextEnabled)
      };


  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const handleNext = () => {
    //when moving onto the create contract step, grey out the button
    if (activeStep==1){
      handleChange();
    }
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {

    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    
    <div id="selling" className={classes.section}>
      <Stepper
        alternativeLabel
        activeStep={activeStep}
        connector={<ColorlibConnector />}
      >
        {steps.map(label => (
          <Step key={label}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>
              All steps completed - you&apos;re finished
            </Typography>
            <Button onClick={handleReset} className={classes.button}>
              Reset
            </Button>
          </div>
        ) : (
          
          <div>

            <Grid container justify = "center" className={classes.grid}>
              <Paper className={classes.root}>
                <Typography variant="h5" component="h3">
                {getStepContent(activeStep,handleChange)}
                </Typography>
                {/* <Typography component="p">
                  Paper can be used to build surface or other elements for your application.
                </Typography> */}
              </Paper></Grid>
            
            <Grid container justify = "center">
            <div>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.button}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                disabled={!nextEnabled}
                onClick={handleNext}
                className={classes.button}
              >
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </div></Grid>
          </div>
        )}
      </div>
    </div>
  );
}
