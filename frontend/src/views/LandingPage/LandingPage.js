import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import NavPills from "components/NavPills/NavPills.js";
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Parallax from "components/Parallax/Parallax.js";


import styles from "assets/jss/material-kit-react/views/landingPage.js";

// Sections for this page
import ProductSection from "./Sections/ProductSection.js";

// @material-ui/icons
import Camera from "@material-ui/icons/Camera";
import Palette from "@material-ui/icons/Palette";
import SellSteppers from "sellStepper";
import Comparison from "./Sections/Comparison";


import bannerstyles from "assets/jss/material-kit-react/components/parallaxStyle.js";


const dashboardRoutes = [];

const useStyles = makeStyles(styles);
const useBannerStyles = makeStyles(bannerstyles);

export default function LandingPage(props) {
  
  const classes = useStyles();
  const bannerclasses = useBannerStyles();
  const navImageClasses = classNames(classes.imgRounded, classes.imgGallery);
  const { ...rest } = props;
  return (
    <div>
      <Header
        color="white"
        routes={dashboardRoutes}
        brand="SecretPay"
        rightLinks={<HeaderLinks />}
        fixed
        // changeColorOnScroll={{
        //   height: 400,
        //   color: "white"
        // }}
        {...rest}
      />
      <Parallax filter image={require("./landing-bg.png")} style={{"background-size": "cover"}}>
      {/* <div  className={bannerclasses.parallax} > */}
        <div className={classes.container}>
          <GridContainer>
            <GridItem xs={12} sm={12} md={6}>
              <h2 className={classes.title}>Decentralized and private escrow agreements for FIAT/ETH trading</h2>
              <h4>
              Powered by the Ethereum Ropsten testnet blockchain, Blockstack network and Chainlink oracles.
              </h4>
              <br />
              <Button
                color="danger"
                size="lg"
                href="#how"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fas fa-play" />
                <a href="#how" style={{color:'#FFF'}}>
              Trade
              </a>
              </Button>
            </GridItem>
          </GridContainer>
        </div>
      {/* </div> */}
      </Parallax>
      <div className={classNames(classes.main, classes.mainRaised)}>      
        <div className={classes.container}>
          <ProductSection />       
          <Comparison />  
        </div>
        <Footer />
      </div>
    </div>
    );
}
