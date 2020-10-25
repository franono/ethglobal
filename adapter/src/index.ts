const Web3 = require('web3');

import { PrivateKey, Users, MailboxEvent, UserMessage } from '@textile/hub'

const axios = require('axios');
let web3 = new Web3();
web3.setProvider(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/b6c09545ab344b1dbce48d6a5deaadfa"));


//const web3 = new Web3("http://172.16.10.47:8545");

var fs = require('fs');
var jsonFile = "./Secret_Agreement.json";
//#console.log(jsonFile)
var contract_abi = JSON.parse(fs.readFileSync(jsonFile));
//var contract_abi = fs.readFileSync(jsonFile);
//#var contract_abi = parsed.abi;
//#console.log(contract_abi)

contract_abi = [
        {
                "constant": true,
                "inputs": [
                        {
                                "name": "",
                                "type": "uint256"
                        }
                ],
                "name": "nodeKeys",
                "outputs": [
                        {
                                "name": "",
                                "type": "string"
                        }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
        },
        {
                "constant": false,
                "inputs": [
                        {
                                "name": "_requestId",
                                "type": "bytes32"
                        },
                        {
                                "name": "paid",
                                "type": "bool"
                        }
                ],
                "name": "fulfillNodeRequest",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
        },
        {
                "constant": true,
                "inputs": [],
                "name": "getmsgIDs",
                "outputs": [
                        {
                                "name": "",
                                "type": "string[]"
                        }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
        },
        {
                "constant": true,
                "inputs": [],
                "name": "falseCount",
                "outputs": [
                        {
                                "name": "",
                                "type": "uint8"
                        }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
        },
        {
                "constant": true,
                "inputs": [],
                "name": "sellerKey",
                "outputs": [
                        {
                                "name": "",
                                "type": "string"
                        }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
        },
        {
                "constant": true,
                "inputs": [],
                "name": "getChainlinkToken",
                "outputs": [
                        {
                                "name": "",
                                "type": "address"
                        }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
        },
        {
                "constant": true,
                "inputs": [],
                "name": "buyerKey",
                "outputs": [
                        {
                                "name": "",
                                "type": "string"
                        }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
        },
        {
                "constant": true,
                "inputs": [],
                "name": "trueCount",
                "outputs": [
                        {
                                "name": "",
                                "type": "uint8"
                        }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
        },
        {
                "constant": true,
                "inputs": [],
                "name": "getnodeKeys",
                "outputs": [
                        {
                                "name": "",
                                "type": "string[]"
                        }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
        },
        {
                "constant": true,
                "inputs": [],
                "name": "sellerAddress",
                "outputs": [
                        {
                                "name": "",
                                "type": "address"
                        }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
        },
        {
                "constant": true,
                "inputs": [
                        {
                                "name": "",
                                "type": "uint256"
                        }
                ],
                "name": "jobIds",
                "outputs": [
                        {
                                "name": "",
                                "type": "string"
                        }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
        },
        {
                "constant": true,
                "inputs": [],
                "name": "buyerAddress",
                "outputs": [
                        {
                                "name": "",
                                "type": "address"
                        }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
        },
        {
                "constant": true,
                "inputs": [],
                "name": "getjobIds",
                "outputs": [
                        {
                                "name": "",
                                "type": "string[]"
                        }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
        },
        {
                "constant": true,
                "inputs": [],
                "name": "getLinkBalance",
                "outputs": [
                        {
                                "name": "",
                                "type": "uint256"
                        }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
        },
        {
                "constant": true,
                "inputs": [
                        {
                                "name": "x",
                                "type": "address"
                        }
                ],
                "name": "toString",
                "outputs": [
                        {
                                "name": "",
                                "type": "string"
                        }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
        },
        {
                "constant": true,
                "inputs": [
                        {
                                "name": "",
                                "type": "uint256"
                        }
                ],
                "name": "oracles",
                "outputs": [
                        {
                                "name": "",
                                "type": "address"
                        }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
        },
        {
                "constant": false,
                "inputs": [],
                "name": "withdrawLink",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
        },
        {
                "constant": true,
                "inputs": [],
                "name": "released",
                "outputs": [
                        {
                                "name": "",
                                "type": "bool"
                        }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
        },
        {
                "constant": true,
                "inputs": [
                        {
                                "name": "",
                                "type": "uint256"
                        }
                ],
                "name": "msgIDs",
                "outputs": [
                        {
                                "name": "",
                                "type": "string"
                        }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
        },
        {
                "constant": true,
                "inputs": [],
                "name": "amount",
                "outputs": [
                        {
                                "name": "",
                                "type": "uint256"
                        }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
        },
        {
                "constant": false,
                "inputs": [],
                "name": "requestConfirmations",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
        },
        {
                "constant": true,
                "inputs": [],
                "name": "getoracles",
                "outputs": [
                        {
                                "name": "",
                                "type": "address[]"
                        }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
        },
        {
                "constant": true,
                "inputs": [
                        {
                                "name": "",
                                "type": "address"
                        }
                ],
                "name": "linkbalances",
                "outputs": [
                        {
                                "name": "",
                                "type": "uint256"
                        }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
        },
        {
                "constant": false,
                "inputs": [],
                "name": "withdrawETH",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
        },
        {
                "constant": true,
                "inputs": [],
                "name": "deploymentTime",
                "outputs": [
                        {
                                "name": "",
                                "type": "uint256"
                        }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
        },
        {
                "constant": false,
                "inputs": [
                        {
                                "name": "_amount",
                                "type": "uint256"
                        }
                ],
                "name": "depositLink",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
        },
        {
                "inputs": [
                        {
                                "name": "_sellerKey",
                                "type": "string"
                        },
                        {
                                "name": "_buyerKey",
                                "type": "string"
                        },
                        {
                                "name": "_nodeKeys",
                                "type": "string[]"
                        },
                        {
                                "name": "_sellerAddress",
                                "type": "address"
                        },
                        {
                                "name": "_buyerAddress",
                                "type": "address"
                        },
                        {
                                "name": "_amount",
                                "type": "uint256"
                        },
                        {
                                "name": "_jobIds",
                                "type": "string[]"
                        },
                        {
                                "name": "_oracles",
                                "type": "address[]"
                        },
                        {
                                "name": "_msgIDs",
                                "type": "string[]"
                        }
                ],
                "payable": true,
                "stateMutability": "payable",
                "type": "constructor"
        },
        {
                "anonymous": false,
                "inputs": [
                        {
                                "indexed": false,
                                "name": "success",
                                "type": "bool"
                        }
                ],
                "name": "successNodeResponse",
                "type": "event"
        },
        {
                "anonymous": false,
                "inputs": [
                        {
                                "indexed": true,
                                "name": "id",
                                "type": "bytes32"
                        }
                ],
                "name": "ChainlinkRequested",
                "type": "event"
        },
        {
                "anonymous": false,
                "inputs": [
                        {
                                "indexed": true,
                                "name": "id",
                                "type": "bytes32"
                        }
                ],
                "name": "ChainlinkFulfilled",
                "type": "event"
        },
        {
                "anonymous": false,
                "inputs": [
                        {
                                "indexed": true,
                                "name": "id",
                                "type": "bytes32"
                        }
                ],
                "name": "ChainlinkCancelled",
                "type": "event"
        }
]

class Response {
    jobRunID: string;
    statusCode: number;
    status?: string;
    data?: any;
    error?: any;
    pending?: any;
}

export class JobRequest {
    id: string;
    data: Request;
}

export class Request {
    address: string;
    paid: boolean;
}

export class GetRequest extends Request {
    address: string;
}

var client;
declare var TextDecoder: any


const getInvoice = async (data: Request) => {
    return new Promise((async (resolve, reject) => {          
        
        console.log(data);
        if (!('address' in data) )
            return reject({statusCode: 400, data: "missing required parameters"});

        var invoiceJSON;
        const address = data.address;
        // let current_invoice = <Request>{paid: false, invoice_id:invoice_id,method:method};

        var contract_address = address;
	console.log(contract_address)
        const contract = new web3.eth.Contract(contract_abi, contract_address);
        const PrivateKeyIdentity = 'bbaareqhh3wbt3z2vz7o6f2ywixxq5ooczhuqba2n5ujtisxgkuy5hkepgehuogtcp4nc27lgqzcd2pntc4hm6w4njfvq3d56mmuslwtrd5fzc'
 
        var messageIDs = await contract.methods.getmsgIDs().call();
	console.log(messageIDs)
        const identity = PrivateKey.fromString(PrivateKeyIdentity)
    
        // Connect to the API with hub keys.
        // Use withUserAuth for production.
        // this.client = await Users.withKeyInfo({key: 'bbrf24kbdsag6z3hcomvx6wkzfm',secret: 'bv67s3j5e3dxi53kgqtsqclloboozjokzna6laoq'})
        client = await Users.withKeyInfo({key: 'bbrf24kbdsag6z3hcomvx6wkzfm'})
    
        // Authorize the user to access your Huh api
        await client.getToken(identity)
    
        // Setup the user's mailbox
        const mailboxID = await client.setupMailbox()
         
        for(var i = 0; i<messageIDs.length;i++){
            // Grab all existing inbox messages and decrypt them locally
            const messages = await client.listInboxMessages({ limit:1, seek: messageIDs[i]  })
            console.log(messages)
            const inbox = []
            for (const message of messages) {

                const bytes = await identity.decrypt(message.body)
                const body = new TextDecoder().decode(bytes)    
				invoiceJSON = JSON.parse(body)
            }
        }
        
        var method = invoiceJSON.type;
        var invoice_id = invoiceJSON.invoice;
        let current_invoice = <Request>{paid: false, address:invoice_id};

        if(method === 'paypal') {
            
            var re = new RegExp(/(?<=invoiceStatus isPaid\">).*?(?=<\/div)/)
            const baseURL = 'https://www.paypal.com/invoice/payerView/detailsInternal/';
            const url = baseURL + invoice_id;
            axios(url)
            .then((response: any) => {
                try {
                    //https://main-rpc.linkpool.io
                    if(response.status === 200) {
                        
                        const html = response.data.content;
                        
                        var paid = html.match(re)
                        
                        if (paid != null){
                            current_invoice.paid = true;                                
                            }   

                    }
                    return resolve({statusCode: response.status, data: current_invoice});   
                            
                    }catch(error) {
                        return resolve({statusCode: 404, data: current_invoice});   
                    }
            
            }).catch((error:any) => {
                return reject({statusCode: 404, data: error});
            });
         }else if (method === 'revolut') {
            
            var re = new RegExp(/(?<=;">).*?(?=<\/pre)/)
            const baseURL = 'https://rev.money/api/money-request/';
            const url = baseURL + invoice_id;
            axios(url)
            .then((response: any) => {

                try {
                    
                    console.log("data: " + Object.entries(response.data));
                    if(response.status === 200) {
                        
                        const obj = JSON.parse(JSON.stringify(response.data));
                        
                        // if (('message' in data)){
                        //         //not paid
                        //         return resolve({statusCode: response.status, data: current_invoice});

                        if ('state' in obj){

                            if (obj.state == 'ACCEPTED'){
                                current_invoice.paid = true;   
                            }
                        }                           
                    }
                        return resolve({statusCode: response.status, data: current_invoice});

                    }catch(error) {
                        return reject({statusCode: 404, data: current_invoice});   
                    }
            
            }).catch((error:any) => {
                return reject({statusCode: 404, data: error});
            });    
        }else {
            return resolve({statusCode: 404, data: current_invoice});   
        }
    
    }))
};


//getinvoice

export const createRequest = async (input: JobRequest) => {
    return new Promise((resolve, reject) => {
                const data = input.data;

        getInvoice(<Request>data)
            .then((response: any) => {
                return resolve(response);
            }).catch(reject);

    })
};

export const requestWrapper = async (req: JobRequest): Promise<Response> => {
    
    return new Promise<Response>(resolve => {
        let response = <Response>{jobRunID: req.id || ""};
        
        createRequest(req).then(({statusCode, data}) => {
            
            response.status = "success";
            response.data = data;
            response.statusCode = statusCode;
            console.log(Object.entries(response));
            
            resolve(response)
            
        }).catch(({statusCode, data}) => {
            response.status = "errored";
            response.error = data;
            response.statusCode = statusCode;            
            
            resolve(response)
        });
    });
};

// createRequest() wrapper for GCP
export const gcpservice = async (req: any = {}, res: any): Promise<any> => {
    let response = await requestWrapper(<JobRequest>req.body);
    res.status(response.statusCode).send(response);
};

// createRequest() wrapper for AWS Lambda
export const handler = async (
    event: JobRequest,
    context: any = {},
    callback: { (error: any, result: any): void }): Promise<any> => {
    callback(null, await requestWrapper(event));
};
