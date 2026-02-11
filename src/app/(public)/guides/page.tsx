"use client";

import { BookOpen, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GuidesPage() {
	return (
		<div className="relative min-h-screen overflow-hidden">
			{/* Decorative blurs */}
			<div className="absolute top-0 left-0 w-[500px] h-[500px] bg-orange-500/5 blur-[120px] rounded-full -z-10" />
			<div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 blur-[120px] rounded-full -z-10" />

			<div className="container mx-auto px-4 md:px-6 py-24 md:py-32 max-w-5xl relative z-10">
				<div className="text-center space-y-6 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-[#F36B21] text-xs font-bold uppercase tracking-widest mx-auto">
						<BookOpen className="h-3 w-3" />
						Learning Center
					</div>
					<h1 className="text-4xl md:text-6xl font-black tracking-tight">
						Guides & Tutorials
					</h1>
					<p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
						Master the art of high-engagement polling with our step-by-step
						guides and best practices.
					</p>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
					<GuideCard
						title="Quick Start Guide"
						description="Learn how to create your first poll and share it with your audience in under 2 minutes."
						tag="Beginner"
					/>
					<GuideCard
						title="AI Magic Unleashed"
						description="Deep dive into using our AI assistant to generate research-grade poll questions."
						tag="AI Focus"
					/>
					<GuideCard
						title="Interpreting Analytics"
						description="Understand demographics, trends, and voter behavior through our advanced dashboard."
						tag="Advanced"
					/>
					<GuideCard
						title="Embedding Polls"
						description="How to integrate your Plaude polls directly into your website or blog seamlessly."
						tag="Technical"
					/>
					<GuideCard
						title="Fraud Prevention"
						description="Learn about our bot detection systems and how we ensure 100% voter integrity."
						tag="Security"
					/>
					<GuideCard
						title="Team Collaboration"
						description="Managing large scale organizational polls with multiple admins and reviewers."
						tag="Enterprise"
					/>
				</div>

				<div className="mt-24 rounded-[3rem] bg-[#0F172A] p-12 text-center text-white relative overflow-hidden">
					<div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full" />
					<div className="relative z-10 space-y-6">
						<h2 className="text-3xl md:text-5xl font-bold flex items-center justify-center gap-3">
							Ready to create? <Sparkles className="text-[#F36B21]" />
						</h2>
						<p className="text-slate-400 text-lg max-w-xl mx-auto">
							Put your knowledge into practice and start building intelligent
							polls today.
						</p>
						<div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
							<Link href="/signin">
								<Button className="w-full sm:w-auto px-10 h-14 bg-[#F36B21] hover:bg-orange-600 font-bold border-none shadow-xl shadow-orange-500/20 rounded-2xl">
									Create Poll Now
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function GuideCard({ title, description, tag }: any) {
	return (
		<div className="group bg-card/40 backdrop-blur-sm border border-border rounded-3xl p-8 hover:border-orange-500/30 transition-all hover:shadow-2xl hover:shadow-orange-500/5 cursor-pointer">
			<div className="inline-flex px-2 py-0.5 rounded-md bg-secondary text-[10px] font-bold uppercase tracking-wider mb-6 group-hover:bg-orange-500/10 group-hover:text-orange-600 transition-colors">
				{tag}
			</div>
			<h3 className="text-2xl font-bold mb-4 group-hover:text-[#F36B21] transition-colors">
				{title}
			</h3>
			<p className="text-muted-foreground leading-relaxed mb-8">
				{description}
			</p>
			<div className="flex items-center text-sm font-bold text-slate-800 group-hover:gap-2 transition-all">
				Read Guide <span className="text-[#F36B21] ml-1">→</span>
			</div>
		</div>
	);
}
