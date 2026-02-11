"use client";

import {
	BarChart3,
	BarChartHorizontal,
	ChevronsUpDown,
	LayoutDashboard,
	Plus,
	Settings,
	Vote,
} from "lucide-react";
import type * as React from "react";
import { NavMain } from "@/components/layout/NavMain";
import { NavUser } from "@/components/layout/NavUser";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
	navMain: [
		{
			title: "Dashboard",
			url: "/dashboard",
			icon: LayoutDashboard,
			isActive: true,
		},
		{
			title: "My Polls",
			url: "/dashboard/polls",
			icon: BarChartHorizontal,
		},
		{
			title: "Analytics",
			url: "/dashboard/analytics",
			icon: BarChart3,
		},
		{
			title: "Create Poll",
			url: "/dashboard/create",
			icon: Plus,
		},
		{
			title: "Settings",
			url: "/dashboard/settings",
			icon: Settings,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="icon" variant="inset" {...props}>
			<SidebarHeader className="h-16 border-b p-2 flex flex-row items-center gap-2">
				<SidebarMenu className="flex-1">
					<SidebarMenuItem>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:justify-center"
						>
							<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
								<Vote className="size-4" />
							</div>
							<div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
								<span className="truncate font-semibold uppercase tracking-wider">
									Plaude Poll
								</span>
								<span className="truncate text-xs text-muted-foreground">
									Enterprise Edition
								</span>
							</div>
							<ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
		</Sidebar>
	);
}
