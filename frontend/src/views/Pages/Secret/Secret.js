import React, { Component } from "react";
import { makeStyles } from "@material-ui/core/styles";

// core components
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import NavPills from "components/NavPills/NavPills.js";
import Typography from "@material-ui/core/Typography";
import HeaderLinks from "components/Header/HeaderLinks.js";
import { Link } from 'react-router-dom';

import styles from "assets/jss/material-kit-react/views/landingPage.js";

import Profile from './Profile.js';
import Signin from './Signin.js';

import PropTypes from "prop-types";
import clsx from "clsx";
import Grid from '@material-ui/core/Grid';
import Check from "@material-ui/icons/Check";



import Fab from '@material-ui/core/Fab';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import NavigationIcon from '@material-ui/icons/Navigation';

import PayPalLogo from 'assets/img/paypal-text-logo-75px.png';
import RevolutLogo from 'assets/img/revolut-text-logo-75px.png';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';

import Web3 from 'web3';
/*
  Blockstack imports
  https://forum.blockstack.org/t/how-to-encrypt-data-for-multiple-users-in-gaia/7942
*/

import {
  UserSession,
  AppConfig
} from 'blockstack';


const appConfig = new AppConfig(['store_write', 'publish_data'])
const userSession = new UserSession({ appConfig: appConfig })
const dashboardRoutes = [];

const appURL = "http://localhost:3000"
//const appURL = "https://SecretPay.io"
//Import custom style
const useQontoStepIconStyles = require('assets/styles/IconStyle.js');

//Importing Contract ABIs as JSON files
const Agreement_ABI = require('ABI/Secret_Agreement.json');
const Factory_ABI = require('ABI/Secret_Factory.json');
const ERC20_ABI = require('ABI/ERC20.json');


try{
  var web3 = new Web3(window.web3.currentProvider);
}catch {
  alert('SecretPay requires MetaMask to function.');
}


var SecretPay;
var SecretPayFactory;
var ChainlinkContractAddress = '0x20fE562d797A42Dcb3399062AE9546cd06f63280';
var ChainlinkContract;
var contractAddress;
var lastPaymentMethod;
var linkPerOracle = 1;

var newSecretPayAddress;
var newReleased;
var newTrueCount;
var newFalseCount;
var newArrayLength;
var newDeploymentTime;
var newEthAmount;
var newBuyerAddress;
var newSellerAddress;
var newInvoice;

var apiURL = 'http://localhost:8080';

var contractFactoryAddress = '0x8CE54Ac25f7Bd776daEEe0b7BA0015BF3F2c5907';
//var contractFactoryAddress = '0x5dF5Aafb124b8Cd776E10AC997d049e00903717b';


const verifiedOracles = [
  createData('Node1', '0x0D31C381c84d94292C07ec03D6FeE0c1bD6e15c1', '108a8e7de2924a5caed497fff53114b4','PayPal','-----BEGIN PUBLIC KEY-----\nMFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBANzHWJRk1MbpQzKkyTKvp9KcZ/djJCm3\n3PtUdOczwHU5LZ0TSet2ibl5drg/daKRQAf2a3gi1fxI8AImZYJMiGMCAwEAAQ==\n-----END PUBLIC KEY-----\n'),
  createData('Node2', '0x0D31C381c84d94292C07ec03D6FeE0c1bD6e15c1', '108a8e7de2924a5caed497fff53114b4','PayPal','-----BEGIN PUBLIC KEY-----\nMFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBANzHWJRk1MbpQzKkyTKvp9KcZ/djJCm3\n3PtUdOczwHU5LZ0TSet2ibl5drg/daKRQAf2a3gi1fxI8AImZYJMiGMCAwEAAQ==\n-----END PUBLIC KEY-----\n'),
 ];



const withErrorHandling = WrappedComponent => ({ showError, children }) => {
  return (
    <WrappedComponent>
      {showError && <div className="error-message">Oops! Something went wrong! Install MetaMask or try again.</div>}
      {children}
    </WrappedComponent>
  );
};


var web3;

const DivWithErrorHandling = withErrorHandling(({children}) => <div>{children}</div>)


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
        <Check className={classes.comp1leted} />
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
      getAccounts();
		}
		// Non-DApp Browsers
		else {
            this.toggleError();
		}
  }

function createData(operator, oracle, job, method,public_key) {
  return { operator, oracle, job, method, public_key };
};

export default class SecretPage extends Component {

  state = {
    userSession: new UserSession({ appConfig:appConfig }), // coming from Blockstack
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
    deploymentTime : '',
    arrayLength : null,
    linkFee: 0,

		currentContract : '',
  };

  //buyerinteraction start
  //Loader function to retrieve the data from the contract
    loadSecretPayContract = async (SecretPayAddress) => {

      if (!SecretPayAddress.hasOwnProperty('target')){
      try{
          SecretPay = new web3.eth.Contract(Agreement_ABI, SecretPayAddress);
          
          await SecretPay.methods.released().call().then(function (res) { if (res != null){this.setState({ released  : res })}}.bind(this));
          await SecretPay.methods.trueCount().call().then(function (res) {  this.setState({ trueCount  : res })}.bind(this));
          await SecretPay.methods.falseCount().call().then(function (res) { this.setState({ falseCount : res })}.bind(this));
          await SecretPay.methods.invoiceID().call().then(async function (res) {                               
              //const { RSAKey } = this.state;               
              //const cryptico = require('node-cryptico');
              

              var DecryptedInvoice = await this.decryptInvoice(res, this.state.PrivateKey);
              
              //var DecryptionResult = cryptico.decrypt(res, RSAKey);
              //var DecryptedInvoice = DecryptionResult.plaintext
              
              this.setState({ DecryptedInvoice: DecryptedInvoice });
              this.setState({ EncryptedInvoice : res });
              
            
            }.bind(this));
          await SecretPay.methods.sellerAddress().call().then(function (res) {  this.setState({ sellerAddress : res })}.bind(this));
          await SecretPay.methods.buyerAddress().call().then(function (res) {   this.setState({ buyerAddress  : res })}.bind(this));
          await SecretPay.methods.amount().call().then(function (res) { this.setState({ ethAmount : res })}.bind(this));
          await SecretPay.methods.deploymentTime().call().then(function (res) { this.setState({ deploymentTime : res })}.bind(this));
          await SecretPay.methods.getjobIds().call().then(function (res) {this.setState({ job_ids : res })}.bind(this));
          await SecretPay.methods.getoracles().call().then(function (res) {this.setState({ oracles : res })}.bind(this));
          await SecretPay.methods.getencryptedInvoices().call().then(function (res) {            
            this.setState({ encrypted_invoices : res }) ;
          }.bind(this));
          await SecretPay.methods.getpublicKeys().call().then(function (res) {this.setState({ pubkeys : res })}.bind(this));
              
    }      // Non-DApp Browsers
    catch(error) {
      console.log(error)
        this.toggleError();
      }
    }
        else if (this.state.currentContract !='' && this.state.currentContract != null)
  {
    SecretPay = new web3.eth.Contract(Agreement_ABI, this.state.currentContract);
          
    await SecretPay.methods.released().call().then(function (res) { if (res != null){this.setState({ released  : res })}}.bind(this));
    await SecretPay.methods.trueCount().call().then(function (res) {  this.setState({ trueCount  : res })}.bind(this));
    await SecretPay.methods.falseCount().call().then(function (res) { this.setState({ falseCount : res })}.bind(this));
    await SecretPay.methods.invoiceID().call().then(async function (res) { 
                          
                
        var DecryptedInvoice = await this.decryptInvoice(res, this.state.PrivateKey);
        
        //var DecryptedInvoice = DecryptionResult.plaintext
        
        this.setState({ DecryptedInvoice: DecryptedInvoice });
        this.setState({ EncryptedInvoice : res });
        
      
      }.bind(this));
    await SecretPay.methods.sellerAddress().call().then(function (res) {  this.setState({ sellerAddress : res })}.bind(this));
    await SecretPay.methods.buyerAddress().call().then(function (res) {   this.setState({ buyerAddress  : res })}.bind(this));
    await SecretPay.methods.amount().call().then(function (res) { this.setState({ ethAmount : res })}.bind(this));
    await SecretPay.methods.deploymentTime().call().then(function (res) { this.setState({ deploymentTime : res })}.bind(this));
    await SecretPay.methods.getjobIds().call().then(function (res) {this.setState({ job_ids : res })}.bind(this));
    await SecretPay.methods.getoracles().call().then(function (res) {this.setState({ oracles : res })}.bind(this));
    await SecretPay.methods.getencryptedInvoices().call().then(function (res) {
            
      this.setState({ encrypted_invoices : res })
      
    
    }.bind(this));
    await SecretPay.methods.getpublicKeys().call().then(function (res) {this.setState({ pubkeys : res })}.bind(this));
        
  }

  else {} 

  this.checkOracles();
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

  });}

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

  
	showMethodIcon (method){

		if (method === 'PayPal') {

					return <img
											src={PayPalLogo}
											alt="..."
										/>

			}else if (method === 'Revolut'){
				return <img
				src={RevolutLogo}
				alt="..."
			/>
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

  showPaymentLink()
  {
      this.setState({paymentMethod:lastPaymentMethod})
      if (this.state.paymentMethod === 'paypal'){
          return "https://www.paypal.com/invoice/p/#" + this.state.DecryptedInvoice;         
        }
      else if (this.state.paymentMethod === 'revolut'){
          return "https://rev.money/r/" + this.state.DecryptedInvoice;
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
 
  //buyerinteraction end
  // componentDidUpdate(nextProps) {
  //   this.props = nextProps;
  //  }

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
  }  // Non-DApp Browsers
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
              web3.utils.toHex(this.state.arrayLength * linkPerOracle * Math.pow (10, 18))).send( {
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
      } else{ 
          return "";
      }
  } 

  async decryptInvoice(encryptedData, privateKey)
  { 
    
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


  async encryptInvoice(invoice,publicKey)
  {
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
  
    //curl -H "Content-Type:application/json" --data {\"publicKeys\":[\"$PUBKEY1\",\"$PUBKEY2\"],\"invoice\":\"\"} -X POST http://localhost:8080/encrypt

    return encryptedInvoice;

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

  methodFinder (){        
        
    if (this.state.job_ids != null){
      

      if (this.state.job_ids.length > 0 && verifiedOracles.length > 0 && this.state.DecryptedInvoice !=null){
      var foundIndex = verifiedOracles.findIndex(x => (x.job === this.state.job_ids[0]));
      
        if (foundIndex !== -1){       
          
          if (verifiedOracles[foundIndex].method === 'PayPal'){
            return "https://www.paypal.com/invoice/p/#" + this.state.DecryptedInvoice;         
            }
          else if (verifiedOracles[foundIndex].method === 'Revolut'){
            return "https://rev.money/r/" + this.state.DecryptedInvoice;	
          }
      }    
        }
      }
	  return "Decryptable by buyer";
    }

  onContractCreation (SecretPayAddress,released,trueCount,falseCount,arrayLength,deploymentTime,ethAmount,buyerAddress,sellerAddress,Invoice){
    newSecretPayAddress = SecretPayAddress;
    newReleased = released;
    newTrueCount=trueCount;
    newFalseCount=falseCount;
    newArrayLength=arrayLength;
    newDeploymentTime=deploymentTime;
    newEthAmount=ethAmount;
    newBuyerAddress=buyerAddress;
    newSellerAddress=sellerAddress;
    newInvoice=Invoice;
   

    this.setState({released:newReleased,SecretPayAddress:newSecretPayAddress,released:newReleased,trueCount:newTrueCount,falseCount:newFalseCount,arrayLength:newArrayLength,deploymentTime:newDeploymentTime,ethAmount:newEthAmount,buyerAddress:newBuyerAddress,sellerAddress:newSellerAddress,Invoice:newInvoice})
  // newOracleCount = oracleCount;
  }

  getGeneratedKeys = async () => {
    const { userSession } = this.state;
    //const cryptico = require('node-cryptico');
    //const niceware = require('niceware')
    const publicKeyPath = "SecretPay_pub_key.pem"
    const passPhrasePath = "SecretPay_priv_key.pem"
    

    let decryptTrue = { decrypt : true };
    let decryptFalse = { decrypt : false};
    let encryptTrue = { encrypt : true };
    let encryptFalse = { encrypt : false};
    var publicKey;
    var privateKey;
    //Retrieve the public key from the specified path in the account
    userSession.getFile(publicKeyPath, decryptFalse).then( async (data) => {
      if (data) {
        const PublicKeyString = data;
        this.PublicKeyString =PublicKeyString
        this.setState({ PublicKeyString: this.PublicKeyString});
        
      } else {
        
        await fetch(apiURL + "/generate", {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: ""
        })       .then(response => response.json())
                .then(async (jsonData) => {
                  // jsonData is parsed json object received from url
                  
                  privateKey = jsonData.privateKey
                  publicKey = jsonData.publicKey   
                  this.setState({ PrivateKey: jsonData.privateKey, PublicKey: jsonData.publicKey}); 
                  userSession
                    .putFile("SecretPay_pub_key.pem", publicKey, encryptFalse)
                    .then(data => {
                      this.setState({ PublicKeyString: this.PublicKeyString });
                  })        
                  userSession.putFile("SecretPay_priv_key.pem",privateKey, encryptTrue)
                  .then(data => {
                    this.setState({ PrivateKey: this.PrivateKey });
                  })

                }).catch((error) => {
                  // handle your errors here
                  console.error(error)
              })        
              
        //If no public key is found then generate one and store it
        //this.PassPhrase = niceware.generatePassphrase(32)        
        //this.PassString = this.PassPhrase.join(" ")
        //this.RSAKey = cryptico.generateRSAKey(this.PassString, 512);
        //this.PublicKeyString = cryptico.publicKeyString(this.RSAKey);

        //this.SendPublicKey = { PublicKeyString: this.PublicKeyString };
        //this.SendPassPhrase = { PassString: this.PassString };

        this.PublicKeyString = { PublicKeyString: publicKey };
        this.PrivateKey = { PrivateKey: privateKey };

        
    }

    //First get the public key file
    userSession.getFile(passPhrasePath, decryptTrue).then(data => {
      if (data) {
        this.PrivateKey = data;
        this.setState({ PrivateKey: this.PrivateKey});        
      }
  });

  this.setState({ PublicKeyString: this.PublicKeyString});
  
  })};

  changeHandler = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  /*
    This function is used to encrypt the invoices from the nodes public keys.
    Therefore there isn't a need to load them as they are hard coded into the website.
  */

  handleSignIn(e) {
    const redirect = `${window.location.origin}/secret`
    const manifest = `${window.location.origin}/manifest.json`

    e.preventDefault();
    
    userSession.redirectToSignIn(redirect, manifest);
  }

  handleSignOut(e) {
    e.preventDefault();
    userSession.signUserOut(window.location.origin);
  }

  componentDidMount = async () => {
    const { userSession } = this.state;

    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        window.history.replaceState({}, document.title, "/secret")
        this.setState({ userData: userData })
      });
    }
    this.getGeneratedKeys()
  }

  ////// Create Contract Functions start
	

 getAccounts = () =>{
	web3.eth.getAccounts().then(accounts => { 
			
		this.setState({ account: accounts[0]});
		console.log(accounts);
	
	});}

	//Loads the web3 Metamask confirmations and Checks for Events
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

	async componentWillMount() {
		this.loadBlockChain()
	}
	
	onSubmit = async (event) =>{

    this.setState({ loading: false, createDisabled:false,createBtnMessage: "Submitting..."});
    
		var oracles = []
		var job_ids = []
    var node_encryptedInvoices = []
    var pub_keys = []
		for (let i = 0; i < this.state.options.length; i++) {
				oracles.push(verifiedOracles[this.state.options[i]].oracle);
        job_ids.push(verifiedOracles[this.state.options[i]].job);
        //node_encryptedInvoices.push(this.encryptInvoiceNodes(verifiedOracles[this.state.options[i]].public_key));
        node_encryptedInvoices.push(await this.encryptInvoice(this.state.Invoice,verifiedOracles[this.state.options[i]].public_key));        
        pub_keys.push(verifiedOracles[this.state.options[i]].public_key.toString());
    }		  

		event.preventDefault();
    this.setState({ oracleCount: oracles.length, loading: true, errorMessage: ''});
  
    var blockstackAddress = "";
    var blockstackGaiaStorage = "";
    var targetBlockStackKey = "";
    var tempEncryptedInvoice = "";

    fetch("https://core.blockstack.org/v1/names/"+this.state.BuyerBlockstackID)
        .then(response => response.json())
        .then((jsonData) => {
          // jsonData is parsed json object received from url
 
          blockstackAddress = jsonData.address;
          
          fetch("https://gaia.blockstack.org/hub/"+blockstackAddress+"/profile.json")
            .then(response => response.json())
            .then((jsonData) => {
              // jsonData is parsed json object received from url

              blockstackGaiaStorage = jsonData[0].decodedToken.payload.claim.apps[appURL];

              fetch(blockstackGaiaStorage + "SecretPay_pub_key.pem")
                .then(response => response.text())
                .then(async (response) => await this.encryptInvoice(this.state.Invoice, response))
                .then(async (response) => {
                  
                  // var EncryptionResult = await this.encryptInvoice(this.state.Invoice+'dff', response);
                  tempEncryptedInvoice = response;
                  
                  this.setState({tempEncrypted:tempEncryptedInvoice});
                  
                  try{
                    this.setState({ loading: false, createDisabled:false,createBtnMessage: "Submitting..."});
                    SecretPayFactory.methods.createSecretPay(web3.utils.asciiToHex('blockstack_id'), tempEncryptedInvoice, this.state.eth_address, job_ids, oracles,pub_keys,node_encryptedInvoices).send({from:this.state.account,value:web3.utils.toWei(this.state.eth_amount,'ether')});
                  }catch(err){
                    console.log(err)
                    this.toggleError();
                  };               

                })
                .catch((error) => {
                  // handle your errors here
                  console.error(error)
              })

            })
            
            .catch((error) => {
              // handle your errors here
              console.error(error)
          })

        })
        .catch((error) => {
          // handle your errors here
          console.error(error)
        })
       
			// this.setState({createBtnMessage:'Complete'});
		// const accounts = await web3.eth.getAccounts();
		// const driverCd = await factory.methods.getDeployedContract(this.state.driver).call();
  }
  
  ////// Create Contract Functions end
  render() {
    const { userSession, currentUser, DecryptedInvoice, EncryptedInvoice, Invoice } = this.state;
    return (
        <div>
          <Header
            color="white"
            routes={dashboardRoutes}
            brand="SecretPay"
            rightLinks={ <HeaderLinks/>}
            fixed
            changeColorOnScroll={{
              height: 400,
              color: "white"
            }}
          />
          {/* TODO move inline style to file */}
           <div className="SecretPage" style={{marginTop:"70px"}}>


              {/* blockstack addition here */}

                        
            <div className="PrivatePage">
              <div className="PrivatePage-inner">
                {// Run a check here to see if Public/Private keys are null or not
                  !userSession.isUserSignedIn() ?
                    <Signin userSession={userSession} handleSignIn={this.handleSignIn} />
                    : routeProps =>  <Profile userSession={userSession} handleSignOut={this.handleSignOut} {...routeProps}  />

                }
                {userSession.isUserSignedIn() ? (
                  <div className="hello" >                    
                    <div style={{display:"flex",paddingTop:"50px",alignItems:"center",justifyContent:"center",flexDirection:"row"}}>
                    <button className="button" onClick={this.generateKeys} style={{fontSize:"15px", color: "#fff", backgroundColor: "#270f34", border: "10px solid #270f34",alignItems:"center"}}>
                      <strong>Sign out of Blockstack Authentication</strong>
                    </button>
                    </div>
                    <div className="forms">
                      <div className="Invoice">
                        {/* Using public key to encrypt the invoice ID*/}
                         {/* blockstack end here */}
                        <div className="SecretPage-inner">
                          <GridContainer justify="center">
                              {/* <GridItem xs={12} sm={12} md={8} className={classes.navWrapper}>
                              <h2 style={{}} className={classes.title}>SecretPay Standard</h2>     */}
                              <GridItem xs={12} sm={12} md={8}>
                              <h2>SecretPay Secret</h2>    

                              <h5> BlockStack decentralised is used for storing and retrieving encryption keys for SecretPay agreements. </h5>
                                                            
                              <NavPills
                                  alignCenter
                                  color="primary"
                                  tabs={[
                                  {
                                      tabButton: "Sell",
                                      // tabIcon: Camera,
                                      tabContent: (                                              
                                            <div id="selling" className={styles.section}>
                                              <div>    
                                                <div>
                                                  <Grid container justify = "center" className={styles.grid}>
                                                      <Grid item xs={12}>
                                                      <Typography variant="h5" component="h3">
                                                      Step 1: Find a buyer
                                                      </Typography>
                                                      <div class={styles.steps}>
                                                      SecretPay does not yet offer order matching, however you may find a trader looking to buy ETH at the following forums: <ul><li><a href="https://www.reddit.com/r/SecretPay/">SecretPay subreddit</a></li><li><a href="https://t.me/joinchat/E8SAPEUVQHSiKjSyGWkf9g">SecretPay Telegram group</a></li></ul> </div>
                                                      </Grid>
                                                      <Grid item xs={12}>
                                                      <Typography variant="h5" component="h2">
                                                      Step 2: Create a FIAT payment link
                                                      </Typography>
                                                      <div class={styles.steps}>
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
                                                      </Grid>
                                                      <Grid item xs={12}>
                                                      <Typography variant="h5" component="h3">
                                                      Step 3: Create a SecretPay smart contract
                                                      </Typography><br/>
                                                      <div class={styles.steps}>
                                                      {/* <div><CreateSecretPay createHandler={this.onContractCreation}/></div>;                                       */}
                                                      <DivWithErrorHandling  style={{margin:"0px"}} showError={this.state.showError}>      
                                                              <h5>Enter the details required for creating a SecretPay contract: </h5>
                                                              {/* <div className={classes}> */}
                                                              <div>
                                                                <Grid container  justify = "center" spacing={1} alignItems="flex-end">
                                                                  <Grid item> 
                                                                  <FormControl component="fieldset">
                                                                    <FormLabel component="legend">Payment Method</FormLabel>								
                                                                    <RadioGroup value={this.state.payment} onChange={event => this.handlePaymentChange(event)}>
                                                                        <FormControlLabel value="paypal" control={<Radio />} label={this.showMethodIcon("PayPal")} />
                                                                        <FormControlLabel value="revolut" control={<Radio />} label={this.showMethodIcon("Revolut")} />
                                                                    </RadioGroup>
                                                                  </FormControl>                                                          
                                                                  </Grid>
                                                                </Grid>            
                                                              </div>
                                                              <div>
                                                                <Grid container  justify = "center" spacing={1} alignItems="flex-end">
                                                                  <Grid item> 
                                                                  <TextField
                                                                      onChange ={event => this.setState({ Invoice: event.target.value})}
                                                                      id="filled-textarea"
                                                                      label="Payment or Invoice ID"
                                                                      placeholder="eg. ABCDEFGHIC9BJR2Y"
                                                                      multiline
                                                                      style = {{width: 430}}
                                                                      margin="normal"
                                                                      variant="filled"
                                                                    />
                                                                  </Grid>
                                                                  </Grid>
                                                                <Grid container  justify = "center" spacing={1} alignItems="flex-end">
                                                                  <Grid item>
                                                                  <TextField
                                                                      onChange ={event => this.setState({ eth_amount: event.target.value})}
                                                                      id="filled-textarea"
                                                                      label="ETH Amount"
                                                                      placeholder="eg. 1.234"
                                                                      multiline
                                                                      style = {{width: 430}}
                                                                      margin="normal"
                                                                      variant="filled"
                                                                    />
                                                                  </Grid>
                                                                </Grid>       
                                                                <Grid container  justify = "center" spacing={1} alignItems="flex-end">
                                                                  <Grid item>
                                                                  <TextField
                                                                      onChange ={event => this.setState({ eth_address: event.target.value})}
                                                                      id="filled-textarea"
                                                                      label="Buyer ETH Address"
                                                                      placeholder="eg. 0xA1B2C3D4E5F6G..."
                                                                      multiline
                                                                      style = {{width: 430}}
                                                                      margin="normal"
                                                                      variant="filled"
                                                                    />
                                                                  </Grid>
                                                                </Grid>     
                                                                <Grid container  justify = "center" spacing={1} alignItems="flex-end">
                                                                  <Grid item>
                                                                  <TextField
                                                                      onChange ={event => this.setState({ BuyerPublicKey: event.target.value})}
                                                                      id="filled-textarea"
                                                                      label="Buyer Public Key"
                                                                      placeholder="eg. mralderson.id.blockstack"
                                                                      multiline
                                                                      style = {{width: 430}}
                                                                      margin="normal"
                                                                      variant="filled"
                                                                    />
                                                                  </Grid>
                                                                </Grid>       
                                                                <Grid container  justify = "center" spacing={1} alignItems="flex-end">
                                                                  <Grid item>
                                                                  <TextField
                                                                      onChange ={event => this.setState({ BuyerPublicKey: event.target.value})}
                                                                      id="filled-textarea"
                                                                      label="Seller Public Key"
                                                                      placeholder="eg. mralderson.id.blockstack"
                                                                      multiline
                                                                      style = {{width: 430}}
                                                                      margin="normal"
                                                                      variant="filled"
                                                                    />
                                                                  </Grid>
                                                                </Grid>            
                                                              </div>
                                                              <div>
                                                              {/* <h5>Select 1 or more PayPal oracle providers (each oracle request will cost 0.2 LINK): </h5> */}
                                                              <h5>FIAT payment verification is done by one or more Chainlink oracles that verify whether or not the Revolut or Paypal payment has been completed. ETH is unlocked once 50%+ of oracles have voted yes on the payment's success. Select 1 or more Chainlink oracles for payment verification below. Each oracle query costs 0.25 LINK in Chainlink network fees. </h5>
                                                                <Grid container  justify = "center" spacing={1} alignItems="flex-end">
                                                                  <Grid item>
                                                                    
                                                                  <Table aria-label="simple table">
                                                                    <TableHead>
                                                                      <TableRow>
                                                                      <TableCell><b>Enabled</b></TableCell>
                                                                        <TableCell align="center"><b>Operator</b></TableCell>
                                                                        <TableCell align="center"><b>Job ID</b></TableCell>
                                                                        <TableCell align="center"><b>Method</b></TableCell>
                                                                      </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                      {verifiedOracles.map((row,index) => (                    
                                                                        <TableRow>
                                                                            <TableCell padding="checkbox">
                                                                            <Checkbox value={index} disabled={this.isSelected(row.method)} onChange={event => this.handleChangeChk(event)}  />
                                                                          </TableCell>
                                                                          <TableCell component="th" scope="row">
                                                                            {row.operator}
                                                                          </TableCell>
                                                                          <TableCell align="right">{row.job}</TableCell>
                                                                          <TableCell align="right">{this.showMethodIcon(row.method)}</TableCell>
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
                                                      </Grid>
                                                            <br/>
                                                      <Grid item xs={12}>
                                                      <Typography variant="h5" component="h3">
                                                      Step 4: Fund contract with LINK
                                                      </Typography><br/>
                                                      <div class={styles.steps}>
                                                      {/* <InteractContract newSecretPayAddress={state.SecretPayAddress}  ethAmount={state.ethAmount}  paymentMethod={state.paymentMethod}  invoiceID={state.Invoice}  trueCount={state.trueCount}  falseCount={state.falseCount}  released={state.released}  sellerAddress ={state.sellerAddress }  buyerAddress  ={state.buyerAddress  }  deploymentTime ={state.deploymentTime } arrayLength ={state.arrayLength }/> */}
                                                    
                                                      <DivWithErrorHandling> 
                                                            <h5>The created contract details will show below once it is confirmed on the Ethereum network.</h5>     
                                                        {/* <div className={classes}> */}
                                                        
                                                          {(this.state.newSecretPayAddress != null) ? <div><Table aria-label="simple table">
                                                                <TableBody>                  
                                                                  <TableRow>
                                                                    <TableCell align="left"><b>Contract Address</b></TableCell>
                                                                    <TableCell align="left"> {this.state.newSecretPayAddress} </TableCell>
                                                                  </TableRow> <TableRow>  
                                                                  <TableCell align="left"><b>ETH</b></TableCell>    
                                                                  <TableCell align="left"> {this.state.ethAmount/1000000000000000000} </TableCell>     
                                                                          </TableRow>         
                                                                  <TableRow> 
                                                                  <TableCell align="left"><b>Payment method</b></TableCell>
                                                          <TableCell align="left">                                                           
                                                                        {                                                                                                                        
                                                                          this.methodFinder()
                                                                        }      
                                                            </TableCell>
                                                                  </TableRow>    
                                                        <TableRow>   
                                                            <TableCell align="left"><b>Encrypted Invoice</b></TableCell>
                                                            <TableCell align="left"> {this.state.EncryptedInvoice}</TableCell>
                                                        </TableRow>    
                                                        <TableRow>             
                                                                  <TableCell align="left"><b>Buyer Address</b></TableCell>
                                                                    <TableCell align="left"> {this.state.buyerAddress} </TableCell>
                                                                          </TableRow>    
                                                                  <TableRow>    
                                                                  <TableCell align="left"><b>Seller Address</b></TableCell>     
                                                                    <TableCell align="left"> {this.state.sellerAddress} </TableCell>
                                                                          </TableRow>    
                                                                  <TableRow>   
                                                                  <TableCell align="left"><b>Redeemed</b></TableCell>      
                                                                    <TableCell align="left"> {this.showRedeemed()} </TableCell>
                                                                          </TableRow>    
                                                                  <TableRow>
                                                                  <TableCell align="left"><b>Created</b></TableCell>
                                                                    <TableCell align="left"> {this.state.deploymentTime} </TableCell>
                                                                          </TableRow>    
                                                                  <TableRow>
                                                                  <TableCell align="left"><b>True Checks</b></TableCell>
                                                                    <TableCell align="left"> {this.state.trueCount} </TableCell>
                                                                          </TableRow>    
                                                                  <TableRow>
                                                                  <TableCell align="left"><b>False Checks</b></TableCell>
                                                                    <TableCell align="left"> {this.state.falseCount} </TableCell>    
                                                                  </TableRow>    
                                                              </TableBody>
                                                            </Table>
                                                            
                                                            <h5>SecretPay contracts use Chainlink off-chain oracles for verifying PayPal invoice payments. These queries are paid with LINK. For testnet purposes, 1 testnet LINK is required per oracle request. </h5>     
                                                            <div>
                                                              <Grid container  justify = "center" spacing={1} alignItems="flex-end">
                                                              <Grid item>
                                                            <br/>
                                                            {this.state.linkFee>0 && <Fab variant="extended" padding={5} onClick={this.onClickFund} aria-label="like">
                                                              <NavigationIcon />
                                                              Fuel Contract with {this.state.linkFee} LINK
                                                            </Fab>} 
                                                            </Grid>
                                                          </Grid>            
                                                        </div></div> : ""}

                                                      </DivWithErrorHandling>  
                                                    </div>
                                                      </Grid>
                                                      <Grid item xs={12}>
                                                      <Typography variant="h5" component="h3">
                                                      Step 5: Interacting with buyer
                                                    </Typography><br/>  
                                                    <div ><h5>Now that you have your contract set up:<ul><li>Inform the buyer that the ETH is in lock up pending their payment</li><li>If payment is not done within 24 hours of deployment, you may withdraw your ETH and LINK.</li><li>Once payment is done, the oracles must be queried through the menu in the the Buying section to confirm and send the ETH to the buyer. </li></ul></h5></div>
                                                    </Grid></Grid>
                                                </div>          
                                            </div>
                                          </div>                                                          
                                      )
                                  },
                                  {
                                      tabButton: "Buy",
                                      // tabIcon: Palette,
                                      tabContent: (

                                        <div  id="buying" className={styles.section}>
                                          <div>
                                              <div>                                    
                                                <Grid container direction={'column'} justify = "center" className={styles.grid}>
                                                  {/* <Paper className={classes.root}> */}
                                                  <Grid item align="center">
                                                    <Typography variant="h5" component="h3">
                                                    Step 1: Find a seller
                                                    </Typography><br/>
                                                    </Grid>
                                                  <div class={styles.steps}>                                                    
                                                    <h5>Find a trader looking to sell ETH through Paypal or Revolut on: <ul><li><a href="http://www.reddit.com/r/SecretPay/">SecretPay subreddit</a></li><li><a href="https://t.me/joinchat/E8SAPEUVQHSiKjSyGWkf9g">SecretPay Telegram group</a></li></ul>
                                                    <h5>Provide only the following information to the other party:</h5>
                                                    <ol><li>Your ETH address to receive the purchased ETH</li><li>Agreed upon trade amounts in ETH and FIAT</li></ol></h5>
                                                  </div>
                                                    {/* <Divider variant="middle" /> */}
                                                  <Grid item align="center">
                                                    <Typography variant="h5" component="h2">
                                                    Step 2: Find and verify contract
                                                    </Typography>
                                                    </Grid>
                                                    <div class={styles.steps}>
                                                    <div><h5>It is of utmost importance to take the following precautions when buying ETH using SecretPay: <ol><li> Do not interact with any payment details sent to you directly by a seller, as fraudsters may send a different invoice from the one listed on the SecretPay contract, resulting in the ETH not being unlocked when paid.</li> <li>Ask the seller to provide the newly created SecretPay contract, which will have it's details loaded below if it was created using the verified SecretPay contract creator.</li><li>Make sure that the oracles chosen by the seller are SecretPay Verified, as noted in the below table. Should the seller input dummy Chainlink node details and the payment is affected from your end, there may be no way of redeeming the ETH if the Chainlink nodes are not responding.  </li></ol> </h5>
                                                    
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
                                                                        <TableCell align="left"><b>Payment method</b></TableCell>
                                                                <TableCell align="right">
                                                                        {(this.state.job_ids.length > 0 && verifiedOracles.length > 0) ? (                                                                                                                           
                                                                          verifiedOracles[verifiedOracles.findIndex(x => (x.job === this.state.job_ids[0]))].method
                                                                        ) : (
                                                                          ""
                                                                        )}
                                                                   </TableCell>
                                                                        </TableRow>        
                                                              <TableRow>
                                                              <TableCell align="left"><b>Invoice</b></TableCell>
                                                                <TableCell align="right"> {this.methodFinder()}  </TableCell>
                                                                  </TableRow>    
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
                                                                {this.state.verified ? 'SecretPay Verified' : 'Oracles not verifiable by SecretPay'}  
                                                              </TableCell>
                                                              </TableRow>    
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
                                                      </div> 
                                                    </div> 
                                                  </Grid>
                                            </div>
                                          </div>
                                        </div>

                                      )
                                  }
                                  ]}
                              />
                              </GridItem>
                          </GridContainer>
                      </div>
                      </div>                 

                    </div>
                  </div>
                ) : null}
                  
                  
              </div>
            </div>             
          </div>
          <Footer />
        </div>
      );
  }
}