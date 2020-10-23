import React,{ Component } from 'react';

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

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

import PayPalLogo from 'assets/img/paypal-text-logo-75px.png';
import RevolutLogo from 'assets/img/revolut-text-logo-75px.png';

import Web3 from 'web3';

//Factory Contract Address Ropsten Factory = 0xd770fa5b25ce0c48ccfbd925b753322c1f69bcb3
var contractFactoryAddress = '0x3BF6e2e7B2AfC7032fF628e301034Ae387A3bE95';

const verifiedOracles = [
  createData('Node1', '0x0D31C381c84d94292C07ec03D6FeE0c1bD6e15c1', '7a952e01d59545dd9ca00f667becb0b0','PayPal'),
  createData('Node2', '0x0D31C381c84d94292C07ec03D6FeE0c1bD6e15c1', '7a952e01d59545dd9ca00f667becb0b0','PayPal')
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
const Agreement_ABI = require('ABI/Standard_Agreement.json');
const Factory_ABI = require('ABI/Standard_Factory.json');

function createData(operator, oracle, job, method) {
  return { operator, oracle, job, method };
};

var SecretPayFactory;
var SecretPay;

export default class ContractInteraction extends React.Component {
	  	
	state ={
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
		payment:''
	};
	
	    //Loader function to retrieve the data from the contract
async loadSecretPayContract(SecretPayAddress){
  try{
      SecretPay = new web3.eth.Contract(Agreement_ABI,SecretPayAddress);
      await SecretPay.methods.released().call().then(function (res) { if (res != null){this.setState({ released  : res })}}.bind(this));
      await SecretPay.methods.trueCount().call().then(function (res) {  this.setState({ trueCount  : res })}.bind(this));
      await SecretPay.methods.falseCount().call().then(function (res) { this.setState({ falseCount : res })}.bind(this));
      await SecretPay.methods.invoiceID().call().then(function (res) {  this.setState({ invoice_id : res })}.bind(this));
      await SecretPay.methods.sellerAddress().call().then(function (res) {  this.setState({ sellerAddress : res })}.bind(this));
      await SecretPay.methods.buyerAddress().call().then(function (res) {   this.setState({ buyerAddress  : res })}.bind(this));
      await SecretPay.methods.amount().call().then(function (res) { this.setState({ ethAmount : res })}.bind(this));
      await SecretPay.methods.deploymentTime().call().then(function (res) { this.setState({ deploymentTime : res })}.bind(this));
      await SecretPay.methods.getjobIds().call().then(function (res) {this.setState({ job_ids : res })}.bind(this));
	  await SecretPay.methods.getoracles().call().then(function (res) {this.setState({ oracles : res })}.bind(this));
	  this.props.createHandler(SecretPayAddress,this.state.released,this.state.trueCount,this.state.falseCount,this.state.arrayLength,this.state.deploymentTime,this.state.ethAmount,this.state.buyerAddress,this.state.sellerAddress,this.state.invoice_id, this.state.oracles,this.state.job_ids);
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
		var oracles = []
		var job_ids = []
		for (let i = 0; i < this.state.options.length; i++) {
				oracles.push(verifiedOracles[this.state.options[i]].oracle);
				job_ids.push(verifiedOracles[this.state.options[i]].job);
		}		

		event.preventDefault();
		this.setState({ oracleCount: oracles.length, loading: true, errorMessage: ''});

		try{	
			console.log('Get all accounts')
			console.log('CHECK THIS CONSOLE')
			this.setState({ loading: false, createDisabled:false,createBtnMessage: "Processing..."});
			await SecretPayFactory.methods.createSecretPay(this.state.invoice_id, this.state.eth_address, job_ids, oracles).send({from:this.state.account,value:web3.utils.toWei(this.state.eth_amount,'ether')});
			
		}catch(err){
			console.log(err)
			this.toggleError();
		};
			// this.setState({createBtnMessage:'Complete'});
		// const accounts = await web3.eth.getAccounts();
		// const driverCd = await factory.methods.getDeployedContract(this.state.driver).call();
	}

    render(){
		return(  
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
                  onChange ={event => this.setState({ invoice_id: event.target.value})}
                  id="filled-textarea"
                  label="Payment or Invoice ID"
                  placeholder="eg. ABCDEFGHIC9BJR2Y"
                  multiline
                  style = {{width: 430}}
                  margin="normal"
                  variant="filled"
                />
              </Grid>
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
          </div>
          <div>
            <Grid container  justify = "center" spacing={1} alignItems="flex-end">
              <Grid item>
              <TextField
                  onChange ={event => this.setState({ eth_address: event.target.value})}
                  id="filled-textarea"
                  label="Buyer ETH Address"
                  placeholder="eg. 0xA1B2C3D4E5F6G..."
                  multiline
                  style = {{width: 430, paddingBottom: 20}}
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
                  <TableCell></TableCell>
                    <TableCell><b>Operator</b></TableCell>
                    <TableCell align="right"><b>Job ID</b></TableCell>
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
                      <TableCell align="right">{row.oracle}</TableCell>
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
        )
    }
 }