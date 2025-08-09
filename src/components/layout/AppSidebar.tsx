import { useState } from "react";
import { 
  Home, 
  PiggyBank, 
  TrendingUp, 
  Wallet, 
  Settings, 
  User,
  CreditCard,
  BarChart3,
  BookOpen,
  Brain
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Transactions", url: "/transactions", icon: CreditCard },
  { title: "Portfolio", url: "/portfolio", icon: TrendingUp },
  { title: "ML Model", url: "/ml-model", icon: Brain },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Bank Accounts", url: "/bank-accounts", icon: Wallet },
  { title: "Guide", url: "/guide", icon: BookOpen },
];

const accountItems = [
  { title: "Profile", url: "/profile", icon: User },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const isMainExpanded = mainItems.some((i) => isActive(i.url));
  const isAccountExpanded = accountItems.some((i) => isActive(i.url));

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "hover:bg-sidebar-accent/50";

  return (
    <Sidebar
      className={collapsed ? "w-14" : "w-60"}
      collapsible="icon"
    >
      <SidebarContent>
        <div className="p-4 border-b border-sidebar-border">
          <h2 className={`font-bold text-lg text-sidebar-primary ${collapsed ? 'hidden' : 'block'}`}>
            InvestMate
          </h2>
          {collapsed && (
            <div className="w-8 h-8 bg-sidebar-primary rounded-md flex items-center justify-center">
              <span className="text-sidebar-primary-foreground font-bold text-sm">IM</span>
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}