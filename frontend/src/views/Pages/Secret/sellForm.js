import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import Grid from '@material-ui/core/Grid';
import Check from "@material-ui/icons/Check";
import CreateSecretPay from "views/Components/Secret/CreateContract.js";
import InteractContract from "views/Components/Secret/InteractContract.js";
import Typography from "@material-ui/core/Typography";
import { Link } from 'react-router-dom';

import Web3 from 'web3';
import Divider from '@material-ui/core/Divider';

//Import custom style
const useQontoStepIconStyles = require('assets/styles/IconStyle.js');
const useStyles = require('assets/styles/CustomStyleOne.js');

try{
    var web3 = new Web3(window.web3.currentProvider);
  }catch {
    alert('SecretPay requires MetaMask to function.');
}

const ERC20_ABI = require('ABI/ERC20.json');
var ChainlinkContractAddress = '0x20fE562d797A42Dcb3399062AE9546cd06f63280';
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


var newSecretPayAddress = ''

  function getAccounts(){
    web3.eth.getAccounts().then(accounts => { 
            
        this.setState({ account: accounts[0]});
        console.log(accounts);
    
    });}

      //Loads the web3 Metamask confirmations and Checks for Events
	async function loadBlockChain() {
		// Modern DApp Browsers
		if (window.ethereum) {
			web3 = new Web3(window.ethereum);
      getAccounts();
			try { 
				window.ethereum.enable().then(function() {
					//Set State When recieve Emission from Event from Smart Contract
                    //SecretPay = new web3.eth.Contract(abiSecretPay, contractAddress);
                    ChainlinkContract  = new web3.eth.Contract(ERC20_ABI, ChainlinkContractAddress);
                    //this.setState({ SecretPayState : SecretPay });
				}.bind(this));
			} catch(e) {
                // User has denied account access to DApp...
                console.log(e);
			}
		}
		// Legacy DApp Browsers
		else if (window.web3) {
			web3 = new Web3(window.web3.currentProvider);
      getAccounts();
		}
		// Non-DApp Browsers
		else {
            this.toggleError();
		}
  }

export default function CustomizedSteppers(props) {

  const [state, setState] = React.useState(true);

  
  
  function onContractCreation (SecretPayAddress,released,trueCount,falseCount,arrayLength,deploymentTime,ethAmount,buyerAddress,sellerAddress,invoice_id){
    newSecretPayAddress = SecretPayAddress;
    newReleased = released;
    newTrueCount=trueCount;
    newFalseCount=falseCount;
    newArrayLength=arrayLength;
    newDeploymentTime=deploymentTime;
    newEthAmount=ethAmount;
    newBuyerAddress=buyerAddress;
    newSellerAddress=sellerAddress;
    newInvoice_id=invoice_id;

    props.changeHandler()
    props.encryptInvoice()
    

    setState({released:newReleased,SecretPayAddress:newSecretPayAddress,released:newReleased,trueCount:newTrueCount,falseCount:newFalseCount,arrayLength:newArrayLength,deploymentTime:newDeploymentTime,ethAmount:newEthAmount,buyerAddress:newBuyerAddress,sellerAddress:newSellerAddress,invoice_id:newInvoice_id})
  // newOracleCount = oracleCount;
  }
  
  const classes = useStyles();

  return (
    
    <div id="selling" className={classes.section}>
      
      <div>    
          <div>

            <Grid container justify = "center" className={classes.grid}>
              {/* <Paper className={classes.root}> */}
                <Typography variant="h5" component="h3">
                Step 1: Find a buyer
                </Typography><br/>
                <div class={classes.steps}><h5>SecretPay does not yet offer order matching, however you may find a trader looking to buy ETH at the following forums: <ul><li><a href="https://www.reddit.com/r/SecretPay/">SecretPay subreddit</a></li><li><a href="https://t.me/joinchat/E8SAPEUVQHSiKjSyGWkf9g">SecretPay Telegram group</a></li></ul></h5> </div>
                <Divider variant="middle" />
                <Typography variant="h5" component="h2">
                Step 2: Create a FIAT payment link
                </Typography><br/>
                <div class={classes.steps}>
                Creating a PayPal invoice: <br/>
                <ol><li>Go to <Link to="//www.paypal.com/invoice/create">https://www.paypal.com/invoice/create</Link> and add an item with your sale value.</li>         
                <li><div>Mouse over the Send button at the bottom of the Create Invoice page and select Share link myself.</div></li>
                <li><div>Obtain the paypal.com/invoice/p/#INVOICE-ID link and take note of the invoice ID without the # (eg. ABCDEFGHIC9BJR2Y).</div></li>
                </ol>     
                Creating a Revolut payment link: <br/>
                <ol><li>Open the Revolut app on Android and iOS.</li>         
                <li><div>Access the Request tab on the Payments page.</div></li>
                <li><div>Select Payment Link to create a payment link of your desired FIAT amount.</div></li>
                <li><div>Click Create Payment and obtain the rev.money/r/REQUEST-ID payment link shown.</div></li>
                <li><div>Take note of the request ID, being a combination of letters and numbers.</div></li>
                </ol>   
                </div>
                <Typography variant="h5" component="h3">
                Step 3: Create a SecretPay smart contract
                </Typography><br/>
                <div class={classes.steps}>
                <div><CreateSecretPay createHandler={onContractCreation}/></div>;
                </div>
                <Typography variant="h5" component="h3">
                Step 4: Fund contract with LINK
                </Typography><br/>
                <div class={classes.steps}>
                <InteractContract newSecretPayAddress={state.SecretPayAddress}  ethAmount={state.ethAmount}  paymentMethod={state.paymentMethod}  invoiceID={state.invoice_id}  trueCount={state.trueCount}  falseCount={state.falseCount}  released={state.released}  sellerAddress ={state.sellerAddress }  buyerAddress  ={state.buyerAddress  }  deploymentTime ={state.deploymentTime } arrayLength ={state.arrayLength }/>
               </div>
                 <Typography variant="h5" component="h3">
                Step 5: Interacting with buyer
               </Typography><br/>  
               <div  class={classes.steps}><h5>Now that you have your contract set up:<ul><li>Inform the buyer that the ETH is in lock up pending their payment</li><li>If payment is not done within 24 hours of deployment, you may withdraw your ETH and LINK.</li><li>Once payment is done, the oracles must be queried through the menu in the the Buying section to confirm and send the ETH to the buyer. </li></ul></h5></div>;
              </Grid>
          </div>
        
      </div>
    </div>
  );
}
