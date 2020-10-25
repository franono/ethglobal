import React,{ Component } from 'react';
import { makeStyles, withStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import NavigationIcon from '@material-ui/icons/Navigation';
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/core/styles";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Web3 from 'web3';

import { PrivateKey, Users, MailboxEvent, UserMessage, Identity, PublicKey  } from '@textile/hub'
import { BigNumber, providers, utils } from 'ethers'
import { hashSync } from 'bcryptjs'

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

var web3;

const DivWithErrorHandling = withErrorHandling(({children}) => <div>{children}</div>)

const verifiedOracles = [
		createData('Node1', '0x0D31C381c84d94292C07ec03D6FeE0c1bD6e15c1', '108a8e7de2924a5caed497fff53114b4','PayPal/Revolut'),
		createData('Node2', '0x0D31C381c84d94292C07ec03D6FeE0c1bD6e15c1', '108a8e7de2924a5caed497fff53114b4','PayPal')
];

const Agreement_ABI = require('ABI/Secret_Agreement.json');
const Factory_ABI = require('ABI/Secret_Factory.json');
const ERC20_ABI = require('ABI/ERC20.json');

function createData(operator, oracle, job, method) {
	return { operator, oracle, job, method };
};

var SecretPayFactory;
var SecretPay;
var ChainlinkContractAddress = '0x20fE562d797A42Dcb3399062AE9546cd06f63280';
var ChainlinkContract;
var contractAddress;
var linkFee = 0.33334;
var linkPerOracle = 1;
var client;




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

var apiURL = 'http://localhost:8080';

export default class ContractInteraction extends React.Component {

	
	client = new Users // Our connected Users API client
	
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
		secret: 'secret'
    };

	
	generateMessageForEntropy(ethereum_address, application_name, secret) {
		return (
		  '******************************************************************************** \n' +
		  'READ THIS MESSAGE CAREFULLY. \n' +
		  'DO NOT SHARE THIS SIGNED MESSAGE WITH ANYONE OR THEY WILL HAVE READ AND WRITE \n' +
		  'ACCESS TO THIS APPLICATION. \n' +
		  'DO NOT SIGN THIS MESSAGE IF THE FOLLOWING IS NOT TRUE OR YOU DO NOT CONSENT \n' +
		  'TO THE CURRENT APPLICATION HAVING ACCESS TO THE FOLLOWING APPLICATION. \n' +
		  '******************************************************************************** \n' +
		  'The Ethereum address used by this application is: \n' +
		  '\n' +
		  ethereum_address.value +
		  '\n' +
		  '\n' +
		  '\n' +
		  'By signing this message, you authorize the current application to use the \n' +
		  'following app associated with the above address: \n' +
		  '\n' +
		  application_name +
		  '\n' +
		  '\n' +
		  '\n' +
		  'The hash of your non-recoverable, private, non-persisted password or secret \n' +
		  'phrase is: \n' +
		  '\n' +
		  secret +
		  '\n' +
		  '\n' +
		  '\n' +
		  '******************************************************************************** \n' +
		  'ONLY SIGN THIS MESSAGE IF YOU CONSENT TO THE CURRENT PAGE ACCESSING THE KEYS \n' +
		  'ASSOCIATED WITH THE ABOVE ADDRESS AND APPLICATION. \n' +
		  'AGAIN, DO NOT SHARE THIS SIGNED MESSAGE WITH ANYONE OR THEY WILL HAVE READ AND \n' +
		  'WRITE ACCESS TO THIS APPLICATION. \n' +
		  '******************************************************************************** \n'
		);
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
	
	async generatePrivateKey  () {
		const signer = (new providers.Web3Provider(window.ethereum)).getSigner()
		// avoid sending the raw secret by hashing it first
		// const secret = hashSync(this.state.secret, 10)
		const secret = this.state.secret
		const message = this.generateMessageForEntropy(this.state.account, 'textile-demo', secret)
		const signedText = await signer.signMessage(message);
		const hash = utils.keccak256(signedText);
		if (hash === null) {
			throw new Error('No account is provided. Please provide an account to this application.');
		}
		// The following line converts the hash in hex to an array of 32 integers.
			// @ts-ignore
		const array = hash.replace('0x', '').match(/.{2}/g).map((hexNoPrefix) => BigNumber.from('0x' + hexNoPrefix).toNumber())
		
		if (array.length !== 32) {
			throw new Error('Hash of signature is not the correct size! Something went wrong!');
		}
		const identity = PrivateKey.fromRawEd25519Seed(Uint8Array.from(array))
		console.log(identity.toString())
		this.setState({PrivateKey:identity.toString(),PublicKey:identity.public.toString()})
	
		await this.client.getToken(identity)
	
		const mailboxID = await this.client.setupMailbox()
	
	
		// Your app can now use this identity for generating a user Mailbox, Threads, Buckets, etc
		return identity
	}

	
	async loadBlockChain() {
		//this.props.toggleNextEnabled();
		// Modern DApp Browsers
		if (window.ethereum) {
			web3 = new Web3(window.ethereum);
			try { 
				window.ethereum.enable().then(function() {
				this.getAccounts();

					//Set State When recieve Emission from Event from Smart Contract
					SecretPayFactory = new web3.eth.Contract(Factory_ABI, contractFactoryAddress);

					SecretPayFactory.events.contractDeployed(function(error, result){
						if (!error){
							var SecretPayAddress = result.returnValues.SecretPayAddress;
							this.setState({ newSecretPayAddress: SecretPayAddress });
							this.loadSecretPayContract(SecretPayAddress)
						} else {
							console.log(error);
						}
						
					}.bind(this));
				}.bind(this));	
			} catch(e) {
			// User has denied account access to DApp...
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
		this.client = await Users.withKeyInfo({key: 'bbrf24kbdsag6z3hcomvx6wkzfm'})
		//this.loadBlockChain()
	}
	
    async componentWillMount(){
		this.loadBlockChain();
        this.loadChainlinkContract();
	}
	
    showPaymentLink()
    {
        if (this.state.invoice_id.type === 'paypal'){
            return "https://www.paypal.com/invoice/p/#" + this.state.invoice_id.invoice;         
           }
        else if (this.state.invoice_id.type === 'revolut'){
            return "https://rev.money/r/" + this.state.invoice_id.invoice;
        }else{ 
            return "";
        }
    }
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
			
			var index = verifiedOracles.findIndex(x => (x.pubkey === this.state.pubkeys[i] && x.job === this.state.job_ids[i] && x.oracle === this.state.oracles[i]));	
			
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

	invoiceDecoder = async (message,identity) =>{
		
		try{

			const bytes = await identity.decrypt(message.body)
			const body = new TextDecoder().decode(bytes)
			const {from} = message
			const {readAt} = message
			const {createdAt} = message
			const {id} = message
			console.log(body)
			return body
		}
		catch{
			console.log("error")
			return "error"
		}
		
	  }

	async getInvoice(identity){

		for (var i = 0; i < this.state.msgIDs.length; i++) {   
			try{
				const messages = await this.client.listInboxMessages({ limit:1, seek:this.state.msgIDs[i] })
				console.log(messages)
				const inbox = []
				for (const message of messages) {
					const invoice = await this.invoiceDecoder(message,identity)
					this.setState({invoice_id: JSON.parse(invoice)})
				}
			}
			catch{
				console.log("errorgetinvoice")
				return "error"
			}
		}
		
	}
	  //buyerinteraction start
  //Loader function to retrieve the data from the contract
 //buyerinteraction start
    //Loader function to retrieve the data from the contract
    loadSecretPayContract = async () => {
		
		if (this.state.currentContract != null && this.state.currentContract != ""){
		
		SecretPay = new web3.eth.Contract(Agreement_ABI,this.state.currentContract);

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

			const identity = await this.generatePrivateKey()
			const invoice_id = await this.getInvoice(identity)
			
		}
		//this.checkOracles();
	}

	async decryptInvoice(encryptedData, privateKey){ 
    
		var data = {"encryptedInvoice":encryptedData,"privateKey":privateKey}
		var decryptedInvoice;
	
		await fetch(apiURL + '/decrypt', {
		  method: 'POST',
		  headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		  },
		  body: JSON.stringify(data)
		})
		.then(response => response.text())
		.then(data => decryptedInvoice = data);
		
		return decryptedInvoice;
	}

	async reencryptInvoice(){

		var verifyCount = 0;
		var nonverifyCount = 0;
		var tempEncryptedInvoice = "";
		var encryptedInvoices = "";
		
		const {DecryptedInvoice,encrypted_invoices,pubkeys} = this.state;
		var i;   
	
		var data = {"invoice":DecryptedInvoice,"publicKeys":pubkeys}
	
		await fetch(apiURL + '/encrypt', {
		  method: 'POST',
		  headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		  },
		  body: JSON.stringify(data)
		}).then(response => response.json())
		.then(data => encryptedInvoices = data );
	
		this.setState({encrypted_invoices:encryptedInvoices});
	
		tempEncryptedInvoice = encryptedInvoices[0];     
	
		for (i = 0; i<encryptedInvoices.length ; i++){
		  //Encrypting the invoice with the target public key.
	 
	
		  if(tempEncryptedInvoice === encryptedInvoices[i]){
			verifyCount++;      
		  }else{
	
			nonverifyCount++;
		  }		
		  
		}
	
		if (nonverifyCount==0 && verifyCount>0){
			// return 	(<TableRow><TableCell component="th" scope="row">{verifiedOracles[index].operator}</TableCell><TableCell align="right" style="font-color:green">SecretPay Verified</TableCell></TableRow>);
			return true}
		  else{
			return false
		}// return (<TableRow><TableCell align="right">Unknown Oracle</TableCell><TableCell align="right" style="font-color:red">Unverified Oracles </TableCell>	</TableRow>);
		  
	}

    render(){
		return(  
          <DivWithErrorHandling showError={this.state.showError}>
			<ThemeProvider theme={Theme}>
			<h5>View SecretPay contract details by address: </h5>
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
							InputProps={{ 
								style: {
									color: "#FFFFFF"
							}}}/>
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
						<TableCell style={{color :"#FFFFFF"}} align="left"><b>Contract Address</b></TableCell>
						<TableCell style={{color :"#FFFFFF"}} align="right"> {this.state.currentContract} </TableCell>
					</TableRow> 
					<TableRow>  
						<TableCell style={{color :"#FFFFFF"}} align="left"><b>ETH</b></TableCell>    
						<TableCell style={{color :"#FFFFFF"}} align="right"> {this.state.ethAmount/1000000000000000000} </TableCell>     
					</TableRow>         
                    <TableRow> 
                    	<TableCell style={{color :"#FFFFFF"}} align="left"><b>Payment method</b></TableCell>
						<TableCell style={{color :"#FFFFFF"}} align="right"> {this.state.invoice_id.type} </TableCell>
                    </TableRow>            
					<TableRow>
						<TableCell style={{color :"#FFFFFF"}} align="left"><b>Invoice</b></TableCell>
						<TableCell style={{color :"#FFFFFF"}} align="right"> {this.state.invoice_id.invoice}  </TableCell>
					</TableRow>    
					<TableRow> 
						<TableCell style={{color :"#FFFFFF"}} align="left"><b>Buyer Address</b></TableCell>
						<TableCell style={{color :"#FFFFFF"}} align="right"> {this.state.buyerAddress} </TableCell>
					</TableRow>    
					<TableRow>    
						<TableCell style={{color :"#FFFFFF"}} align="left"><b>Seller Address</b></TableCell>     
						<TableCell style={{color :"#FFFFFF"}} align="right"> {this.state.sellerAddress} </TableCell>
					</TableRow>    
					<TableRow> 
						<TableCell style={{color :"#FFFFFF"}} align="left"><b>Buyer Key</b></TableCell>
						<TableCell style={{color :"#FFFFFF"}} align="right"> {this.state.buyerKey} </TableCell>
					</TableRow>  
					<TableRow> 
						<TableCell style={{color :"#FFFFFF"}} align="left"><b>Seller Key</b></TableCell>
						<TableCell style={{color :"#FFFFFF"}} align="right"> {this.state.sellerKey} </TableCell>
					</TableRow>  
					<TableRow>   
						<TableCell style={{color :"#FFFFFF"}} align="left"><b>Redeemed</b></TableCell>           
						<TableCell style={{color :"#FFFFFF"}} align="right"> {this.showRedeemed()} </TableCell>
					</TableRow>    
					<TableRow>
						<TableCell style={{color :"#FFFFFF"}} align="left"><b>Created</b></TableCell>
						<TableCell style={{color :"#FFFFFF"}} align="right"> {this.state.deploymentTime} </TableCell>
					</TableRow>    
					<TableRow>
						<TableCell style={{color :"#FFFFFF"}} align="left"><b>True Checks</b></TableCell>
						<TableCell style={{color :"#FFFFFF"}} align="right"> {this.state.trueCount} </TableCell>
					</TableRow>    
					<TableRow>
						<TableCell style={{color :"#FFFFFF"}} align="left"><b>False Checks</b></TableCell>
						<TableCell style={{color :"#FFFFFF"}} align="right"> {this.state.falseCount} </TableCell>    
					</TableRow>  
					<TableRow>
						<TableCell style={{color :"#FFFFFF"}} align="left"><b>Oracles Verification</b></TableCell> 
						<TableCell style={{color :"#FFFFFF"}} align="right">
						{/* {this.checkOracles() ? 'SecretPay Verified' : 'Oracles not verifiable by SecretPay'}   */}
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
		</ThemeProvider>
		</DivWithErrorHandling>
		)
    }
 }