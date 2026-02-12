"use client";

import { Lightbulb, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useGeneratePollMutation } from "@/services/aiApi";
import type { AIGeneratedQuestion } from "@/types/ai";

interface AIPromptDialogProps {
	onPollGenerated: (data: {
		title: string;
		description: string;
		questions: AIGeneratedQuestion[];
	}) => void;
}

const QUICK_TEMPLATES = [
	{ icon: "📊", text: "Customer satisfaction survey" },
	{ icon: "🎯", text: "Team feedback poll" },
	{ icon: "🍕", text: "Lunch preferences for the team" },
	{ icon: "📚", text: "Book club reading list" },
];

export function AIPromptDialog({ onPollGenerated }: AIPromptDialogProps) {
	const [open, setOpen] = useState(false);
	const [prompt, setPrompt] = useState("");
	const [generatePoll, { isLoading }] = useGeneratePollMutation();

	const handleGenerate = async () => {
		if (!prompt.trim()) {
			toast.error("Please describe your poll");
			return;
		}

		try {
			const result = await generatePoll({ prompt }).unwrap();
			toast.success(`Poll generated with ${result.provider}!`);
			onPollGenerated({
				title: result.title,
				description: result.description,
				questions: result.questions,
			});
			setOpen(false);
			setPrompt("");
		} catch (error) {
			console.error("AI Generation Error:", error);
			toast.error("Failed to generate poll. Please try again.");
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant="unicorn"
					className="relative overflow-hidden group gap-2 px-6 h-11 rounded-xl shadow-lg hover:shadow-purple-500/40 transition-all animate-glow"
				>
					{/* Shimmer Effect overlay */}
					<div className="absolute inset-0 translate-x-[-100%] group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />

					<div className="relative z-20 flex items-center gap-2">
						<Sparkles className="h-5 w-5 animate-rotate-sparkle" />
						<span className="font-semibold tracking-tight">
							Generate with AI
						</span>
					</div>
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[620px] rounded-3xl border-muted/20 bg-background shadow-2xl">
				<DialogHeader className="pb-4">
					<DialogTitle className="flex items-center gap-3 text-2xl font-bold">
						<div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/10 shadow-inner">
							<Sparkles className="h-6 w-6 text-indigo-500 animate-pulse" />
						</div>
						<span>Create with AI Magic</span>
					</DialogTitle>
					<DialogDescription className="text-base">
						Just describe what you need, and our AI will build the perfect poll
						structure for you in seconds.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6 py-2">
					{/* AI Assistant Message */}
					<div className="relative rounded-2xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-indigo-500/10 p-5 shadow-sm">
						<div className="flex items-start gap-4">
							<div className="relative">
								<div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-md animate-pulse" />
								<div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-muted shadow-sm">
									<Sparkles className="h-5 w-5 text-indigo-500" />
								</div>
							</div>
							<div className="flex-1 space-y-1">
								<p className="text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
									Plaude AI Strategist
								</p>
								<p className="text-sm text-muted-foreground leading-relaxed">
									I'm here to help you craft the perfect engagement. Tell me
									about the topic or audience you're targeting!
								</p>
							</div>
						</div>
					</div>

					{/* Quick Templates */}
					<div className="space-y-3">
						<p className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
							<Lightbulb className="h-3 w-3 text-amber-500" />
							Popular Blueprints
						</p>
						<div className="grid grid-cols-2 gap-3">
							{QUICK_TEMPLATES.map((template) => (
								<button
									type="button"
									key={template.text}
									className="group flex items-center justify-start gap-3 p-3 rounded-2xl border bg-white dark:bg-muted/10 hover:border-indigo-500/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/5 transition-all text-left"
									onClick={() => setPrompt(template.text)}
								>
									<span className="flex h-8 w-8 items-center justify-center rounded-xl bg-muted/50 group-hover:bg-indigo-500/10 transition-colors text-lg">
										{template.icon}
									</span>
									<span className="text-xs font-medium group-hover:text-indigo-600 transition-colors line-clamp-2">
										{template.text}
									</span>
								</button>
							))}
						</div>
					</div>

					{/* Prompt Input */}
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<label htmlFor="prompt" className="text-sm font-bold">
								Your Creative Vision
							</label>
							<span className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
								{prompt.length}/1000
							</span>
						</div>
						<Textarea
							id="prompt"
							placeholder="e.g., 'A professional poll for deciding the next offsite location in Europe, focused on team-building potential...'"
							value={prompt}
							onChange={(e) => setPrompt(e.target.value)}
							rows={4}
							maxLength={1000}
							className="resize-none rounded-2xl border-muted-foreground/10 focus-visible:ring-indigo-500 bg-white/50 dark:bg-muted/5"
						/>
					</div>

					{/* Generate Button */}
					<Button
						onClick={handleGenerate}
						disabled={isLoading || !prompt.trim()}
						variant="unicorn"
						size="lg"
						className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-purple-500/20 group relative overflow-hidden"
					>
						{isLoading ? (
							<>
								<Loader2 className="h-6 w-6 animate-spin mr-2" />
								Manifesting Poll...
							</>
						) : (
							<>
								<div className="absolute inset-0 translate-x-[-100%] animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
								<Sparkles className="h-6 w-6 mr-2 animate-rotate-sparkle" />
								Ignite AI Magic
							</>
						)}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
