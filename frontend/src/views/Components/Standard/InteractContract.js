import React,{ Component } from 'react';

import { makeStyles, withStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';

import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import NavigationIcon from '@material-ui/icons/Navigation';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import Web3 from 'web3';


//Factory Contract Address Ropsten Factory = 0xd770fa5b25ce0c48ccfbd925b753322c1f69bcb3
var contractFactoryAddress = '0x3BF6e2e7B2AfC7032fF628e301034Ae387A3bE95';

const withErrorHandling = WrappedComponent => ({ showError, children }) => {
  return (
    <WrappedComponent>
      {showError && <div className="error-message">Oops! Something went wrong! Install MetaMask and refresh.</div>}
      {children}
    </WrappedComponent>
  );
};

try{
	var web3 = new Web3(window.web3.currentProvider);
}catch {
	alert('SecretPay requires MetaMask to function.');
}

const DivWithErrorHandling = withErrorHandling(({children}) => <div>{children}</div>)
const ERC20_ABI = require('ABI/ERC20.json');


const verifiedOracles = [
    createData('Simply', '0x0D31C381c84d94292C07ec03D6FeE0c1bD6e15c1', '7a952e01d59545dd9ca00f667becb0b0','PayPal'),
    createData('Simply', '0x0D31C381c84d94292C07ec03D6FeE0c1bD6e15c1', '7a952e01d59545dd9ca00f667becb0b0','PayPal'),
    createData('Simply', '0x0D31C381c84d94292C07ec03D6FeE0c1bD6e15c1', '7a952e01d59545dd9ca00f667becb0b0','PayPal'),
    createData('Simply', '0x0D31C381c84d94292C07ec03D6FeE0c1bD6e15c1', '7a952e01d59545dd9ca00f667becb0b0','Revolut'),
    createData('Simply', '0x0D31C381c84d94292C07ec03D6FeE0c1bD6e15c1', '7a952e01d59545dd9ca00f667becb0b0','Revolut'),
    createData('Simply', '0x0D31C381c84d94292C07ec03D6FeE0c1bD6e15c1', '7a952e01d59545dd9ca00f667becb0b0','Revolut'),
  ];
  
function createData(operator, oracle, job,method) {
	return { operator, oracle, job ,method};
};


var SecretPay;
var ChainlinkContractAddress = '0x20fE562d797A42Dcb3399062AE9546cd06f63280';
var ChainlinkContract;
var contractAddress;
var linkFee = 1/3;
export default class ContractInteraction extends React.Component {
    state ={
        SecretPayAddress : '',
        trueCount : null,
        falseCount : null,
        ethAmount : null,
        invoice_id : '',
        sellerAddress : '',
        buyerAddress : '',
        released : null,	
        paymentMethod:'',
        oracles : [],
        job_ids : [],
        deploymentTime : '',
        showError :false,
        loading: false,
        newSecretPayAddress : null,
        arrayLength : null,
    };   
  	
    componentDidUpdate(nextProps) {
        this.props = nextProps;
       }

    async loadChainlinkContract(){
        try{
        ChainlinkContract  = new web3.eth.Contract(ERC20_ABI, ChainlinkContractAddress);
        }
        // Non-DApp Browsers
        catch {
            this.toggleError();
        }
    }

    getAccounts = () =>{
        web3.eth.getAccounts().then(accounts => { 
                
            this.setState({ account: accounts[0]});
            console.log(accounts);
        
        });}

    //Loads the web3 Metamask confirmations and Checks for Events
	async loadBlockChain() {
		// Modern DApp Browsers
		if (window.ethereum) {
			web3 = new Web3(window.ethereum);
            this.getAccounts();
			try { 
				window.ethereum.enable().then(function() {
					//Set State When recieve Emission from Event from Smart Contract
                    //SecretPay = new web3.eth.Contract(Agreement_ABI, contractAddress);
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
            this.getAccounts();
		}
		// Non-DApp Browsers
		else {
            this.toggleError();
		}
	}
        
	toggleError = () => {
		this.setState((prevState, props) => {
		return { showError: true }
		})
    };
    
    async componentWillMount(){
		this.loadBlockChain()
        this.loadChainlinkContract();
    }

    linkFeeCalculator(){

        if (this.props.jobIds != null){
            return this.props.jobIds.length * linkFee;
        }
        else{
            return "?";
        }
    }
    //Function to fund the contract with LINK
    onClickFund = async (event) =>{        
        try{	
            this.getAccounts();        
            ChainlinkContract.methods.transfer(
                this.props.newSecretPayAddress, 
                web3.utils.toHex(this.linkFeeCalculator() * Math.pow (10, 18))).send( {
                from: this.state.account
                }, 
                (error, txHash) => {
                console.log(txHash);
                });
        
        }catch(err){
            console.log(err)
            this.toggleError();
        }
    }    
	
	methodFinder (){
     
    if (this.props.jobIds != null){

		if (this.props.jobIds.length > 0 && verifiedOracles.length > 0){
		var foundIndex = verifiedOracles.findIndex(x => (x.job === this.props.jobIds[0]));
		console.log("inde " + foundIndex)
		  if (foundIndex !== -1){
			
			console.log("2 " + verifiedOracles[foundIndex].method)
			if (verifiedOracles[foundIndex].method === 'PayPal'){
				return "https://www.paypal.com/invoice/p/#" + this.props.invoiceID;         
			   }
			else if (verifiedOracles[foundIndex].method === 'Revolut'){
				return "https://rev.money/r/" + this.props.invoiceID;		

		  }
		}

	
      }
    }

	  return "Unknown";
    }
    
    showPaymentLink()
    {
        if (this.props.paymentMethod === 'paypal'){
            return "https://www.paypal.com/invoice/p/#" + this.props.invoiceID;         
           }
        else if (this.props.paymentMethod === 'revolut'){
            return "https://rev.money/r/" + this.props.invoiceID;
        }else{ 
            return "";
        }
    }
    showRedeemed()
    { 
         if (this.props.released){
            return "Funds released to address " + this.props.buyerAddress;
        }else if(this.props.released === false){
            return "Not released";
        }else {
            return " ";         
        }

    }

    render(){
        
        //Run this bitch
        //this.loadBlockChain();
		return(  
          <DivWithErrorHandling> 
              <h5>The created contract details will show below once it is confirmed on the Ethereum network.</h5>     
          {/* <div className={classes}> */}
          {(this.props.newSecretPayAddress != null) ? <div><Table aria-label="simple table">
                  <TableBody>                  
                    <TableRow>
                      <TableCell align="left"><b>Contract Address</b></TableCell>
                      <TableCell align="left"> {this.props.newSecretPayAddress} </TableCell>
                    </TableRow> <TableRow>  
                    <TableCell align="left"><b>ETH</b></TableCell>    
                    <TableCell align="left"> {this.props.ethAmount/1000000000000000000} </TableCell>     
                             </TableRow>         
                    <TableRow> 
                    <TableCell align="left"><b>Payment method</b></TableCell>
						<TableCell align="left"> {this.methodFinder()} </TableCell>
                    </TableRow>    
					{/* <TableRow>   
                    <TableCell align="left"><b>Invoice</b></TableCell>
						<TableCell align="left"> {this.showPaymentLink()} 
                        </TableCell>
					</TableRow>     */}
					<TableRow>             
                    <TableCell align="left"><b>Buyer Address</b></TableCell>
                      <TableCell align="left"> {this.props.buyerAddress} </TableCell>
                             </TableRow>    
                    <TableRow>    
                    <TableCell align="left"><b>Seller Address</b></TableCell>     
                      <TableCell align="left"> {this.props.sellerAddress} </TableCell>
                             </TableRow>    
                    <TableRow>   
                    <TableCell align="left"><b>Redeemed</b></TableCell>      
                      <TableCell align="left"> {this.showRedeemed()} </TableCell>
                             </TableRow>    
                    <TableRow>
                    <TableCell align="left"><b>Created</b></TableCell>
                      <TableCell align="left"> {this.props.deploymentTime} </TableCell>
                             </TableRow>    
                    <TableRow>
                    <TableCell align="left"><b>True Checks</b></TableCell>
                      <TableCell align="left"> {this.props.trueCount} </TableCell>
                             </TableRow>    
                    <TableRow>
                    <TableCell align="left"><b>False Checks</b></TableCell>
                      <TableCell align="left"> {this.props.falseCount} </TableCell>    
                             </TableRow>    
                </TableBody>
              </Table>
              
              <h5>SecretPay contracts use Chainlink off-chain oracles for verifying PayPal invoice payments. These queries are paid with LINK. For testnet purposes, 0.3333 testnet LINK is required per oracle request. </h5>     
              <div>
        <Grid container  justify = "center" spacing={1} alignItems="flex-end">             
              
              <Grid item>     
              <Fab variant="extended" padding={5} onClick={this.onClickFund} aria-label="like">
                <NavigationIcon />
                Fuel Contract with {(this.props.jobIds.length*linkFee).toFixed(3)} LINK
              </Fab>
              </Grid> 
            </Grid>            
            </div></div> : ""}
        </DivWithErrorHandling>
        )
    }
 }
