import React from 'react';
import bannerstyles from "assets/jss/material-kit-react/components/parallaxStyle";
import { makeStyles } from "@material-ui/core/styles";
import Parallax from "components/Parallax/Parallax";
import styles from "assets/jss/material-kit-react/views/landingPage";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import classNames from "classnames";
import ProductSection from "./Sections/ProductSection.js";
import Comparison from "./Sections/Comparison";
import ParticlesContainer from "assets/jsassets/particles";
import PoweredBy from './Sections/PoweredBy';
import Footer from "components/Footer/footer";

const useStyles = makeStyles(styles);


function HomePage(){
    const classes = useStyles();
    return (
        <div
            className={classes.particleswrapper}
        >
        <Parallax>
            <div className={classes.container}>
            <GridContainer>
                <GridItem xs={12}>
                <h1 className={classes.title}>Decentralized and private escrow agreements for FIAT/ETH trading</h1>
                <br />
                </GridItem>
            </GridContainer>
            </div>
        </Parallax> 
        <div className={classNames(classes.main, classes.mainRaised)}>      
        <div className={classes.container}>
          <ProductSection />       
          <Comparison />  
          <PoweredBy />
        </div>
        </div>
        <Footer />
        </div>
    );
}

export default HomePage;