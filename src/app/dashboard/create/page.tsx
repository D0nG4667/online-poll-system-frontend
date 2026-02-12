"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/auth/AuthGuard";
import { CreatePollForm } from "@/components/polls/CreatePollForm";
import { Button } from "@/components/ui/button";

export default function CreatePollPage() {
	const router = useRouter();

	return (
		<AuthGuard>
			<div className="container mx-auto py-0 space-y-8">
				<div className="flex items-center justify-between">
					<div className="space-y-1">
						<Button
							variant="ghost"
							onClick={() => router.back()}
							className="gap-2 pl-0 mb-2"
						>
							<ArrowLeft className="h-4 w-4" />
							Back to Dashboard
						</Button>
						<h1 className="text-3xl font-bold tracking-tight">
							Create a New Poll
						</h1>
						<p className="text-muted-foreground">
							Design a poll, add your questions, and share it with the world.
						</p>
					</div>
				</div>

				<CreatePollForm />
			</div>
		</AuthGuard>
	);
}
