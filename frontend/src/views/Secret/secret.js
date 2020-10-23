import React from "react";
import classNames from "classnames";
import { makeStyles } from "@material-ui/core/styles";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import NavPills from "components/NavPills/NavPills.js";
import styles from "assets/jss/material-kit-react/views/standard.js";
import BuyForm from "views/Secret/Sections/buyForm";
import SellForm from "views/Secret/Sections/sellForm";
import Button from "components/CustomButtons/Button.js";

import particlestyles from "assets/jss/material-kit-react/views/landingPage";
import Parallax from "components/Parallax/Parallax"
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Footer from "components/Footer/footer";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/core/styles";

const useStyles = makeStyles(styles);
const pStyles = makeStyles(particlestyles);

const Theme = createMuiTheme({
	palette: {
	  primary: { main: "#FFFFFF", contrastText: "#FFFFFF" },
	  secondary: {
		main: '#FFFFFF',
	  }
	},
	overrides: {
	  MuiInput: {
		root: {
		  input : {
			color: "#FFFFFF" // if you also want to change the color of the input, this is the prop you'd use
		  }
		}
	  },
	  MuiOutlinedInput: {
		root: {
		  position: "relative",
		  "& $notchedOutline": {
			borderColor: "#FFFFFF"
		  },
		  "&:hover:not($disabled):not($focused):not($error) $notchedOutline": {
			borderColor: "#FFFFFF",
			// Reset on touch devices, it doesn't add specificity
			"@media (hover: none)": {
			  borderColor: "#FFFFFF"
			}
		  },
		  "&$focused $notchedOutline": {
			borderColor: "#FFFFFF",
			borderWidth: 1
		  }
		}
	  },
	  MuiFormLabel: {
		root: {
		  // "&$focused": {
		  color: "#FFFFFF"
		  // }
		}
	  }
	}
});


export default function Secret() {
  const classes = useStyles();
  const classesP = pStyles();

	
  const [state, setState] = React.useState(true);

  const handleImport = () => {
    setState({PrivateKey:state.PrivateKeyField})
  };

  return (
    <div className={classesP.particleswrapper}>
       <Parallax>
            <div className={classesP.container}>
            <GridContainer>
                <GridItem xs={12}>
                <h1 className={classes.title}>SecretPay Secret</h1>
                <br />
                </GridItem>
            </GridContainer>
            </div>
        </Parallax> 
      <div className={classNames(classes.main, classesP.mainRaised)}>          
      <div className={classes.container}>
          <ThemeProvider theme={Theme}>
            <GridContainer justify="center">
                <GridItem xs={12} className={classes.navWrapper}>                  
                                    
                  
                <NavPills
                    alignCenter
                    color="primary"
                    tabs={[
                    {
                        tabButton: "Sell",
                        // tabIcon: Camera,
                        tabContent: (
                          <SellForm/>                       
                        )
                    },
                    {
                        tabButton: "Buy",
                        // tabIcon: Palette,
                        tabContent: (
                          <BuyForm/>                       
                        )
                    }
                    ]}
                />
                </GridItem>
            </GridContainer>
            </ThemeProvider>
        </div>
      </div>
      <Footer />
    </div>
  );
}
