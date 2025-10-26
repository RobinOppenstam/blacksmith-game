import React from 'react';
import { WeaponType } from '@/types/game';

interface WeaponIconProps {
  weaponType: WeaponType;
  className?: string;
}

export function WeaponIcon({ weaponType, className = "h-12 w-12" }: WeaponIconProps) {
  const baseClasses = `${className} fill-current`;

  switch (weaponType) {
    case WeaponType.SWORD:
      return (
        <svg className={baseClasses} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          {/* Sword blade */}
          <path d="M12 2L11 3v14l1 1 1-1V3l-1-1z" />
          {/* Crossguard */}
          <rect x="8" y="17" width="8" height="1.5" rx="0.5" />
          {/* Handle */}
          <rect x="11" y="18.5" width="2" height="3" rx="1" />
          {/* Pommel */}
          <circle cx="12" cy="22" r="1" />
        </svg>
      );
    
    case WeaponType.BOW:
      return (
        <svg className={baseClasses} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          {/* Left bow curve */}
          <path d="M6 3c-1.5 0-2.5 1-2.5 2.5v13c0 1.5 1 2.5 2.5 2.5 0.8 0 1.5-0.4 2-1L6 12L8 4.5C7.5 3.4 6.8 3 6 3z" />
          {/* Right bow curve */}
          <path d="M18 3c1.5 0 2.5 1 2.5 2.5v13c0 1.5-1 2.5-2.5 2.5-0.8 0-1.5-0.4-2-1L18 12L16 4.5C16.5 3.4 17.2 3 18 3z" />
          {/* Bowstring */}
          <path d="M8 4.5Q12 8 16 4.5 M8 19.5Q12 16 16 19.5" stroke="currentColor" strokeWidth="0.8" fill="none" />
          {/* Arrow nocked */}
          <line x1="9" y1="12" x2="15" y2="12" stroke="currentColor" strokeWidth="1.2" />
          <path d="M15 12l-2-1v2l2-1z" />
        </svg>
      );
    
    case WeaponType.AXE:
      return (
        <svg className={baseClasses} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          {/* Axe handle */}
          <rect x="11" y="8" width="2" height="14" rx="1" />
          {/* Axe head - main blade */}
          <path d="M8 4c-2 0-3.5 1-3.5 3v4c0 2 1.5 3 3.5 3h8c2 0 3.5-1 3.5-3V7c0-2-1.5-3-3.5-3H8z" />
          {/* Blade edge detail */}
          <path d="M6 6c-1 0-1.5 0.5-1.5 1.5v3c0 1 0.5 1.5 1.5 1.5h12c1 0 1.5-0.5 1.5-1.5v-3c0-1-0.5-1.5-1.5-1.5H6z" />
          {/* Handle attachment */}
          <ellipse cx="12" cy="8" rx="3" ry="1" />
        </svg>
      );
    
    default:
      return (
        <svg className={baseClasses} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L11 3v14l1 1 1-1V3l-1-1z" />
          <rect x="8" y="17" width="8" height="1.5" rx="0.5" />
          <rect x="11" y="18.5" width="2" height="3" rx="1" />
          <circle cx="12" cy="22" r="1" />
        </svg>
      );
  }
}

export function getWeaponIconSVG(weaponType: WeaponType): string {
  switch (weaponType) {
    case WeaponType.SWORD:
      return `
        <path d="M12 2L11 3v14l1 1 1-1V3l-1-1z" />
        <rect x="8" y="17" width="8" height="1.5" rx="0.5" />
        <rect x="11" y="18.5" width="2" height="3" rx="1" />
        <circle cx="12" cy="22" r="1" />
      `;
    
    case WeaponType.BOW:
      return `
        <path d="M6 3c-1.5 0-2.5 1-2.5 2.5v13c0 1.5 1 2.5 2.5 2.5 0.8 0 1.5-0.4 2-1L6 12L8 4.5C7.5 3.4 6.8 3 6 3z" />
        <path d="M18 3c1.5 0 2.5 1 2.5 2.5v13c0 1.5-1 2.5-2.5 2.5-0.8 0-1.5-0.4-2-1L18 12L16 4.5C16.5 3.4 17.2 3 18 3z" />
        <path d="M8 4.5Q12 8 16 4.5 M8 19.5Q12 16 16 19.5" stroke="currentColor" stroke-width="0.8" fill="none" />
        <line x1="9" y1="12" x2="15" y2="12" stroke="currentColor" stroke-width="1.2" />
        <path d="M15 12l-2-1v2l2-1z" />
      `;
    
    case WeaponType.AXE:
      return `
        <rect x="11" y="8" width="2" height="14" rx="1" />
        <path d="M8 4c-2 0-3.5 1-3.5 3v4c0 2 1.5 3 3.5 3h8c2 0 3.5-1 3.5-3V7c0-2-1.5-3-3.5-3H8z" />
        <path d="M6 6c-1 0-1.5 0.5-1.5 1.5v3c0 1 0.5 1.5 1.5 1.5h12c1 0 1.5-0.5 1.5-1.5v-3c0-1-0.5-1.5-1.5-1.5H6z" />
        <ellipse cx="12" cy="8" rx="3" ry="1" />
      `;
    
    default:
      return `
        <path d="M12 2L11 3v14l1 1 1-1V3l-1-1z" />
        <rect x="8" y="17" width="8" height="1.5" rx="0.5" />
        <rect x="11" y="18.5" width="2" height="3" rx="1" />
        <circle cx="12" cy="22" r="1" />
      `;
  }
}