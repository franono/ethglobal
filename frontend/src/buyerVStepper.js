import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import clsx from 'clsx';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(theme => ({
  root: {
    width: '90%',
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
}));

function getSteps() {
  return ["Find a seller", "Confirm details with seller"];
}

function getStepContent(step,classes) {
  switch (step) {
    case 0:
      return <div><h5>Find a trader looking to sell ETH through Paypal on: <ul><li><a href="http://www.reddit.com/r/SecretPay/">SecretPay subreddit</a></li><li><a href="https://t.me/joinchat/E8SAPEUVQHSiKjSyGWkf9g">SecretPay Telegram group</a></li></ul></h5></div> 
      case 1:
      return <div><h5><ol><li>Your ETH address to receive purchased ETH</li><li>ETH amount</li></ol></h5></div> 
     
    default:
      return 'Unknown step';
  }
}

export default function VerticalLinearStepper() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
              <Typography>{getStepContent(index,classes)}</Typography>


            {activeStep === steps.length - 1 ? '' : 
              <div className={classes.actionsContainer}>
                <div>
                  <Button
                    disabled={activeStep === 0}
                    hidden={activeStep === steps.length-1}
                    onClick={handleBack}
                    className={classes.button}
                  >
                    Back
                  </Button>

                  <Button
                   hidden={activeStep === steps.length-1}
                   // variant="contained"
                    color="primary"
                    onClick={handleNext}
                    className={classes.button}
                  >
                    Next
                  </Button>
                </div>
              </div>
            }



            </StepContent>
          </Step>
        ))}
      </Stepper>
      {/* {activeStep === steps.length && (
        <Paper square elevation={0} className={classes.resetContainer}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} className={classes.button}>
            Reset
          </Button>
        </Paper>
      )} */}

    </div>
  );
}
