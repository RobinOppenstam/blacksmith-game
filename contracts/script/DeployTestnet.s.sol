// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/BlacksmithNFT.sol";

contract DeployTestnetScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        address deployer = vm.addr(deployerPrivateKey);
        BlacksmithNFT blacksmith = new BlacksmithNFT(deployer);
        
        console.log("BlacksmithNFT deployed on Fuji testnet at:", address(blacksmith));
        console.log("Owner set to:", deployer);
        console.log("Save this address for your frontend configuration!");
        
        vm.stopBroadcast();
    }
}