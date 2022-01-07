// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Faucet {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    //modifier is used to utilize the same code @multiple places

    modifier limitWithdraw(uint256 amount) {
        require(amount >= 100000000000000000, "Min amount is 0.1 ether");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "only owner can call this");
        _;
    }

    function testOwner() external onlyOwner {
        //only oner should call this fn.
    }

    //used to transfer funds from one account to another

    //web3.eth.sendTransaction({from:'',to:'',value:'in wei'})
    receive() external payable {}

    //receive funds to contract address from any account
    //const instance = await Faucet.deployed()
    //instance.addFunds({from :accounts[2],value:"4000000000000000000"}
    function addFunds() external payable {}

    //withdraw fund from contract to account
    //const instance = await Faucet.deployed()
    //instance.withdraw("4000000000000000000")
    function withdraw(uint256 amount) external limitWithdraw(amount) {
        payable(msg.sender).transfer(amount);
    }
}
