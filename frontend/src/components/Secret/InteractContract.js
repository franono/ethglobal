import React,{ Component } from 'react';

import { makeStyles, withStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';

import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import NavigationIcon from '@material-ui/icons/Navigation';
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
var contractFactoryAddress = '0x8CE54Ac25f7Bd776daEEe0b7BA0015BF3F2c5907';

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
const Factory_ABI = require('ABI/Secret_Factory.json');
const Agreement_ABI = require('ABI/Secret_Agreement.json');

function createData(operator, oracle, job) {
    return { operator, oracle, job };
};

var SecretPay;
var ChainlinkContractAddress = '0x20fE562d797A42Dcb3399062AE9546cd06f63280';
var ChainlinkContract;
var contractAddress;
var SecretPayFactory;
var linkPerOracle = 1;

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
                    //SecretPay = new web3.eth.Contract(abiSecretPay, contractAddress);
                    ChainlinkContract  = new web3.eth.Contract(ERC20_ABI, ChainlinkContractAddress);
					SecretPayFactory = new web3.eth.Contract(Factory_ABI, contractFactoryAddress);

                    SecretPayFactory.events.contractDeployed(function(error, result){
						if (!error){
							var SecretPayAddress = result.returnValues.SecretPayAddress;
                            console.log(result)
							this.setState({ newSecretPayAddress: SecretPayAddress });
                            console.log(SecretPayAddress)
                            this.loadSecretPayContract(SecretPayAddress)
						} else {
							console.log(error);
						}
						
					}.bind(this));
                        
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

    //Function to fund the contract with LINK
    onClickFund = async (event) =>{
        try{	
            this.getAccounts();        
            ChainlinkContract.methods.transfer(
                this.state.newSecretPayAddress, 
                web3.utils.toHex(this.state.oracles.length * linkPerOracle * Math.pow (10, 18))).send( {
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

    showPaymentLink()
    {
        if (this.state.paymentMethod === 'paypal'){
            return "https://www.paypal.com/invoice/p/#" + this.state.invoiceID;         
           }
        else if (this.state.paymentMethod === 'revolut'){
            return "https://rev.money/r/" + this.state.invoiceID;
        }else{ 
            return "";
        }
    }
    showRedeemed()
    { 
         if (this.state.released){
            return "Funds released to address " + this.state.buyerAddress;
        }else if(this.state.released === false){
            return "Not released";
        }else {
            return " ";         
        }

    }

	async loadSecretPayContract(SecretPayAddress){
		try{
			SecretPay = new web3.eth.Contract(Agreement_ABI,SecretPayAddress);
			await SecretPay.methods.released().call().then(function (res) { if (res != null){this.setState({ released  : res })}}.bind(this));
			await SecretPay.methods.trueCount().call().then(function (res) {  this.setState({ trueCount  : res })}.bind(this));
			await SecretPay.methods.falseCount().call().then(function (res) { this.setState({ falseCount : res })}.bind(this));
			await SecretPay.methods.buyerKey().call().then(function (res) {  this.setState({ buyerKey : res })}.bind(this));
			await SecretPay.methods.sellerKey().call().then(function (res) {  this.setState({ sellerKey : res })}.bind(this));
			await SecretPay.methods.getnodeKeys().call().then(function (res) {  this.setState({ nodeKeys : res })}.bind(this));
			await SecretPay.methods.getmsgIDs().call().then(function (res) {  this.setState({ msgIDs : res })}.bind(this));
			await SecretPay.methods.sellerAddress().call().then(function (res) {  this.setState({ sellerAddress : res })}.bind(this));
			await SecretPay.methods.buyerAddress().call().then(function (res) {   this.setState({ buyerAddress  : res })}.bind(this));
			await SecretPay.methods.amount().call().then(function (res) { this.setState({ ethAmount : res })}.bind(this));
			await SecretPay.methods.deploymentTime().call().then(function (res) { this.setState({ deploymentTime : res })}.bind(this));
			await SecretPay.methods.getjobIds().call().then(function (res) {this.setState({ job_ids : res })}.bind(this));
			await SecretPay.methods.getoracles().call().then(function (res) {this.setState({ oracles : res })}.bind(this));
			//this.props.createHandler(SecretPayAddress,this.state.released,this.state.trueCount,this.state.falseCount,this.state.buyerKey,this.state.sellerKey,this.state.nodeKeys,this.state.arrayLength,this.state.deploymentTime,this.state.ethAmount,this.state.buyerAddress,this.state.sellerAddress,this.state.oracles,this.state.job_ids);
		}
		  // Non-DApp Browsers
		  catch {
			  this.toggleError();
		  }
        }
        
    render(){
		return(  
          <DivWithErrorHandling> 
             <h5 style={{
                textAlign: 'justify', 
                fontSize: "1rem",
                marginTop: "0px",
                marginLeft: "40px",
                marginRight: "60px",
                color: "#FFFFFF"}}>
                The created contract details will show below once it is confirmed on the Ethereum network.</h5>
                <Grid xs={11} >
                {(this.state.newSecretPayAddress != null) ? <div><Table aria-label="simple table">

                  <TableBody>                  
                    <TableRow>
                      <TableCell style={{color :"#FFFFFF"}} align="left"><b>Contract Address</b></TableCell>
                      <TableCell style={{color :"#FFFFFF"}} align="left"> {this.state.newSecretPayAddress} </TableCell>
                    </TableRow> 
                    <TableRow>  
                        <TableCell style={{color :"#FFFFFF"}} align="left"><b>ETH</b></TableCell>    
                        <TableCell style={{color :"#FFFFFF"}} align="left"> {this.state.ethAmount/1000000000000000000} </TableCell>     
                    </TableRow>     
                    <TableRow>  
                        <TableCell style={{color :"#FFFFFF"}} align="left"><b>Seller Key</b></TableCell>    
                        <TableCell style={{color :"#FFFFFF"}} align="left"> {this.state.sellerKey} </TableCell>     
                    </TableRow>     
                    <TableRow>  
                        <TableCell style={{color :"#FFFFFF"}} align="left"><b>Buyer Key</b></TableCell>    
                        <TableCell style={{color :"#FFFFFF"}} align="left"> {this.state.buyerKey} </TableCell>     
                    </TableRow>         
					{/* <TableRow>   
                        <TableCell style={{color :"#FFFFFF"}}align="left"><b>Invoice</b></TableCell>
						<TableCell style={{color :"#FFFFFF"}} align="left"> {this.showPaymentLink()} </TableCell>
					</TableRow>     */}
					<TableRow>             
                        <TableCell style={{color :"#FFFFFF"}} align="left"><b>Buyer Address</b></TableCell>
                        <TableCell style={{color :"#FFFFFF"}} align="left"> {this.state.buyerAddress} </TableCell>
                    </TableRow>    
                    <TableRow>    
                        <TableCell style={{color :"#FFFFFF"}} align="left"><b>Seller Address</b></TableCell>     
                        <TableCell style={{color :"#FFFFFF"}} align="left"> {this.state.sellerAddress} </TableCell>
                    </TableRow>    
                    <TableRow>   
                        <TableCell style={{color :"#FFFFFF"}} align="left"><b>Redeemed</b></TableCell>      
                        <TableCell style={{color :"#FFFFFF"}} align="left"> {this.showRedeemed()} </TableCell>
                    </TableRow>    
                    <TableRow>
                        <TableCell style={{color :"#FFFFFF"}} align="left"><b>Created</b></TableCell>
                        <TableCell style={{color :"#FFFFFF"}} align="left"> {this.state.deploymentTime} </TableCell>
                    </TableRow>    
                    <TableRow>
                        <TableCell style={{color :"#FFFFFF"}} align="left"><b>True Checks</b></TableCell>
                        <TableCell style={{color :"#FFFFFF"}} align="left"> {this.state.trueCount} </TableCell>
                    </TableRow>    
                    <TableRow>
                        <TableCell style={{color :"#FFFFFF"}} align="left"><b>False Checks</b></TableCell>
                        <TableCell style={{color :"#FFFFFF"}} align="left"> {this.state.falseCount} </TableCell>    
                    </TableRow>    
                </TableBody>
              </Table>
              <br></br>
              <h5 style={{
                textAlign: 'justify', 
                fontSize: "1rem",
                marginTop: "0px",
                marginLeft: "40px",
                marginRight: "60px",
                color: "#FFFFFF"}}>SecretPay contracts use Chainlink off-chain oracles for verifying PayPal invoice payments. These queries are paid with LINK. For testnet purposes, 0.3333 testnet LINK is required per oracle request. </h5>     
            <div>
            <Grid container  justify = "center" spacing={1} alignItems="flex-end">
              <Grid item>
              <br/>
              <Fab variant="extended" padding={5} onClick={this.onClickFund} aria-label="like">
                <NavigationIcon />
                Fuel Contract with {this.state.oracles.length * linkPerOracle} LINK
              </Fab>
              </Grid>
            </Grid>            
          </div></div> : ""}
          </Grid>
        </DivWithErrorHandling>
        )
    }
 }
