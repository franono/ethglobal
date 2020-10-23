import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Visibility from '@material-ui/icons/Visibility';
import FormControl from '@material-ui/core/FormControl';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing(1),
  },
}));

export default function OutlinedInputAdornments() {
  const classes = useStyles();
  const [values, setValues] = React.useState({
    ETH: 'eg. 1.54',
    address: 'eg. 0x123456...',
  });

  const handleChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value });
  };

  return (

    <div className={classes.margin}>
    
        <FormControl>
      <TextField
        id="outlined-adornment-amount"
        className={clsx(classes.margin, classes.textField)}
        label="ETH Amount"
        placeholder={values.ETH}
        variant="filled"
        InputLabelProps={{
          shrink: true,
        }}
        onChange={handleChange('amount')}
     
        />
        </FormControl>
         <TextField
        id="full-width-text-field"
        className={clsx(classes.margin, classes.textField)}
        label="Buyer ETH Address"
        placeholder={values.address}
        variant="filled"
        InputLabelProps={{
          shrink: true,
        }} 
        fullwidth
        style = {{width: 380}}
        onChange={handleChange('address')}/>
        
  </div>
   
  );
}
