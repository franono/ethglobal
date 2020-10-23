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
  return ["Visit PayPal.com", "Create shareable invoice", 'Obtain invoice ID'];
}

function getStepContent(step,classes) {
  switch (step) {
    case 0:
      return <div>Go to <Link to="//www.paypal.com/invoice/create">https://www.paypal.com/invoice/create</Link> and add an item with your sale value.</div>
    case 1:
      return <div>Mouse over the <b>Send</b> button at the bottom of the Create Invoice page and select <b>Share link myself</b>.</div>
    case 2:
        return <div>Obtain the paypal.com/invoice/p/#<b>INVOICE-ID</b> link and save the invoice ID without the # (eg. ABCDEFGHIC9BJR2Y). <br/> <br/>
            
      {/* <TextField
        id="outlined-adornment-amount"
        className={clsx(classes.margin, classes.textField)}
        label="PayPal invoice"
        placeholder={"https://www.paypal.com/invoice/p/#ABCD..."}
        variant="filled"
        InputLabelProps={{
          shrink: true,
        }}
        style = {{width: 450, marginbottom:10}}
        
        />  */}
        </div>;

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
