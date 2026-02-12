import { format } from "date-fns";
import { CalendarDays } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { Poll } from "@/types/poll";

interface PollCardProps {
	poll: Poll;
}

export function PollCard({ poll }: PollCardProps) {
	const isActive = poll.is_active && poll.is_open;

	return (
		<Card className="flex flex-col h-full bg-white/50 dark:bg-black/20 backdrop-blur-md border-white/20 hover:shadow-lg transition-all duration-300">
			<CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
				<CardTitle className="line-clamp-2 text-xl font-bold">
					{poll.title}
				</CardTitle>
				<Badge
					variant={isActive ? "default" : "secondary"}
					className={
						isActive
							? "bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20"
							: ""
					}
				>
					{isActive ? "Active" : "Closed"}
				</Badge>
			</CardHeader>
			<CardContent className="flex-1">
				<p className="text-muted-foreground line-clamp-3 mb-4 text-sm">
					{poll.description}
				</p>
				<div className="flex items-center space-x-4 text-sm text-muted-foreground">
					<div className="flex items-center">
						<CalendarDays className="mr-1 h-3 w-3" />
						{format(new Date(poll.start_date), "MMM d, yyyy")}
					</div>
					{/* Placeholder for vote count if available in future */}
					{/* <div className="flex items-center">
						<Users className="mr-1 h-3 w-3" />
						{poll.vote_count} votes
					</div> */}
				</div>
			</CardContent>
			<CardFooter>
				<Button
					asChild
					className="w-full"
					variant={isActive ? "default" : "secondary"}
					disabled={!isActive}
				>
					<Link href={`/polls/${poll.slug}`}>
						{isActive ? "Vote Now" : "View Results"}
					</Link>
				</Button>
			</CardFooter>
		</Card>
	);
}
