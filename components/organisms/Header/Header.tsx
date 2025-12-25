"use client";

import type { ReactNode } from "react";
import { SearchBar } from "@/components/molecules/SearchBar";

export interface HeaderProps {
  logo?: ReactNode;
  navigation?: ReactNode;
  userActions?: ReactNode;
  showSearch?: boolean;
  onSearch?: (value: string) => void;
  darkModeToggle?: ReactNode;
}

/**
 * Header Organism Component
 * Complex navigation and header component combining multiple molecules
 */
export function Header({
  logo,
  navigation,
  userActions,
  showSearch = false,
  onSearch,
  darkModeToggle,
}: HeaderProps) {
  return (
    <header
      className="sticky top-0 z-50 border-b border-[#e5e7eb] bg-white/95 backdrop-blur-sm"
      role="banner"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          {logo && (
            <div className="flex-shrink-0" role="img" aria-label="Site logo">
              {logo}
            </div>
          )}
          {navigation && (
            <nav
              className="hidden md:flex md:gap-6"
              aria-label="Main navigation"
            >
              {navigation}
            </nav>
          )}
        </div>

        <div className="flex flex-1 items-center justify-end gap-4">
          {showSearch && (
            <div className="hidden w-full max-w-md lg:block" role="search">
              <SearchBar onSearch={onSearch} showButton={false} />
            </div>
          )}
          {darkModeToggle}
          {userActions && (
            <div role="toolbar" aria-label="User actions">
              {userActions}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
