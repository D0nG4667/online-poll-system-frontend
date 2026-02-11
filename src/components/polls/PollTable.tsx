"use client";

import { Eye, MoreHorizontal, Pen, Share2, Trash } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
import { useDeletePollMutation } from "@/services/pollsApi";
import type { Poll } from "@/types/poll";
import { PollDistribution } from "./PollDistribution";

interface PollTableProps {
	polls: Poll[];
}

export function PollTable({ polls }: PollTableProps) {
	const [sharingPoll, setSharingPoll] = useState<Poll | null>(null);
	const [deletingPoll, setDeletingPoll] = useState<Poll | null>(null);
	const [deletePoll, { isLoading: isDeleting }] = useDeletePollMutation();

	const handleDelete = async () => {
		if (!deletingPoll) return;
		try {
			await deletePoll(deletingPoll.id).unwrap();
			toast.success("Poll deleted successfully");
			setDeletingPoll(null);
		} catch (err) {
			toast.error("Failed to delete poll");
			console.error("Delete error:", err);
		}
	};

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
										<DropdownMenuItem
											onClick={() => setSharingPoll(poll)}
											className="rounded-lg"
										>
											<Share2 className="mr-2 h-4 w-4" /> Share Poll
										</DropdownMenuItem>
										<DropdownMenuItem asChild className="rounded-lg">
											<Link href={`/dashboard/polls/${poll.id}/edit`}>
												<Pen className="mr-2 h-4 w-4" /> Edit Poll
											</Link>
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											className="text-red-600 rounded-lg focus:bg-red-50 focus:text-red-600"
											onClick={() => setDeletingPoll(poll)}
										>
											<Trash className="mr-2 h-4 w-4" /> Delete Poll
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			<Dialog
				open={!!sharingPoll}
				onOpenChange={(open) => !open && setSharingPoll(null)}
			>
				<DialogContent className="max-w-2xl p-0 overflow-hidden border-none bg-transparent">
					{sharingPoll && (
						<PollDistribution
							pollId={sharingPoll.id}
							title={sharingPoll.title}
						/>
					)}
				</DialogContent>
			</Dialog>

			<AlertDialog
				open={!!deletingPoll}
				onOpenChange={(open) => !open && setDeletingPoll(null)}
			>
				<AlertDialogContent className="rounded-2xl border-muted/20 shadow-2xl">
					<AlertDialogHeader>
						<AlertDialogTitle className="text-xl font-bold">
							Are you absolutely sure?
						</AlertDialogTitle>
						<AlertDialogDescription className="text-muted-foreground">
							This action cannot be undone. This will permanently delete the
							poll{" "}
							<span className="font-bold text-foreground">
								"{deletingPoll?.title}"
							</span>{" "}
							and all associated data including votes.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter className="gap-2">
						<AlertDialogCancel className="rounded-xl border-muted/20 hover:bg-muted/50 transition-colors">
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							className="bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg shadow-red-500/20 transition-all"
							disabled={isDeleting}
						>
							{isDeleting ? "Deleting..." : "Delete Poll"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
