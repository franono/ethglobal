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
var contractFactoryAddress = '0x3BF6e2e7B2AfC7032fF628e301034Ae387A3bE95';


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


const verifiedOracles = [
    createData('Node1', '0x0D31C381c84d94292C07ec03D6FeE0c1bD6e15c1', '7a952e01d59545dd9ca00f667becb0b0','PayPal'),
    createData('Node2', '0x0D31C381c84d94292C07ec03D6FeE0c1bD6e15c1', '7a952e01d59545dd9ca00f667becb0b0','PayPal')
  ];

const Agreement_ABI = require('ABI/Standard_Agreement.json');
const ERC20_ABI = require('ABI/ERC20.json');

function createData(operator, oracle, job,method) {
	return { operator, oracle, job ,method};
};

var SecretPayFactory;
var SecretPay;
var ChainlinkContractAddress = '0x20fE562d797A42Dcb3399062AE9546cd06f63280';
var ChainlinkContract;
var contractAddress;
var linkFee = 0.33334;
var linkPerOracle = 1;

export default class ContractInteraction extends React.Component {

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
        deploymentTime : '',
		showError :false,
		loading: false,
		newSecretPayAddress : null,
		arrayLength : null,
    };
	
	methodFinder (){		

		if (this.state.job_ids.length > 0 && verifiedOracles.length > 0){
		var foundIndex = verifiedOracles.findIndex(x => (x.job === this.state.job_ids[0]));
		console.log("inde " + foundIndex)
		  if (foundIndex !== -1){
			
			console.log("2 " + verifiedOracles[foundIndex].method)
			if (verifiedOracles[foundIndex].method === 'PayPal'){
				return "https://www.paypal.com/invoice/p/#" + this.state.invoice_id;         
			   }
			else if (verifiedOracles[foundIndex].method === 'Revolut'){
				return "https://rev.money/r/" + this.state.invoice_id;
			

			// this.setState({ paymentMethod : verifiedOracles[foundIndex].method })
			// return verifiedOracles[foundIndex].method;

		  }
		}
		// this.setState({ paymentMethod : "Unknown" })

	
	  }
	  return "Unknown";
	}
	
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
			await SecretPay.methods.getjobIds().call().then(function (res) {this.setState({ job_ids : res })}.bind(this));
			await SecretPay.methods.getoracles().call().then(function (res) {
				
				this.setState({ oracles : res })

				this.setState({ linkFee : linkFee*res.length })
			
			}.bind(this));
		   
			console.log("this is the2 "+this.state.oracles)
							console.log("this is the2 "+this.state.job_ids)
			console.log("UPDATED LINKFEE : " + linkFee);
        }
		// Non-DApp Browsers
		catch(error) {
			console.log(error)
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
	
	onClickFund = async (event) =>{
		try{	
			this.getAccounts();
			console.log('CHECK THIS CONSOLE')
			ChainlinkContract.methods.transfer(
				SecretPay.options.address, 
				web3.utils.toHex(this.state.linkFee * Math.pow (10, 18))).send( {
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
	
	//This should run the confirmations to see if the paypal invoice was paid.
	onClickConfirmPaid = async (event) =>{
		try{	
			this.getAccounts();
			SecretPay.methods.requestConfirmations().send({
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
	
	//This should withdraw the Ethereum
	onWithDrawETH = async (event) =>{
			try{	
				this.getAccounts();
				SecretPay.methods.withdrawETH().send({
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

	//This should withdraw the LINK
	onWithDrawLINK = async (event) =>{
		try{	
			this.getAccounts();
			SecretPay.methods.withdrawLink().send({
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
	
    // showPaymentLink()
    // {
    //     if (this.state.paymentMethod === 'paypal'){
    //         return "https://www.paypal.com/invoice/p/#" + this.state.invoice_id;         
    //        }
    //     else if (this.state.paymentMethod === 'revolut'){
    //         return "https://rev.money/r/" + this.state.invoice_id;
    //     }else{ 
    //         return "";
    //     }
    // }
    showRedeemed()
    { 
         if (this.state.released){
            return "Funds released to address " + this.state.buyerAddress;
        }else if(this.state.released == false){
            return "Not released";
        }else {
            return " ";         
        }

	}
	
	checkOracles(){
		
		var i;
		var verifyCount = 0;
		var nonverifyCount = 0;

		for (i = 0; i < this.state.oracles.length; i++) {
			
			var index = verifiedOracles.findIndex(x => (x.job === this.state.job_ids[i] && x.oracle === this.state.oracles[i]));	
			
			if(index == -1){
				nonverifyCount++;
				
			}else{
				verifyCount++;
			}			
		}
		if (nonverifyCount==0 && verifyCount>0)
				// return 	(<TableRow><TableCell component="th" scope="row">{verifiedOracles[index].operator}</TableCell><TableCell align="right" style="font-color:green">SecretPay Verified</TableCell></TableRow>);
				return true
			else
				return false
				// return (<TableRow><TableCell align="right">Unknown Oracle</TableCell><TableCell align="right" style="font-color:red">Unverified Oracles </TableCell>	</TableRow>);
			


	}


    render(){
		return(  
          <DivWithErrorHandling showError={this.state.showError}>      
          <h5>View SecretPay contract details by address: </h5>
		  {/* <div className={classes}> */}
			<div >
				<Grid container  justify = "center" spacing={1} alignItems="flex-end">
				<Grid item> 
				<TextField
					onChange ={event => this.setState({ currentContract: event.target.value})}
					id="filled-textarea"
					label="SecretPay Contract Address"
					placeholder="eg. 0xae9b2cf719bf30f8024d29aae341dcb5e581b491"
					multiline
					style = {{width: 430}}
					margin="normal"
					variant="filled"
					/>
				</Grid>
				</Grid>          
			</div>
			<div >
				<Grid container  justify = "center" spacing={1} alignItems="flex-end">
					<Grid item>
					<br/>
					<Fab variant="extended" padding={5} onClick={this.loadSecretPayContract} aria-label="like">
					<NavigationIcon />
						Load Selected Contract
					</Fab>
					</Grid>
				</Grid>  
			</div>
			<div>
				<Table aria-label="simple table">
					<TableBody>                  
					<TableRow>
						<TableCell align="left"><b>Contract Address</b></TableCell>
						<TableCell align="right"> {this.state.currentContract} </TableCell>
					</TableRow> <TableRow>  
					<TableCell align="left"><b>ETH</b></TableCell>    
					<TableCell align="right"> {this.state.ethAmount/1000000000000000000} </TableCell>     
								</TableRow>         
                    <TableRow> 
                    <TableCell align="left"><b>Invoice</b></TableCell>
						<TableCell align="right"> {this.methodFinder()} </TableCell>
                    </TableRow>        
					{/* <TableRow>
					<TableCell align="left"><b>Invoice</b></TableCell>
						<TableCell align="right"> {this.showPaymentLink()}  </TableCell>
							</TableRow>     */}
					<TableRow> 
					<TableCell align="left"><b>Buyer Address</b></TableCell>
						<TableCell align="right"> {this.state.buyerAddress} </TableCell>
								</TableRow>    
					<TableRow>    
					<TableCell align="left"><b>Seller Address</b></TableCell>     
						<TableCell align="right"> {this.state.sellerAddress} </TableCell>
								</TableRow>    
					<TableRow>   
					<TableCell align="left"><b>Redeemed</b></TableCell>           
                      <TableCell align="right"> {this.showRedeemed()} </TableCell>
								</TableRow>    
					<TableRow>
					<TableCell align="left"><b>Created</b></TableCell>
						<TableCell align="right"> {this.state.deploymentTime} </TableCell>
								</TableRow>    
					<TableRow>
					<TableCell align="left"><b>True Checks</b></TableCell>
						<TableCell align="right"> {this.state.trueCount} </TableCell>
								</TableRow>    
								<TableRow>
					<TableCell align="left"><b>False Checks</b></TableCell>
						<TableCell align="right"> {this.state.falseCount} </TableCell>    
								</TableRow>  <TableRow>
					<TableCell align="left"><b>Oracles Verification</b></TableCell> 
					<TableCell align="right">
						{this.checkOracles() ? 'SecretPay Verified' : 'Oracles not verifiable by SecretPay'}  
					</TableCell>
					</TableRow>    
					</TableBody>
					<TableBody>                  
                   				    
                </TableBody>
				</Table>
			</div>
			<div>
				<Grid container  justify = "center" spacing={1} alignItems="flex-end">
				<Grid item>
					<br/>
					<Fab variant="extended" padding={5} onClick={this.onClickFund} aria-label="like">
					<NavigationIcon />
					Deposit LINK
					</Fab>
					</Grid>
					<Grid item>
					<br/>
					<Fab variant="extended" padding={5} onClick={this.onClickConfirmPaid} aria-label="like">
					<NavigationIcon />
					Query Oracles
					</Fab>
					</Grid>
					<Grid item>
					<br/>
					<Fab variant="extended" padding={5} onClick={this.onWithDrawETH} aria-label="like">
					<NavigationIcon />
					Withdraw ETH
					</Fab>
					</Grid>
					<Grid item>
					<br/>
					<Fab variant="extended" padding={5} onClick={this.onWithDrawLINK} aria-label="like">
					<NavigationIcon />
					Withdraw LINK
					</Fab>
					</Grid>
				</Grid>            
			</div>
        	</DivWithErrorHandling>
        )
    }
 }