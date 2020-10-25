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

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';



import Web3 from 'web3';

//Factory Contract Address Ropsten Factory = 0xd770fa5b25ce0c48ccfbd925b753322c1f69bcb3
var contractFactoryAddress = '0x38121Ff9f35a4a5D3aA5A02ca674975D1Bf1c2B2';

const withErrorHandling = WrappedComponent => ({ showError, children }) => {
  return (
    <WrappedComponent>
      {showError && <div className="error-message">Oops! Something went wrong! Install MetaMask and refresh.</div>}
      {children}
    </WrappedComponent>
  );
};

// TODO:
// Ability to search
// Get all SecretPay addresses with address X
// 1 Table per address found
// Interact with contract: click on paypal link, send redeem function


//var web3 = new Web3();
//const web3 = new Web3(window.web3.currentProvider); //Use provider from MetaMask
var web3;

const DivWithErrorHandling = withErrorHandling(({children}) => <div>{children}</div>)

const Agreement_ABI = require('ABI/Secret_Agreement.json');
const ERC20_ABI = require('ABI/ERC20.json');


function createData(operator, oracle, job) {
  return { operator, oracle, job };
};

var SecretPayFactory;
var SecretPay;
var ChainlinkContractAddress = '0x20fE562d797A42Dcb3399062AE9546cd06f63280';
var ChainlinkContract;
var contractAddress;
var linkFee = 1;
var linkPerOracle = 0.2;

export default class ContractSearch extends React.Component {

	state ={
		currentContract : '',
        SecretPayAddress : '',
        trueCount : null,
        falseCount : null,
		ethAmount : null,
		invoice_id : '',
        sellerAddress : '',
        buyerAddress : '',
		released : false,	
		oracles : [],
		job_ids : [],
		contracts:[],
        deploymentTime : '',
		showError :false,
		loading: false,
        newSecretPayAddress : null,
    };
	
	
	handleLoad(event) {
        event.preventDefault();
        this.loadSecretPayContract(this.state.currentContract);
	}
	
    //Loader function to retrieve the data from the contract
	loadSecretPayContract = async (event) => {
        try{
			SecretPay = new web3.eth.Contract(Agreement_ABI, this.state.currentContract);
            await SecretPay.methods.released().call().then(function (res) { if (res != null){this.setState({ released  : res })}}.bind(this));
            await SecretPay.methods.trueCount().call().then(function (res) {  this.setState({ trueCount  : res })}.bind(this));
            //await SecretPay.methods.jobIds().call().then(function (res) {  this.setState({ job_ids : this.state.job_ids.concat([res])})}.bind(this));
            //await SecretPay.methods.oracles().call().then(function (res) {    this.setState({ oracles : res })}.bind(this));
        }
		// Non-DApp Browsers
		catch {
            this.toggleError();
		}
    }    
	
	/*
	
    //Loader function to retrieve the data from the contract
	loadSecretPayContract = async (event) => {
        try{
			SecretPay = new web3.eth.Contract(Agreement_ABI, this.state.currentContract);
            await SecretPay.methods.released().call().then(function (res) { if (res != null){this.setState({ released  : res })}}.bind(this));
            await SecretPay.methods.trueCount().call().then(function (res) {  this.setState({ trueCount  : res })}.bind(this));
            await SecretPay.methods.falseCount().call().then(function (res) { this.setState({ falseCount : res })}.bind(this));
            await SecretPay.methods.invoiceID().call().then(function (res) {  this.setState({ invoice_id : res })}.bind(this));
            await SecretPay.methods.sellerAddress().call().then(function (res) {  this.setState({ sellerAddress : res })}.bind(this));
            await SecretPay.methods.buyerAddress().call().then(function (res) {   this.setState({ buyerAddress  : res })}.bind(this));
            await SecretPay.methods.amount().call().then(function (res) { this.setState({ ethAmount : res })}.bind(this));
			await SecretPay.methods.deploymentTime().call().then(function (res) { this.setState({ deploymentTime : res })}.bind(this));
			await SecretPay.methods.getjobIdsLength().call().then(function (res) { this.setState({ arrayLength : res })}.bind(this));
			linkFee = this.state.arrayLength * linkPerOracle;
			console.log("UPDATED LINKFEE : " + linkFee);
        }
		// Non-DApp Browsers
		catch {
            this.toggleError();
		}
	} 
	*/

	//Loader function to retrieve the data from the contract
	async loadSecretPayFactoryContract (address,isBuyer) {
		try{
			SecretPay = new web3.eth.Contract(Agreement_ABI, this.state.currentContract);
			if (isBuyer){
				await SecretPayFactory.methods.getSecretPayAddressesBuyer().call({from:address}).then(function (res) { console.log(res); this.setState({ contracts  : res })}.bind(this));
			}else{
				await SecretPayFactory.methods.getSecretPayAddressesSeller().call({from:address}).then(function (res) {  console.log(res); this.setState({ contracts  : res })}.bind(this));
			}
		
		}
		// Non-DApp Browsers
		catch {
			this.toggleError();
		}
			
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
    
    //Loads the web3 Metamask confirmations and Checks for Events
	async loadBlockChain() {
		// Modern DApp Browsers
		if (window.ethereum) {
			web3 =  new Web3(window.ethereum);
			this.getAccounts();
			try { 
				window.ethereum.enable().then(function() {
					//Set State When recieve Emission from Event from Smart Contract
                    SecretPay = new web3.eth.Contract(Agreement_ABI, contractAddress);
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
	getAccounts = () =>{
		web3.eth.getAccounts().then(accounts => { 
				
			this.setState({ account: accounts[0]});
			console.log(accounts);
		
		});}
	    	
	// onClickFund = async (event) =>{
	// 	try{	
	// 		this.getAccounts();
	// 		console.log('CHECK THIS CONSOLE')
			
	// 		ChainlinkContract.methods.transfer(
	// 			SecretPay.options.address, 
	// 			web3.utils.toHex(linkFee * Math.pow (10, 18))).send( {
	// 			   from: this.state.account
	// 			 }, 
	// 			(error, txHash) => {
	// 			  console.log(txHash);
	// 			});
		
	// 	}catch(err){
	// 		console.log(err)
	// 		this.toggleError();
	// 	}
	// }

	// //This should run the confirmations to see if the paypal invoice was paid.
	// onClickConfirmPaid = async (event) =>{
	// 	try{	
	// 		this.getAccounts();
	// 		SecretPay.methods.requestConfirmations().send({
	// 				from: this.state.account
	// 			}, 
	// 			(error, txHash) => {
	// 			  console.log(txHash);
	// 			});
	// 	}catch(err){
	// 		console.log(err)
	// 		this.toggleError();
	// 	}
	// }
	
	// //This should withdraw the Ethereum
	// onWithDrawETH = async (event) =>{
	// 		try{	
	// 			this.getAccounts();
	// 			SecretPay.methods.withdrawETH().send({
	// 					from: this.state.account
	// 				}, 
	// 				(error, txHash) => {
	// 				  console.log(txHash);
	// 				});
	// 		}catch(err){
	// 			console.log(err)
	// 			this.toggleError();
	// 		}
	// 	}
	//This should withdraw the LINK
	//onWithDrawLINK = async (event) =>{
	// 	try{	
	// 		this.getAccounts();
	// 		SecretPay.methods.withdrawLink().send({
	// 				from: this.state.account
	// 			}, 
	// 			(error, txHash) => {
	// 			console.log(txHash);
	// 			});
	// 	}catch(err){
	// 		console.log(err)
	// 		this.toggleError();
	// 	}
	// }


	toggleError = () => {
		this.setState((prevState, props) => {
		return { showError: true }
		})
    };
    
	async componentDidMount() {
		//this.loadBlockChain()
	}
	
    async componentWillMount(){
		this.loadBlockChain();
        this.loadChainlinkContract();
	}

    render(){
		return(  
          <DivWithErrorHandling showError={this.state.showError}>      
          <h5>View SecretPay contract details by address: </h5>
		  
		  <div>
				<Grid container  justify = "center" spacing={1} alignItems="flex-end">
					<Grid item>
					<br/>
					<Fab variant="extended" padding={5} onClick={this.loadSecretPayFactoryContract} aria-label="like">
					<NavigationIcon />
					Deposit LINK
					</Fab>
					</Grid>
				</Grid>            
			</div>
        	</DivWithErrorHandling>
        )
    }
 }