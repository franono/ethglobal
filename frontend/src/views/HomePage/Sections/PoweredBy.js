import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import chainlink from "assets/img/chainlinkLogo.jpg";
import blocsktack from "assets/img/blockstack.png";
import Ethereum from "assets/img/ethereum.png";
import styles from "assets/jss/material-kit-react/views/landingPageSections/teamStyle.js";
import imgstyles from "assets/jss/material-kit-react/imagesStyles.js";

const useStyles = makeStyles(styles);
const useImgStyles = makeStyles(imgstyles);

export default function PoweredBy() {
  const classes = useStyles();
  const imgClasses = useImgStyles();

  const imageClasses = classNames(
    classes.imgRaised,
    classes.imgRoundedCircle,
    classes.imgFluid
  );
  return (
    <div className={classes.section}>
      <h2 className={classes.title}>Powered By</h2>
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={4}>
            <Card plain>
              <GridItem xs={12} sm={12} md={6} className={classes.itemGrid}>
                </GridItem>
                  <CardBody>
                  <h2 className={classes.cardTitle}>
                    Chainlink
                  </h2>
                  <img className={imgClasses.imgSize} src={chainlink}/>
                    <p className={classes.description}>
                      ChainLink is a platform which attempts to bridge the gap between smart contracts on the blockchain and real-world applications.
                      Learn more here <a href="https://chain.link/">Chainlink Website</a>.
                    </p>
                  </CardBody>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <Card plain>
              <GridItem xs={12} sm={12} md={6} className={classes.itemGrid}>
               </GridItem>
                <CardBody>
                  <h2 className={classes.cardTitle}>
                    Blockstack
                  </h2>
                  <img className={imgClasses.imgSize} src={blocsktack}/>
                    <p className={classes.description}>
                    Blockstack is a new blockchain-based, decentralized internet platform where users completely
                    own and control their data, and the network apps that may use the data are run locally on the user's browser.
                    Learn more here <a href="https://blockstack.org/">Blockstack Website</a>.
                    </p>
                </CardBody>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <Card plain>
              <GridItem xs={12} sm={12} md={6} className={classes.itemGrid}>
               </GridItem>
                <CardBody>
                    <h2 className={classes.cardTitle}>
                      Ethereum
                    </h2>
                    <img className={imgClasses.imgSize} src={Ethereum}/>
                      <p className={classes.description}>
                      Ethereum is an open-source, blockchain-based, decentralized software platform used for its own cryptocurrency,
                      ether. It enables SmartContracts and Distributed Applications (ĐApps) to be built and run without any downtime,
                      fraud, control, or interference from a third party.
                      Learn more here <a href="https://ethereum.org/">Ethereum Website</a>.
                      </p>
                  </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    </div>
  );
}
