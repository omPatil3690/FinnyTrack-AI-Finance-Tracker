"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  LayoutGrid,
  PiggyBank,
  ReceiptText,
  ShieldCheck,
  CircleDollarSign,
  TrendingUp,
  LogOut,
  Settings,
  Sparkles,
} from "lucide-react";
import { UserButton, useClerk } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function SideNav() {
  const menuList = [
    {
      id: 1,
      name: "Dashboard",
      icon: LayoutGrid,
      path: "/dashboard",
    },
    {
      id: 2,
      name: "Income",
      icon: CircleDollarSign,
      path: "/dashboard/incomes",
    },
    {
      id: 3,
      name: "Budgets",
      icon: PiggyBank,
      path: "/dashboard/budgets",
    },
    {
      id: 4,
      name: "Expenses",
      icon: ReceiptText,
      path: "/dashboard/expenses",
    },
    {
      id: 5,
      name: "Upgrade",
      icon: ShieldCheck,
      path: "/dashboard/upgrade",
    },
  ];
  
  const path = usePathname();
  const { signOut } = useClerk();

  const handleSettingsClick = () => {
    // For now, just show an alert - you can implement a proper settings page later
    alert('Settings page coming soon! This will redirect to user settings.');
  };

  useEffect(() => {
    console.log(path);
  }, [path]);

  return (
    <div
      className="h-screen p-6 bg-white border-r border-gray-200 shadow-sm flex flex-col"
    >
      {/* Logo */}
      <Link href="/" className="flex items-center space-x-3 mb-8 group">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
          <div className="relative bg-white p-2 rounded-xl">
            <Image src="/chart-donut.svg" alt="FinTrack Logo" width={32} height={32} />
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            FinTrack
          </span>
          <Sparkles className="w-4 h-4 text-purple-500" />
        </div>
      </Link>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-2">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-3">
          Menu
        </div>
        {menuList.map((menu, index) => (
          <Link href={menu.path} key={menu.id}>
            <div
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group hover:translate-x-1 ${
                path === menu.path
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <menu.icon 
                className={`w-5 h-5 ${
                  path === menu.path ? "text-white" : "text-gray-500 group-hover:text-gray-700"
                }`} 
              />
              <span className="font-medium">{menu.name}</span>
              {path === menu.path && (
                <div
                  className="ml-auto w-2 h-2 bg-white rounded-full"
                />
              )}
            </div>
          </Link>
        ))}
      </nav>

      {/* Settings Section */}
      <div className="border-t border-gray-200 pt-4 space-y-2">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
          Account
        </div>
        
        <Button
          variant="ghost"
          onClick={handleSettingsClick}
          className="w-full justify-start space-x-3 px-4 py-3 h-auto text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </Button>
        
        <Button
          variant="ghost"
          onClick={() => signOut()}
          className="w-full justify-start space-x-3 px-4 py-3 h-auto text-gray-600 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </Button>
      </div>

      {/* User Profile */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center space-x-3 px-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-sm opacity-75"></div>
            <div className="relative">
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10 rounded-full border-2 border-white shadow-lg"
                  }
                }}
              />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Profile</p>
            <p className="text-xs text-gray-500 truncate">Manage account</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideNav;
