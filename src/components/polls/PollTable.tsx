"use client";

import { Eye, MoreHorizontal, Pen, Trash } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { Poll } from "@/types/poll";

interface PollTableProps {
	polls: Poll[];
}

export function PollTable({ polls }: PollTableProps) {
	return (
		<div className="rounded-2xl border overflow-hidden bg-white/50 dark:bg-muted/5 shadow-sm">
			<Table>
				<TableHeader className="bg-muted/30">
					<TableRow>
						<TableHead className="w-[400px] py-4">Title</TableHead>
						<TableHead className="py-4">Status</TableHead>
						<TableHead className="py-4">Created</TableHead>
						<TableHead className="text-right py-4">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{polls.map((poll) => (
						<TableRow
							key={poll.id}
							className="hover:bg-muted/20 transition-colors"
						>
							<TableCell className="font-medium py-4">
								<div className="flex flex-col">
									<Link
										href={`/polls/${poll.id}`}
										className="hover:underline font-semibold text-primary transition-colors hover:text-blue-600"
									>
										{poll.title}
									</Link>
									<span className="text-xs text-muted-foreground truncate max-w-[300px]">
										{poll.description || "No description provided"}
									</span>
								</div>
							</TableCell>
							<TableCell className="py-4">
								<div className="flex gap-2">
									{poll.is_active ? (
										<Badge
											variant="default"
											className="bg-green-500/10 text-green-700 hover:bg-green-500/20 border-green-500/20 px-3 py-0.5 rounded-full font-medium"
										>
											Active
										</Badge>
									) : (
										<Badge
											variant="secondary"
											className="px-3 py-0.5 rounded-full font-medium"
										>
											Inactive
										</Badge>
									)}
									{poll.is_open ? (
										<Badge
											variant="outline"
											className="border-blue-500/20 text-blue-700 bg-blue-500/5 px-3 py-0.5 rounded-full font-medium"
										>
											Open
										</Badge>
									) : (
										<Badge
											variant="secondary"
											className="px-3 py-0.5 rounded-full font-medium"
										>
											Closed
										</Badge>
									)}
								</div>
							</TableCell>
							<TableCell className="py-4 text-muted-foreground tabular-nums">
								{new Date(poll.created_at).toLocaleDateString(undefined, {
									year: "numeric",
									month: "short",
									day: "numeric",
								})}
							</TableCell>
							<TableCell className="text-right py-4">
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="ghost"
											className="h-9 w-9 p-0 rounded-xl hover:bg-blue-500/10 hover:text-blue-600 transition-colors"
										>
											<span className="sr-only">Open menu</span>
											<MoreHorizontal className="h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										align="end"
										className="rounded-xl shadow-xl border-muted/20"
									>
										<DropdownMenuLabel>Actions</DropdownMenuLabel>
										<DropdownMenuItem asChild className="rounded-lg">
											<Link href={`/polls/${poll.id}`}>
												<Eye className="mr-2 h-4 w-4" /> View Poll
											</Link>
										</DropdownMenuItem>
										<DropdownMenuItem disabled className="rounded-lg">
											<Pen className="mr-2 h-4 w-4" /> Edit (Coming Soon)
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											className="text-red-600 rounded-lg"
											disabled
										>
											<Trash className="mr-2 h-4 w-4" /> Delete (Coming Soon)
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
