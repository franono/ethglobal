import React from "react";
import Grid from '@material-ui/core/Grid';
import CreateSecretPay from "components/Secret/CreateContract.js";
import InteractContract from "components/Secret/InteractContract.js";
import particlestyles from "assets/jss/material-kit-react/views/landingPage";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import ButtonGroup  from '@material-ui/core/ButtonGroup';
import Button from "@material-ui/core/Button";
import Web3 from 'web3';


const classes = require('assets/styles/CustomStyleOne.js');

try{
    var web3 = new Web3(window.web3.currentProvider);
  }catch {
    alert('SecretPay requires MetaMask to function.');
}

const ERC20_ABI = require('ABI/ERC20.json');
var ChainlinkContractAddress = '0x20fE562d797A42Dcb3399062AE9546cd06f63280';
var ChainlinkContract;
var newSecretPayAddress;
var newReleased;
var newTrueCount;
var newFalseCount;
var newArrayLength;
var newDeploymentTime;
var newEthAmount;
var newBuyerAddress;
var newSellerAddress;
var newInvoice_id;

var newSecretPayAddress = ''

const pStyles = makeStyles(particlestyles);

export default function CustomizedSteppers(props) {

  const [state, setState] = React.useState(true);
  const classesP = pStyles();

  function onContractCreation (SecretPayAddress,released,trueCount,falseCount,buyerKey,sellerKey,nodeKeys,arrayLength,deploymentTime,ethAmount,buyerAddress,sellerAddress,oracles,jobids){

    props.changeHandler()
    console.log({'released':released,'SecretPayAddress':SecretPayAddress,'released':released,'trueCount':trueCount,'buyerKey':buyerKey,'sellerKey':sellerKey,'nodeKeys':nodeKeys,'falseCount':falseCount,'arrayLength':arrayLength,'deploymentTime':deploymentTime,'jobids':jobids,'oracles':oracles,'ethAmount':ethAmount,'buyerAddress':buyerAddress,'sellerAddress':sellerAddress})
    setState({released:released,SecretPayAddress:SecretPayAddress,released:released,trueCount:trueCount,buyerKey:buyerKey,sellerKey:sellerKey,nodeKeys:nodeKeys,falseCount:falseCount,arrayLength:arrayLength,deploymentTime:deploymentTime,jobids:jobids,oracles:oracles,ethAmount:ethAmount,buyerAddress:buyerAddress,sellerAddress:sellerAddress})
  }

  return (
    <div id="selling" className={classes.section}>
      <div className={classNames(classesP.submain, classesP.submainRaised)}>  
        <div className={classesP.container}>
          <Grid justify = "center">
            <br></br>
            <h5 className={classesP.title2}>1: Find a Buyer</h5>
            <div class={classesP.subtitle2}>
                    <h5>SecretPay does not yet offer order matching, however you may find a trader looking to buy ETH at the following forums: 
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
                      <br></br>
                      <h3 style={{textAlign:"justify"}}>
                        The use of this website and the online services is entirely at your own risk. 
                        You assume full responsibility for the risk or loss resulting from your use of this site
                        and your reliance on the material and information contained on it.</h3>
                    </h5>
                </div>
                <h5 className={classesP.title2}>2: Create an Invoice</h5>
                <div class={classesP.subtitle2}>
                        PayPal Invoice:
                        <br></br> 
                        (WARNING HIGH RISK OF CHARGEBACK SCAMS)
                        <ol>
                            <li> <Button variant="contained" size = "Large" fullWidth = "true" color="inherited" href="https://www.paypal.com/invoice/create"> Go here and add an item with your sale value. </Button> </li>
                            <br></br>
                            <li>Mouse over the SEND button at the bottom of the Create Invoice page and select Share link myself.</li>
                            <br></br>
                            <li>Obtain the paypal.com/invoice/p/#INVOICE-ID link and take note of the invoice ID without the # (eg. ABCDEFGHIC9BJR2Y).</li>
                        </ol>
                        Revolut Invoice:
                        <br></br> 
                        <ol>
                            <li>Open the Revolut app on Android or iOS.</li>
                            <br></br>       
                            <li>Access the Request tab on the Payments page.</li>
                            <br></br> 
                            <li>Select Payment Link to create a payment link of your desired FIAT amount.</li>
                            <br></br> 
                            <li>Click Create Payment and obtain the rev.money/r/REQUEST-ID payment link shown.</li>
                            <br></br> 
                            <li>Take note of the REQUEST-ID, being a combination of letters and numbers.</li>
                        </ol>   
                </div>
                <br></br>
                <h5 className={classesP.title2}>3: Create an Agreement</h5>
                <div class={classes.steps}>
                  <CreateSecretPay createHandler={onContractCreation}/>
                </div>
                <br></br>
                <h5 className={classesP.title2}>4: Fund contract with LINK</h5>
                <div class={classes.steps}>
                <InteractContract newSecretPayAddress={state.SecretPayAddress}  ethAmount={state.ethAmount}  paymentMethod={state.paymentMethod}  trueCount={state.trueCount}  falseCount={state.falseCount}  released={state.released}  sellerAddress ={state.sellerAddress }  buyerAddress  ={state.buyerAddress  }  deploymentTime ={state.deploymentTime } jobIds ={state.job_ids } oracles={state.oracles}/>
                </div>
                <br></br>
                <h5 className={classesP.title2}>5: Interacting with buyer</h5>
                 <div class={classesP.subtitle2}>
                  <h5>Now that you have your contract set up:
                   <ul>
                     <li>Inform the buyer that the ETH is in lock up pending their payment</li>
                     <li>If payment is not done within 24 hours of deployment, you may withdraw your ETH and LINK.</li>
                     <li>Once payment is done, the oracles must be queried through the menu in the the Buying section to confirm and send the ETH to the buyer. </li>
                    </ul>
                  </h5>
                  <br></br>
                </div>
              </Grid>
          </div>
      </div>
    </div>
  );
}
