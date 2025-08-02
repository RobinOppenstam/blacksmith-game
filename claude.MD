// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title BlacksmithNFT
 * @dev ERC721 contract for blacksmith forged weapons
 */
contract BlacksmithNFT is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    uint256 private _nextTokenId = 0;
    
    // Weapon types
    enum WeaponType { SWORD, BOW, AXE }
    
    // Weapon rarity levels
    enum Rarity { COMMON, UNCOMMON, RARE, EPIC, LEGENDARY }
    
    struct Weapon {
        WeaponType weaponType;
        uint8 tier; // 1-10 for each weapon type
        Rarity rarity;
        uint16 damage;
        uint16 durability;
        uint16 speed;
        uint32 craftedAt;
        address craftedBy;
        string ipfsHash;
    }
    
    // Player data
    struct Player {
        uint16 level;
        uint32 experience;
        uint16 swordsCrafted;
        uint16 bowsCrafted;
        uint16 axesCrafted;
        bool isRegistered;
    }
    
    // Mappings
    mapping(uint256 => Weapon) public weapons;
    mapping(address => Player) public players;
    mapping(address => uint256[]) public playerWeapons;
    
    // Events
    event WeaponForged(
        uint256 indexed tokenId,
        address indexed player,
        WeaponType weaponType,
        uint8 tier,
        Rarity rarity
    );
    
    event PlayerLevelUp(address indexed player, uint16 newLevel);
    event PlayerRegistered(address indexed player);
    
    // Constants
    uint256 public constant MINTING_FEE = 0.000001 ether; // Adjust for Avalanche
    uint32 public constant EXPERIENCE_PER_FORGE = 1000;
    uint32 public constant EXPERIENCE_PER_LEVEL = 1200;
    uint8 public constant MAX_LEVEL = 100;
    uint8 public constant MAX_TIER = 10;
    
    // Gas optimization constants
    uint256 public constant BASE_FORGE_GAS = 200000; // Base gas for existing players
    uint256 public constant NEW_PLAYER_GAS = 300000; // Additional gas for new players
    
    constructor(address initialOwner) ERC721("Blacksmith Weapons", "BSMITH") Ownable(initialOwner) {}
    
    /**
     * @dev Register a new player
     */
    function registerPlayer() external {
        require(!players[msg.sender].isRegistered, "Player already registered");
        
        players[msg.sender] = Player({
            level: 1,
            experience: 0,
            swordsCrafted: 0,
            bowsCrafted: 0,
            axesCrafted: 0,
            isRegistered: true
        });
        
        emit PlayerRegistered(msg.sender);
    }
    
    /**
     * @dev Forge a new weapon NFT
     */
    function forgeWeapon(
        WeaponType _weaponType,
        uint8 _tier,
        string memory _ipfsHash
    ) external payable nonReentrant {
        require(msg.value >= MINTING_FEE, "Insufficient minting fee");
        require(_tier >= 1 && _tier <= MAX_TIER, "Invalid weapon tier");
        
        // Auto-register player if not registered
        if (!players[msg.sender].isRegistered) {
            players[msg.sender] = Player({
                level: 1,
                experience: 0,
                swordsCrafted: 0,
                bowsCrafted: 0,
                axesCrafted: 0,
                isRegistered: true
            });
        }
        
        require(canCraftTier(msg.sender, _tier), "Player level too low for this tier");
        
        Player storage player = players[msg.sender];
        uint256 tokenId = _nextTokenId;
        _nextTokenId++;

        
        // Generate weapon stats based on tier and randomness
        (uint16 damage, uint16 durability, uint16 speed, Rarity rarity) = generateWeaponStats(_tier, tokenId);
        
        // Create weapon
        weapons[tokenId] = Weapon({
            weaponType: _weaponType,
            tier: _tier,
            rarity: rarity,
            damage: damage,
            durability: durability,
            speed: speed,
            craftedAt: uint32(block.timestamp),
            craftedBy: msg.sender,
            ipfsHash: _ipfsHash
        });
        
        // Update player stats
        if (_weaponType == WeaponType.SWORD) {
            player.swordsCrafted++;
        } else if (_weaponType == WeaponType.BOW) {
            player.bowsCrafted++;
        } else {
            player.axesCrafted++;
        }
        
        // Add experience and check for level up
        addExperience(msg.sender, EXPERIENCE_PER_FORGE);
        
        // Add to player's weapon collection
        playerWeapons[msg.sender].push(tokenId);
        
        // Mint NFT
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _ipfsHash);
        
        emit WeaponForged(tokenId, msg.sender, _weaponType, _tier, rarity);
    }
    
    /**
     * @dev Check if player can craft a specific tier
     */
    function canCraftTier(address _player, uint8 _tier) public view returns (bool) {
        uint16 requiredLevel = (_tier - 1) * 10 + 1; // Tier 1 = Level 1, Tier 2 = Level 11, etc.
        return players[_player].level >= requiredLevel;
    }
    
    /**
     * @dev Add experience to player and handle level ups
     */
    function addExperience(address _player, uint32 _exp) internal {
        Player storage player = players[_player];
        player.experience += _exp;
        
        uint16 newLevel = uint16(player.experience / EXPERIENCE_PER_LEVEL) + 1;
        if (newLevel > player.level && newLevel <= MAX_LEVEL) {
            player.level = newLevel;
            emit PlayerLevelUp(_player, newLevel);
        }
    }
    
    /**
     * @dev Generate weapon stats based on tier and pseudo-randomness
     */
    function generateWeaponStats(uint8 _tier, uint256 _seed) 
        internal 
        view 
        returns (uint16 damage, uint16 durability, uint16 speed, Rarity rarity) 
    {
        // Simplified randomness - more gas efficient
        uint256 random = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            msg.sender,
            _seed
        )));
        
        // Base stats increase with tier
        uint16 baseDamage = _tier * 10 + 20;
        uint16 baseDurability = _tier * 8 + 50;
        uint16 baseSpeed = _tier * 5 + 30;
        
        // Add randomness (±20% variation) - avoid underflow
        int16 damageVariation = int16(int256(random % 8) - 4) * int16(baseDamage) / 20;
        int16 durabilityVariation = int16(int256((random >> 8) % 8) - 4) * int16(baseDurability) / 20;
        int16 speedVariation = int16(int256((random >> 16) % 8) - 4) * int16(baseSpeed) / 20;
        
        damage = uint16(int16(baseDamage) + damageVariation);
        durability = uint16(int16(baseDurability) + durabilityVariation);
        speed = uint16(int16(baseSpeed) + speedVariation);
        
        // Determine rarity based on tier and randomness
        uint8 rarityRoll = uint8((random >> 24) % 100);
        if (_tier >= 9 && rarityRoll < 5) {
            rarity = Rarity.LEGENDARY;
        } else if (_tier >= 7 && rarityRoll < 15) {
            rarity = Rarity.EPIC;
        } else if (_tier >= 5 && rarityRoll < 35) {
            rarity = Rarity.RARE;
        } else if (_tier >= 3 && rarityRoll < 60) {
            rarity = Rarity.UNCOMMON;
        } else {
            rarity = Rarity.COMMON;
        }
    }
    
    /**
     * @dev Get player's weapon collection
     */
    function getPlayerWeapons(address _player) external view returns (uint256[] memory) {
        return playerWeapons[_player];
    }
    
    /**
     * @dev Get weapon details
     */
    function getWeapon(uint256 _tokenId) external view returns (Weapon memory) {
        require(_tokenId < _nextTokenId, "Weapon does not exist");
        return weapons[_tokenId];
    }
    
    /**
     * @dev Get player stats
     */
    function getPlayer(address _player) external view returns (Player memory) {
        return players[_player];
    }
    
    /**
     * @dev Get next level progress
     */
    function getLevelProgress(address _player) external view returns (uint32 currentExp, uint32 requiredExp) {
        Player memory player = players[_player];
        currentExp = player.experience % EXPERIENCE_PER_LEVEL;
        requiredExp = EXPERIENCE_PER_LEVEL;
    }
    
    /**
     * @dev Estimate gas needed for forging (helps frontend with gas estimation)
     */
    function estimateForgeGas(address _player) external view returns (uint256) {
        if (players[_player].isRegistered) {
            return BASE_FORGE_GAS;
        } else {
            return NEW_PLAYER_GAS;
        }
    }
    
    /**
     * @dev Withdraw contract balance (owner only)
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }
    
    /**
     * @dev Update minting fee (owner only)
     */
    function updateMintingFee(uint256 _newFee) external onlyOwner {
        // Implementation for fee updates
    }
    
    // Override required functions - REMOVED _burn override since it's not needed
    function tokenURI(uint256 tokenId) 
        public 
        view 
        override(ERC721, ERC721URIStorage) 
        returns (string memory) 
    {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}