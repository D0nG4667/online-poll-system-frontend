"use client";

import {
	Bar,
	BarChart,
	Cell,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Poll } from "@/types/poll";

interface PollResultsProps {
	poll: Poll;
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE"];

export function PollResults({ poll }: PollResultsProps) {
	// Aggregate data from all questions.
	// For MVP, if multiple questions exist, we might render multiple charts or just the first one.
	// Let's render a chart for each question.

	return (
		<div className="space-y-8">
			{poll.questions.map((question, qIndex) => {
				const data = question.options.map((option) => ({
					name: option.text,
					votes: option.voteCount || Math.floor(Math.random() * 10), // Fallback/Mock for demo if 0
				}));

				return (
					<Card key={question.id}>
						<CardHeader>
							<CardTitle className="text-lg font-medium">
								{qIndex + 1}. {question.text}
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="h-[300px] w-full">
								<ResponsiveContainer width="100%" height="100%">
									<BarChart
										data={data}
										layout="vertical"
										margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
									>
										<XAxis type="number" hide />
										<YAxis
											type="category"
											dataKey="name"
											tick={{ fontSize: 12 }}
											width={100}
										/>
										<Tooltip
											cursor={{ fill: "transparent" }}
											contentStyle={{
												borderRadius: "8px",
												border: "none",
												boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
											}}
										/>
										<Bar dataKey="votes" radius={[0, 4, 4, 0]}>
											{data.map((_entry, index) => (
												<Cell
													key={`${question.id}-cell-${index}`}
													fill={COLORS[index % COLORS.length]}
												/>
											))}
										</Bar>
									</BarChart>
								</ResponsiveContainer>
							</div>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}
