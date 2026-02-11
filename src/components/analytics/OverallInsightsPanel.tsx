"use client";

import { Loader2, Send, Sparkles } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { useGenerateInsightMutation } from "@/services/aiApi";

interface OverallInsightsPanelProps {
	timePeriod: "7d" | "30d" | "90d" | "1y";
}

export function OverallInsightsPanel({
	timePeriod,
}: OverallInsightsPanelProps) {
	const [query, setQuery] = useState("");
	const [insight, setInsight] = useState<string | null>(null);
	const [generateInsight, { isLoading }] = useGenerateInsightMutation();

	const handleGenerateInsight = async () => {
		if (!query.trim()) {
			toast.error("Please enter a question");
			return;
		}

		try {
			const result = await generateInsight({
				poll_id: 0, // Special ID for overall analytics
				query: `Analyze overall poll performance for the last ${timePeriod}: ${query}`,
			}).unwrap();

			setInsight(result.insight);
			toast.success("Insight generated!");
		} catch (error) {
			toast.error("Failed to generate insight");
			console.error(error);
		}
	};

	const quickQuestions = [
		"What are my top performing polls?",
		"How can I improve engagement?",
		"What trends do you see in my data?",
		"Which time periods have the best response rates?",
	];

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center gap-2">
					<Sparkles className="h-5 w-5 text-purple-500" />
					<CardTitle>Overall Performance Insights</CardTitle>
				</div>
				<CardDescription>
					Ask AI about your overall polling activity and get actionable insights
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Quick Questions */}
				<div className="space-y-2">
					<p className="text-sm font-medium">Quick Questions:</p>
					<div className="grid grid-cols-2 gap-2">
						{quickQuestions.map((question) => (
							<Button
								key={question}
								variant="outline"
								size="sm"
								className="justify-start text-left h-auto py-2 text-xs"
								onClick={() => setQuery(question)}
							>
								{question}
							</Button>
						))}
					</div>
				</div>

				{/* Query Input */}
				<div className="space-y-2">
					<Textarea
						placeholder="Ask a question about your overall poll performance..."
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						rows={3}
						className="resize-none"
					/>
					<Button
						onClick={handleGenerateInsight}
						disabled={isLoading || !query.trim()}
						className="w-full"
					>
						{isLoading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Generating Insight...
							</>
						) : (
							<>
								<Send className="mr-2 h-4 w-4" />
								Generate Insight
							</>
						)}
					</Button>
				</div>

				{/* Insight Display */}
				{insight && (
					<div className="rounded-lg border bg-muted/50 p-4">
						<div className="flex items-start gap-3">
							<Sparkles className="h-5 w-5 text-purple-500 mt-0.5" />
							<div className="flex-1 space-y-2">
								<p className="text-sm font-medium">AI Insight:</p>
								<p className="text-sm text-muted-foreground whitespace-pre-wrap">
									{insight}
								</p>
							</div>
						</div>
					</div>
				)}

				{!insight && !isLoading && (
					<div className="text-center py-8 text-sm text-muted-foreground">
						Ask a question to get AI-powered insights about your overall poll
						performance
					</div>
				)}
			</CardContent>
		</Card>
	);
}
