pragma solidity 0.4.24;
pragma experimental ABIEncoderV2;


import "https://github.com/thodges-gh/chainlink/evm/contracts/ChainlinkClient.sol";
import "https://github.com/thodges-gh/chainlink/evm/contracts/vendor/Ownable.sol";

library SafeMath{

    function add(uint256 a, uint256 b) internal pure returns (uint256){    
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");

        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256){
        require(b <= a, "SafeMath: subtraction overflow");
        uint256 c = a-b;

        return c;
    }
}

contract Secret_SecretPay is ChainlinkClient{

    //Payment of 0.3 LINK to each node
    uint256 constant private ORACLE_PAYMENT = LINK/3;
    bool public released;
    uint8 public trueCount;
    uint8 public falseCount;

    //These must all be set on creation
    address public sellerAddress;
    address public buyerAddress;
    uint256 public amount;
    uint256 public deploymentTime;
    
    mapping (address => uint256) public linkbalances;

    using SafeMath for uint256;

    event successNodeResponse(
        bool success
    );

    //Arrays 1:1 of Oracales and the corresponding Jobs IDs in those oracles
    string[] public jobIds;
    address[] public oracles;
    string[] public nodeKeys;
    string[] public msgIDs;
    string public buyerKey;
    string public sellerKey;
	

    constructor(

        string _sellerKey,
        string _buyerKey,
        string[] _nodeKeys,
        address  _sellerAddress,
        address  _buyerAddress,
        uint256  _amount,
        string[] _jobIds,
        address[] _oracles,
        string[] _msgIDs

    )public payable{

        deploymentTime = block.timestamp;
        trueCount = 0;
        falseCount = 0;
        released = false;
        buyerKey = _buyerKey;
        sellerKey = _sellerKey;
        nodeKeys = _nodeKeys;
        sellerAddress = _sellerAddress;
        buyerAddress = _buyerAddress;
        amount = _amount;
        jobIds = _jobIds;
        oracles = _oracles;
        msgIDs = _msgIDs;
        setPublicChainlinkToken();
    }
    

    function getjobIds() public view returns(string[]) {
        return jobIds;
    }

    function getnodeKeys() public view returns(string[]) {
        return nodeKeys;
    }

    function getoracles() public view returns(address[]) {
        return oracles;
    }
    function getmsgIDs() public view returns(string[]) {
        return msgIDs;
    }

    //Return link balance of the function invoker
    function getLinkBalance() public view returns(uint){
        return linkbalances[msg.sender];
    }

    function toString(address x) public view returns (string) {
        bytes memory b = new bytes(20);
        for (uint i = 0; i < 20; i++) {
            b[i] = byte(uint8(uint(x) / (2**(8*(19 - i)))));
        }
        return string(b);
    }

    //modifier to only allow buyers to access functions
    modifier buyerSellerContract(){
        require(address(this) == msg.sender || sellerAddress == msg.sender || buyerAddress == msg.sender,"Unauthorised , must be buyer or seller");
        _;
    }

    //Might Encounter ORACLE_PAYMENT problems with more than one oracle
    //Needs more testing
    function requestConfirmations()
    public
    buyerSellerContract
    {
        //Reset them to 0 to be able to safely re-run the oracles
        trueCount = 0;
        falseCount = 0;

        //Loop to iterate through all the responses from different nodes
        for(uint i = 0; i < oracles.length; i++){
            Chainlink.Request memory req = buildChainlinkRequest(stringToBytes32(jobIds[i]), this, this.fulfillNodeRequest.selector);
            req.add("address", toString(address(this)));
            sendChainlinkRequestTo(oracles[i], req, ORACLE_PAYMENT);
        }

    }

    //This should fulfill the node request
    function fulfillNodeRequest(bytes32 _requestId, bool paid)
    public
    recordChainlinkFulfillment(_requestId)
    {
        //emit NodeRequestFulfilled(_requestId, _output);
        //Append to these to calculate if the funds should be released 0.2704
        if(paid == true) {
            //Invoice Paid
            trueCount += 1;
        }else if (paid == false){
            //Invoice Not Paid Yet
            falseCount += 1;
        }
        if(trueCount > falseCount){
            released = true;
        }
        emit successNodeResponse(released);
    }

    //This isnt really needed
    function getChainlinkToken() public view returns (address) {
        return chainlinkTokenAddress();
    }

    //Withdraw ETH from contract
    //Checks on who can withdraw should only be accessible by buyer and seller
    //Maybe modifications that the seller can send the ETH to the buyer.
    function withdrawETH() public buyerSellerContract {
        if(msg.sender == sellerAddress && deploymentTime <= block.timestamp + 1 days && (trueCount != 0 || falseCount != 0)){
            if(released == false){
                //If a day has passed then the seller can take back his ETH
                address(msg.sender).transfer(amount);
                amount = 0;
            }
        }else if (msg.sender == buyerAddress && released == true){
            //Withdraw the ETH from the contract
            address(msg.sender).transfer(amount);
            amount = 0;
        }else{
            //Do Nothing cause you do not have access to this contract
        }
    }

    //Function to deposit LINK into contract and keep track of such deposits
    function depositLink(uint256 _amount) public buyerSellerContract{
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        require(link.transfer(address(this),_amount),"Unable to transfer");
        linkbalances[msg.sender] = SafeMath.add(linkbalances[msg.sender],_amount);
    }

    //Withdraw Link from contract
    function withdrawLink() public buyerSellerContract{
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        require(link.transfer(msg.sender,linkbalances[msg.sender]), "Unable to transfer");
        linkbalances[msg.sender] = 0;
    }

    function stringToBytes32(string memory source) private pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
          return 0x0;
        }
        //Or this
        assembly{
          result := mload(add(source, 32))
        }
    }
}