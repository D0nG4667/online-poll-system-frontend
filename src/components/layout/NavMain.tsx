"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function NavMain({
	items,
}: {
	items: {
		title: string;
		url: string;
		icon?: LucideIcon;
		isActive?: boolean;
		items?: {
			title: string;
			url: string;
		}[];
	}[];
}) {
	const pathname = usePathname();

	return (
		<SidebarGroup>
			<SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
				Platform
			</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item) => {
					const isActive =
						pathname === item.url ||
						item.items?.some((sub) => pathname === sub.url);

					if (!item.items?.length) {
						return (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton
									asChild
									isActive={isActive}
									tooltip={item.title}
								>
									<Link href={item.url}>
										{item.icon && <item.icon />}
										<span className="group-data-[collapsible=icon]:hidden">
											{item.title}
										</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						);
					}

					return (
						<Collapsible key={item.title} asChild defaultOpen={isActive}>
							<SidebarMenuItem>
								<SidebarMenuButton asChild tooltip={item.title}>
									<Link href={item.url}>
										{item.icon && <item.icon />}
										<span className="group-data-[collapsible=icon]:hidden">
											{item.title}
										</span>
									</Link>
								</SidebarMenuButton>
								<CollapsibleTrigger asChild>
									<SidebarMenuAction className="data-[state=open]:rotate-90">
										<ChevronRight />
										<span className="sr-only">Toggle</span>
									</SidebarMenuAction>
								</CollapsibleTrigger>
								<CollapsibleContent>
									<SidebarMenuSub>
										{item.items?.map((subItem) => (
											<SidebarMenuSubItem key={subItem.title}>
												<SidebarMenuSubButton
													asChild
													isActive={pathname === subItem.url}
												>
													<Link href={subItem.url}>
														<span>{subItem.title}</span>
													</Link>
												</SidebarMenuSubButton>
											</SidebarMenuSubItem>
										))}
									</SidebarMenuSub>
								</CollapsibleContent>
							</SidebarMenuItem>
						</Collapsible>
					);
				})}
			</SidebarMenu>
		</SidebarGroup>
	);
}
