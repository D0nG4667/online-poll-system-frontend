"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<DashboardHeader />
				<main className="flex flex-1 flex-col gap-4 p-4 lg:p-10 max-w-7xl w-full mx-auto">
					{children}
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
