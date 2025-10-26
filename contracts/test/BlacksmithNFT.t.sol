// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/BlacksmithNFT.sol";

contract BlacksmithNFTTest is Test {
    BlacksmithNFT public blacksmith;
    address public owner = address(0x1);
    address public player1 = address(0x2);
    address public player2 = address(0x3);
    
    uint256 constant MINTING_FEE = 0.000001 ether;

    function setUp() public {
        vm.prank(owner);
        blacksmith = new BlacksmithNFT(owner);
        
        // Give players some ETH for minting
        vm.deal(player1, 1 ether);
        vm.deal(player2, 1 ether);
    }

    function testPlayerRegistration() public {
        // Test manual registration
        vm.prank(player1);
        blacksmith.registerPlayer();
        
        BlacksmithNFT.Player memory player = blacksmith.getPlayer(player1);
        assertEq(player.level, 1);
        assertEq(player.experience, 0);
        assertEq(player.isRegistered, true);
    }

    function testAutoRegistrationOnFirstMint() public {
        // Player2 hasn't registered manually, should auto-register on first mint
        vm.prank(player2);
        blacksmith.forgeWeapon{value: MINTING_FEE}(
            BlacksmithNFT.WeaponType.SWORD,
            1,
            "QmTestHash"
        );
        
        BlacksmithNFT.Player memory player = blacksmith.getPlayer(player2);
        assertEq(player.level, 1);
        assertEq(player.isRegistered, true);
        assertEq(player.swordsCrafted, 1);
    }

    function testLevel1CanMintTier1Weapons() public {
        vm.prank(player1);
        blacksmith.registerPlayer();
        
        // Level 1 player should be able to craft tier 1 weapons
        assertTrue(blacksmith.canCraftTier(player1, 1));
        
        vm.prank(player1);
        blacksmith.forgeWeapon{value: MINTING_FEE}(
            BlacksmithNFT.WeaponType.SWORD,
            1,
            "QmTestHash"
        );
        
        // Verify weapon was minted
        assertEq(blacksmith.balanceOf(player1), 1);
        uint256[] memory weapons = blacksmith.getPlayerWeapons(player1);
        assertEq(weapons.length, 1);
        
        BlacksmithNFT.Weapon memory weapon = blacksmith.getWeapon(weapons[0]);
        assertEq(uint8(weapon.weaponType), uint8(BlacksmithNFT.WeaponType.SWORD));
        assertEq(weapon.tier, 1);
        assertEq(weapon.craftedBy, player1);
    }

    function testLevel1CannotMintHigherTiers() public {
        vm.prank(player1);
        blacksmith.registerPlayer();
        
        // Level 1 player should NOT be able to craft tier 2+ weapons
        assertFalse(blacksmith.canCraftTier(player1, 2));
        
        vm.prank(player1);
        vm.expectRevert("Player level too low for this tier");
        blacksmith.forgeWeapon{value: MINTING_FEE}(
            BlacksmithNFT.WeaponType.SWORD,
            2,
            "QmTestHash"
        );
    }

    function testExperienceGainAndLevelUp() public {
        vm.prank(player1);
        blacksmith.registerPlayer();
        
        // Forge a weapon to gain experience
        vm.prank(player1);
        blacksmith.forgeWeapon{value: MINTING_FEE}(
            BlacksmithNFT.WeaponType.SWORD,
            1,
            "QmTestHash"
        );
        
        BlacksmithNFT.Player memory player = blacksmith.getPlayer(player1);
        assertEq(player.experience, 1000); // EXPERIENCE_PER_FORGE
        assertEq(player.level, 1); // Should still be level 1 (needs 1200 exp for level 2)
        
        // Forge another weapon to level up
        vm.prank(player1);
        blacksmith.forgeWeapon{value: MINTING_FEE}(
            BlacksmithNFT.WeaponType.BOW,
            1,
            "QmTestHash2"
        );
        
        player = blacksmith.getPlayer(player1);
        assertEq(player.experience, 2000);
        assertEq(player.level, 2); // Should now be level 2
        assertEq(player.swordsCrafted, 1);
        assertEq(player.bowsCrafted, 1);
    }

    function testMintingFeeRequired() public {
        vm.prank(player1);
        blacksmith.registerPlayer();
        
        // Should fail without enough fee
        vm.prank(player1);
        vm.expectRevert("Insufficient minting fee");
        blacksmith.forgeWeapon{value: MINTING_FEE - 1}(
            BlacksmithNFT.WeaponType.SWORD,
            1,
            "QmTestHash"
        );
        
        // Should work with correct fee
        vm.prank(player1);
        blacksmith.forgeWeapon{value: MINTING_FEE}(
            BlacksmithNFT.WeaponType.SWORD,
            1,
            "QmTestHash"
        );
        
        assertEq(blacksmith.balanceOf(player1), 1);
    }
}