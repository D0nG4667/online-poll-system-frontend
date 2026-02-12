"use client";

import { Brain, History, Loader2, MessageSquare, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	useGenerateInsightMutation,
	useGetInsightHistoryQuery,
	useIngestPollDataMutation,
} from "@/services/aiApi";

interface AIInsightsPanelProps {
	pollId: number;
}

export function AIInsightsPanel({ pollId }: AIInsightsPanelProps) {
	const [query, setQuery] = useState("");
	const [currentInsight, setCurrentInsight] = useState<string | null>(null);

	const [generateInsight, { isLoading: isGenerating }] =
		useGenerateInsightMutation();
	const [ingestData, { isLoading: isIngesting }] = useIngestPollDataMutation();
	const { data: history, isLoading: isLoadingHistory } =
		useGetInsightHistoryQuery(pollId);

	const handleIngest = async () => {
		try {
			const result = await ingestData({ poll_id: pollId }).unwrap();
			toast.success(result.message);
		} catch (error) {
			console.error("Ingest Error:", error);
			toast.error("Failed to prepare poll for AI analysis");
		}
	};

	const handleAskAI = async () => {
		if (!query.trim()) {
			toast.error("Please enter a question");
			return;
		}

		try {
			const result = await generateInsight({
				poll_id: pollId,
				query,
			}).unwrap();

			setCurrentInsight(result.insight);
			toast.success(`Insight generated with ${result.provider}`);
			setQuery("");
		} catch (error) {
			console.error("Insight Error:", error);
			toast.error("Failed to generate insight. Try ingesting poll data first.");
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Brain className="h-5 w-5 text-primary" />
					AI Insights
				</CardTitle>
				<CardDescription>
					Get AI-powered analysis and insights about your poll
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Tabs defaultValue="ask" className="w-full">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="ask" className="gap-2">
							<MessageSquare className="h-4 w-4" />
							Ask AI
						</TabsTrigger>
						<TabsTrigger value="history" className="gap-2">
							<History className="h-4 w-4" />
							History
						</TabsTrigger>
					</TabsList>

					<TabsContent value="ask" className="space-y-4">
						{/* Ingest Button */}
						<div className="rounded-lg border border-dashed p-4">
							<p className="text-sm text-muted-foreground mb-2">
								First time? Prepare your poll data for AI analysis:
							</p>
							<Button
								onClick={handleIngest}
								disabled={isIngesting}
								variant="outline"
								size="sm"
								className="gap-2"
							>
								{isIngesting ? (
									<>
										<Loader2 className="h-4 w-4 animate-spin" />
										Preparing...
									</>
								) : (
									<>
										<Sparkles className="h-4 w-4" />
										Prepare Poll Data
									</>
								)}
							</Button>
						</div>

						{/* Ask AI Input */}
						<div className="space-y-2">
							<label htmlFor="ai-query" className="text-sm font-medium">
								Ask a question about your poll
							</label>
							<div className="flex gap-2">
								<Input
									id="ai-query"
									placeholder="e.g., What are the most popular options?"
									value={query}
									onChange={(e) => setQuery(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === "Enter" && !isGenerating) {
											handleAskAI();
										}
									}}
									maxLength={500}
								/>
								<Button
									onClick={handleAskAI}
									disabled={isGenerating || !query.trim()}
									className="gap-2"
								>
									{isGenerating ? (
										<Loader2 className="h-4 w-4 animate-spin" />
									) : (
										<Brain className="h-4 w-4" />
									)}
									Ask
								</Button>
							</div>
						</div>

						{/* Current Insight */}
						{currentInsight && (
							<div className="rounded-lg bg-muted p-4">
								<div className="flex items-start gap-3">
									<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
										<Brain className="h-4 w-4 text-primary" />
									</div>
									<div className="flex-1 space-y-2">
										<p className="text-sm font-medium">AI Insight</p>
										<p className="text-sm text-muted-foreground whitespace-pre-wrap">
											{currentInsight}
										</p>
									</div>
								</div>
							</div>
						)}
					</TabsContent>

					<TabsContent value="history" className="space-y-4">
						{isLoadingHistory ? (
							<div className="flex items-center justify-center py-8">
								<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
							</div>
						) : history && history.length > 0 ? (
							<div className="space-y-3">
								{history.map((item) => (
									<div
										key={item.id}
										className="rounded-lg border p-4 space-y-2"
									>
										<div className="flex items-start justify-between">
											<p className="text-sm font-medium">{item.query}</p>
											<span className="text-xs text-muted-foreground">
												{new Date(item.created_at).toLocaleDateString()}
											</span>
										</div>
										<p className="text-sm text-muted-foreground">
											{item.response}
										</p>
										<p className="text-xs text-muted-foreground">
											Provider: {item.provider_used}
										</p>
									</div>
								))}
							</div>
						) : (
							<div className="text-center py-8 text-muted-foreground">
								<History className="h-12 w-12 mx-auto mb-2 opacity-50" />
								<p className="text-sm">No insights yet</p>
								<p className="text-xs">Ask AI a question to get started</p>
							</div>
						)}
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
}
