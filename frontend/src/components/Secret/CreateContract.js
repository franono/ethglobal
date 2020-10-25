import React from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import NavigationIcon from '@material-ui/icons/Navigation';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { ThemeProvider } from "@material-ui/core/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import Profile from 'views/Secret/Sections/Profile.js';
import Signin from 'views/Secret/Sections/Signin.js';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

import { PrivateKey, Users, MailboxEvent, UserMessage, Identity, PublicKey  } from '@textile/hub'
import { BigNumber, providers, utils } from 'ethers'

import { hashSync } from 'bcryptjs'


import Web3 from 'web3';
  


const verifiedOracles = [
	createData('Node1', '0x0D31C381c84d94292C07ec03D6FeE0c1bD6e15c1', '108a8e7de2924a5caed497fff53114b4','PayPal','bbaareiapi4nge7y2fv6wnbsehu63gfyoz5ny2sllbwh34yzjexnhch2lse'),
	createData('Node2', '0x0D31C381c84d94292C07ec03D6FeE0c1bD6e15c1', '108a8e7de2924a5caed497fff53114b4','PayPal','bbaareiapi4nge7y2fv6wnbsehu63gfyoz5ny2sllbwh34yzjexnhch2lse')
];

const withErrorHandling = WrappedComponent => ({ showError, children }) => {
	return (
		<WrappedComponent>
		{showError && <div className="error-message">Oops! Something went wrong! Install MetaMask or try again.</div>}
		{children}
		</WrappedComponent>
	);
};

const DivWithErrorHandling = withErrorHandling(({children}) => <div>{children}</div>)
const Agreement_ABI = require('ABI/Secret_Agreement.json');
const Factory_ABI = require('ABI/Secret_Factory.json');
const ERC20_ABI = require('ABI/ERC20.json');


function createData(operator, oracle, job, method, key) {
	return { operator, oracle, job, method, key};
};

var web3;
var SecretPay;
var SecretPayFactoryAddress = '0x38121Ff9f35a4a5D3aA5A02ca674975D1Bf1c2B2';
var SecretPayFactory;
var ChainlinkContractAddress = '0x20fE562d797A42Dcb3399062AE9546cd06f63280';
var ChainlinkContract;
var contractAddress;
var lastPaymentMethod;
var linkPerOracle = 1;
var newReleased;
var newTrueCount;
var newFalseCount;
var newArrayLength;
var newDeploymentTime;
var newEthAmount;
var newBuyerAddress;
var newSellerAddress;
var newInvoice;
var newSecretPayAddress = ''
var apiURL = 'http://localhost:8080';
var contractFactoryAddress = '0x85b9f74d54e0a4c1d2c9ffe1db5271d6d44164a6';

try{
	var web3 = new Web3(window.web3.currentProvider);
}catch {
	alert('SecretPay requires MetaMask to function.');
}

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

export default class ContractInteraction extends React.Component {
	  	
    client = new Users // Our connected Users API client
	state ={
		// userSession: new UserSession({ appConfig:appConfig }),
		PassString : "",
		RSAKey : "",
		PublicKeyString : "",
		PassPhrase : "",
		Invoice : "",
		EncryptedInvoice : "",
		DecryptedInvoice : "",
		BuyerBlockstackID: "",
		BuyerPublicKey: "",
	
		account : '',
		eth_amount: null,
		invoice_id: '',
		eth_address: '',
		options:[],	
		oracles : [],
		job_ids : [],
		oracleCount: 0,
		showError:false,
		loading: false,
		createDisabled: false,
		createBtnMessage: 'Submit contract',
		newSecretPayAddress: null,
		paypal:false,
		revolut:false,
		payment:'',

		SecretPayAddress : '',
		trueCount : null,
		falseCount : null,
		ethAmount : null,
		currentContract:'',
		sellerAddress : '',
		buyerAddress : '',
		released : null,	
		paymentMethod:'',
		oracles : [],
		job_ids : [],
		pubkeys : [],
		BuyerPublicKey: '',
		deploymentTime : '',
		arrayLength : null,
		linkFee: 0,
		currentContract : '',
		secret: 'secret'
	};

	async loadChainlinkContract(){
		try{
			ChainlinkContract  = new web3.eth.Contract(ERC20_ABI, ChainlinkContractAddress);
		}
		catch {
			this.toggleError();
		}
	}

	getAccounts = () =>{
		web3.eth.getAccounts().then(accounts => { 
				
			this.setState({ account: accounts[0]});
			console.log(accounts);
		
		});
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
				SecretPayFactory = new web3.eth.Contract(Factory_ABI, SecretPayFactoryAddress);
				ChainlinkContract  = new web3.eth.Contract(ERC20_ABI, ChainlinkContractAddress);

				SecretPayFactory.events.contractDeployed(function(error, result){
					if (!error){
						var SecretPayAddress = result.returnValues.SecretPayAddress;
						this.setState({ newSecretPayAddress: SecretPayAddress });
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
		}else {
			this.toggleError();
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
			this.props.createHandler(SecretPayAddress,this.state.released,this.state.trueCount,this.state.falseCount,this.state.buyerKey,this.state.sellerKey,this.state.nodeKeys,this.state.arrayLength,this.state.deploymentTime,this.state.ethAmount,this.state.buyerAddress,this.state.sellerAddress,this.state.oracles,this.state.job_ids);
		}
		  // Non-DApp Browsers
		  catch {
			  this.toggleError();
		  }
        }

	onClickFund = async (event) =>{
		try{	
		  this.getAccounts();
		  
			ChainlinkContract.methods.transfer(
			SecretPay.options.address, 
			web3.utils.toHex(this.state.linkfee * Math.pow (10, 18))).send( {
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

	// showMethodIcon (method){
	// 	if (method === 'PayPal') {
	// 				return <img
	// 							src={PayPalLogo}
	// 							alt="..."
	// 						/>
	// 		}else if (method === 'Revolut'){
	// 			return <img
	// 			src={RevolutLogo}
	// 			alt="..."
	// 		/>
	// 	}
	// }

	async checkOracles(){

		var i;
		var verifyCount = 0;
		var nonverifyCount = 0;
		var tempOracles = this.state.oracles;
		var tempPubKeys = this.state.pubkeys;
		var tempJobIds = this.state.job_ids;
	
		
		for (i = 0; i < tempOracles.length; i++) {   
		  var index = verifiedOracles.findIndex(x => (x.public_key === tempPubKeys[i] && x.job === tempJobIds[i] && x.oracle === tempOracles[i]));	
		
		  if(index == -1){
			nonverifyCount++;          
		  }else{
			var prevLastPaymentMethod = this.lastPaymentMethod;        
			this.lastPaymentMethod = verifiedOracles[index].method;    
			if (prevLastPaymentMethod != null && (prevLastPaymentMethod != this.lastPaymentMethod)){
			  nonverifyCount++;
			} else{
			  verifyCount++;
			}
		  }	
		}
	  
		if (nonverifyCount==0 && verifyCount>0 && await this.reencryptInvoice()){
			// return 	(<TableRow><TableCell component="th" scope="row">{verifiedOracles[index].operator}</TableCell><TableCell align="right" style="font-color:green">SecretPay Verified</TableCell></TableRow>);
			//return true
		  this.setState({verified:true});
		  
		  }
		  else{
			//return false
			this.setState({verified:false});
		  }// return (<TableRow><TableCell align="right">Unknown Oracle</TableCell><TableCell align="right" style="font-color:red">Unverified Oracles </TableCell>	</TableRow>);
		  
	  }
	
	async reencryptInvoice(){

		var verifyCount = 0;
		var nonverifyCount = 0;
		var tempEncryptedInvoice = "";
		var encryptedInvoices = "";
		
		const {DecryptedInvoice, encrypted_invoices, pubkeys} = this.state;
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

	toggleError = () => {
		this.setState((prevState, props) => {
			return { showError: true }
		})
	};

	isSelected = (method) => {
		if ((method.toUpperCase() === this.state.payment.toUpperCase()) && method != null)
			return false		
		else{
			return true
		}		
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

	async generatePrivateKey  () {
		const signer = (new providers.Web3Provider(window.ethereum)).getSigner()
		// avoid sending the raw secret by hashing it first
		//const secret = hashSync(this.state.secret, 10)
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
		console.log("this is the public key" + identity.public.toString())
		this.setState({PrivateKey:identity.toString(),PublicKey:identity.public.toString()})

		await this.client.getToken(identity)

		const mailboxID = await this.client.setupMailbox()


		// Your app can now use this identity for generating a user Mailbox, Threads, Buckets, etc
		return identity
	}

	handleChangeChk(e) {
		// current array of options
		const options = this.state.options
		let index

		// check if the check box is checked or unchecked
		if (e.target.checked) {
		// add the numerical value of the checkbox to options array
		options.push(+e.target.value)
		} else {
		// or remove the value from the unchecked checkbox from the array
		index = options.indexOf(+e.target.value)
		options.splice(index, 1)
		}
		
		// update the state with the new array of options
		this.setState({ options: options })
	}
	
	handlePaymentChange(event){

		if (event.target.value === 'paypal'){
			this.setState({paypal:true,revolut:false,payment: 'paypal' });
		}else {
			this.setState({paypal:false,revolut:true, payment: 'revolut' });
		}
		
	}
	handleChange = (e) => this.setState({ [e.target.name]: e.target.value });  

	async componentWillMount() {
		this.loadBlockChain();
	}

	changeHandler = e => {
		this.setState({ [e.target.name]: e.target.value });
	};

	async encryptInvoice(invoice,publicKey){
		var data = {"invoice":invoice,"publicKeys":[publicKey]}
		var encryptedInvoice;
	
		await fetch(apiURL + '/encrypt', {
		  method: 'POST',
		  headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		  },
		  body: JSON.stringify(data)
		}).then(response => response.json())
		.then(data => encryptedInvoice = data[0]);
	  	
		return encryptedInvoice;
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

	handleSignIn(e) {
		const redirect = `${window.location.origin}/secret`
		const manifest = `${window.location.origin}/manifest.json`
		e.preventDefault();
		// userSession.redirectToSignIn(redirect, manifest);
	}
	
	handleSignOut(e) {
		e.preventDefault();
		// userSession.signUserOut(window.location.origin);
	}

	componentDidMount = async () => {
		this.client = await Users.withKeyInfo({key: 'bbrf24kbdsag6z3hcomvx6wkzfm'})
		
		// const { userSession } = this.state;
	
		// if (userSession.isSignInPending()) {
		//   userSession.handlePendingSignIn().then((userData) => {
		// 	window.history.replaceState({}, document.title, "/secret")
		// 	this.setState({ userData: userData })
		//   });
		// }
		// this.getGeneratedKeys()
	  }

	sendMessages = async (identity, oracles, jobs, keys) => {

		var trade = {sellerAddress:this.state.account,
					buyerAddress:this.state.eth_address,
					buyerPub:this.state.BuyerPublicKey,
					sellerPub:identity.public.toString(),
					invoice:this.state.invoice_id,
					type:this.state.payment,
					nodePubs:keys,
					oracles:oracles,
					jobs:jobs}

		var tradeJSON = JSON.stringify(trade)
		if (!tradeJSON || tradeJSON === '' || !this.client) return
		const encoded = new TextEncoder().encode(tradeJSON)
		console.log("test1" + trade)
		console.log("test1" + tradeJSON)
		console.log("test2" + identity.public)

		var recipients = [].concat(trade.nodePubs)
		recipients.push(trade.buyerPub)
		console.log("test332" +recipients)
		console.log("test333gg343g42  " +recipients.length )

		var messageIDs = []
		for (let i = 0; i < recipients.length; i++) {
			
			var message = await this.client.sendMessage(identity, PublicKey.fromString(recipients[i]), encoded)
			messageIDs.push(message.id)
		}
		return messageIDs;
	}
	onSubmit = async (event) =>{
		var identity = await this.generatePrivateKey()
		this.setState({ loading: false, createDisabled:false,createBtnMessage: "Submitting..."});
		
		var oracles = []
		var job_ids = []
		var node_encryptedInvoices = []
		var pub_keys = []
		for (let i = 0; i < this.state.options.length; i++) {
			oracles.push(verifiedOracles[this.state.options[i]].oracle);
			job_ids.push(verifiedOracles[this.state.options[i]].job);
			//node_encryptedInvoices.push(this.encryptInvoiceNodes(verifiedOracles[this.state.options[i]].public_key));
			//node_encryptedInvoices.push(await this.encryptInvoice(this.state.Invoice,verifiedOracles[this.state.options[i]].public_key));        
			pub_keys.push(verifiedOracles[this.state.options[i]].key.toString());
		}		  
		
		var messages = await this.sendMessages(identity, oracles,job_ids,pub_keys)


		event.preventDefault();
		this.setState({ oracleCount: oracles.length, loading: true, errorMessage: ''});
	  
		try{	
			console.log('Get all accounts')
			console.log('CHECK THIS CONSOLE')
			this.setState({ loading: false, createDisabled:false,createBtnMessage: "Processing..."});
			console.log({'123':this.state.PublicKey,'sdf':this.state.BuyerPublicKey, 'sdfsdf':pub_keys,'sdfsdf':this.state.eth_address,'sdfsdf':job_ids, 'wrth':oracles,'wh5':messages })
			await SecretPayFactory.methods.createSecretPay(this.state.PublicKey, this.state.BuyerPublicKey, pub_keys,this.state.eth_address, job_ids, oracles,messages ).send({from:this.state.account,value:web3.utils.toWei(this.state.eth_amount,'ether')});
			
		}catch(err){
			console.log(err)
			this.toggleError();
		};
	}

	render(){
	
		return(  
        //   <DivWithErrorHandling  style={{margin:"0px"}} showError={this.state.showError}>      
			<ThemeProvider theme={Theme}>
			<div className="PrivatePage">
			
			<div>
			
			<DivWithErrorHandling  style={{margin:"0px"}} showError={this.state.showError}>
			<div>
			<br></br>
			  <Grid container  justify = "center" spacing={1} alignItems="flex-end">
              <Grid item> 
				<FormControl component="fieldset">
					<FormLabel   style={{fontSize: "1.5rem" ,color:"#FFFFFF"}} component="legend">Payment Method</FormLabel>								
					<RadioGroup value={this.state.payment} onChange={event => this.handlePaymentChange(event)}>
						<FormControlLabel  style={{fontSize: "1.5rem" ,color:"#FFFFFF"}} value="paypal" control={<Radio style={{color:"#FFFFFF"}}/>} label="PayPal" />
						<FormControlLabel  style={{fontSize: "1.5rem" ,color:"#FFFFFF"}} value="revolut" control={<Radio style={{color:"#FFFFFF"}}/>} label="Revolut" />
					</RadioGroup>
				</FormControl>
              </Grid>
            </Grid>            
          	</div>
			<div>
			<Grid container direction="column"  justify = "center" spacing={1} alignItems="center">
				<Grid item> 
              <TextField
                  onChange ={event => this.setState({ invoice_id: event.target.value})}
                  id="filled-textarea"
                  label="Payment or Invoice ID"
                  placeholder="eg. ABCDEFGHIC9BJR2Y"
                  style = {{width: 430}}
                  margin="normal"
				  variant="filled"
				  InputProps={{ 
					style: {
					  color: "#FFFFFF"
				  }}}
                />
              </Grid>
              <Grid item>
              <TextField
                  onChange ={event => this.setState({ eth_amount: event.target.value})}
                  id="filled-textarea"
                  label="ETH Amount"
                  placeholder="eg. 1.234"
                  style = {{width: 430}}
                  margin="normal"
				  variant="filled"
				  InputProps={{ 
					style: {
					  color: "#FFFFFF"
				  }}}
                />
              </Grid>
            </Grid>  
			<Grid container  justify = "center" spacing={1} alignItems="flex-end">
				<Grid item>
				<TextField
					onChange ={event => this.setState({ BuyerPublicKey: event.target.value})}
					id="filled-textarea"
					label="Buyer Public Key"
					placeholder=""
					style = {{width: 430}}
					margin="normal"
					variant="filled"
					InputProps={{ 
						style: {
						  color: "#FFFFFF"
					}}}
				/>
				</Grid>
			</Grid>  
			           
          </div>
          <div>
            <Grid container  justify = "center" spacing={1} alignItems="flex-end">
              <Grid item>
              <TextField
                  onChange ={event => this.setState({ eth_address: event.target.value})}
                  id="filled-textarea"
                  label="Buyer ETH Address"
                  placeholder="eg. 0xA1B2C3D4E5F6G..."
                  style = {{width: 430, paddingBottom: 20}}
                  margin="normal"
				  variant="filled"
				  InputProps={{ 
					style: {
					  color: "#FFFFFF"
				  }}}
                />
              </Grid>
            </Grid>            
          </div>
          <div>
		  <h5 style={{
                textAlign: 'justify', 
                fontSize: "1rem",
                marginTop: "0px",
                marginLeft: "40px",
                marginRight: "60px",
                color: "#FFFFFF"}}>
                FIAT payment verification is done by one or more Chainlink oracles that verify whether or not the Revolut or Paypal
                payment has been completed. ETH is unlocked once 50%+ of oracles have voted yes on the payment's success. Select 1 
                or more Chainlink oracles for payment verification below. Each oracle query costs 0.25 LINK in Chainlink network fees. </h5>
            <Grid container  justify = "center" spacing={1} alignItems="flex-end">
              <Grid item>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
					<TableCell  style={{color :"#FFFFFF"}}><b>Select  </b></TableCell>
                    <TableCell  style={{color :"#FFFFFF"}}><b>Operator</b></TableCell>
                    <TableCell  style={{color :"#FFFFFF"}} align="center"><b>Oracle</b></TableCell>
                    <TableCell  style={{color :"#FFFFFF"}} align="center"><b>Pubkey</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
					{verifiedOracles.map((row,index) => (                    
                    <TableRow>
                        <TableCell style={{color :"#FFFFFF"}} padding="checkbox">
                        <Checkbox style={{color :"#FFFFFF"}}  value={index} disabled={this.isSelected(row.method)} onChange={event => this.handleChangeChk(event)}  />
                      </TableCell>
                      <TableCell style={{color :"#FFFFFF"}} component="th" scope="row">
                        {row.operator}
                      </TableCell>
                      <TableCell style={{color :"#FFFFFF"}} align="right">{row.oracle}</TableCell>
                      <TableCell style={{color :"#FFFFFF"}} align="right">{row.key}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </Grid>
            </Grid>            
          </div>
          <div>
            <Grid container  justify = "center" spacing={1} alignItems="flex-end">
              <Grid item>
              <br/>
              <Fab variant="extended" padding={5} 
                disabled={this.state.createDisabled} onClick={this.onSubmit} aria-label="like">
                <NavigationIcon />
                {this.state.createBtnMessage}
              </Fab>
              </Grid>
            </Grid>            
          	</div>
			</DivWithErrorHandling>
			</div>
			</div>
		  </ThemeProvider>
        )
    }
 }