'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { BLACKSMITH_CONTRACT_ADDRESS, BLACKSMITH_ABI } from '@/lib/contracts';
import type { Player, Weapon } from '@/types/game';

interface GameState {
  player: Player | null;
  weapons: Weapon[];
  isLoading: boolean;
  selectedWeaponType: number | null;
  selectedTier: number | null;
}

type GameAction = 
  | { type: 'SET_PLAYER'; payload: Player }
  | { type: 'SET_WEAPONS'; payload: Weapon[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SELECT_WEAPON_TYPE'; payload: number }
  | { type: 'SELECT_TIER'; payload: number }
  | { type: 'ADD_WEAPON'; payload: Weapon }
  | { type: 'RESET' };

const initialState: GameState = {
  player: null,
  weapons: [],
  isLoading: false,
  selectedWeaponType: null,
  selectedTier: null,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_PLAYER':
      return { ...state, player: action.payload };
    case 'SET_WEAPONS':
      return { ...state, weapons: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SELECT_WEAPON_TYPE':
      return { ...state, selectedWeaponType: action.payload, selectedTier: null };
    case 'SELECT_TIER':
      return { ...state, selectedTier: action.payload };
    case 'ADD_WEAPON':
      return { ...state, weapons: [...state.weapons, action.payload] };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  refetchPlayer: () => void;
} | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const { address, isConnected } = useAccount();

  // Fetch player data
  const { 
    data: playerData, 
    refetch: refetchPlayer,
    error: playerError 
  } = useReadContract({
    address: BLACKSMITH_CONTRACT_ADDRESS,
    abi: BLACKSMITH_ABI,
    functionName: 'getPlayer',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    }
  });

  // Fetch player weapons
  const { data: weaponIds } = useReadContract({
    address: BLACKSMITH_CONTRACT_ADDRESS,
    abi: BLACKSMITH_ABI,
    functionName: 'getPlayerWeapons',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!playerData?.isRegistered,
    }
  });

  useEffect(() => {
    if (playerData) {
      dispatch({ 
        type: 'SET_PLAYER', 
        payload: {
          level: Number(playerData.level),
          experience: Number(playerData.experience),
          swordsCrafted: Number(playerData.swordsCrafted),
          bowsCrafted: Number(playerData.bowsCrafted),
          axesCrafted: Number(playerData.axesCrafted),
          isRegistered: playerData.isRegistered,
        }
      });
    } else if (playerError) {
      // If there's an error fetching player data, assume not registered
      dispatch({ 
        type: 'SET_PLAYER', 
        payload: {
          level: 0,
          experience: 0,
          swordsCrafted: 0,
          bowsCrafted: 0,
          axesCrafted: 0,
          isRegistered: false,
        }
      });
    }
  }, [playerData, playerError]);

  useEffect(() => {
    if (!isConnected) {
      dispatch({ type: 'RESET' });
    }
  }, [isConnected]);

  // Handle contract errors gracefully
  useEffect(() => {
    if (playerError) {
      console.warn('Player data fetch error:', playerError);
      // Player might not be registered yet, this is normal
    }
  }, [playerError]);

  return (
    <GameContext.Provider value={{ state, dispatch, refetchPlayer }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}