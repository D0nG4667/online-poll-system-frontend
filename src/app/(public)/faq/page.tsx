"use client";

import { Plus, Sparkles } from "lucide-react";

export default function FAQPage() {
	return (
		<div className="relative min-h-screen overflow-hidden">
			{/* Decorative blurs */}
			<div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/5 blur-[120px] rounded-full -z-10" />
			<div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full -z-10" />

			<div className="container mx-auto px-4 md:px-6 py-24 md:py-32 max-w-4xl relative z-10">
				<div className="text-center space-y-6 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-[#F36B21] text-xs font-bold uppercase tracking-widest mx-auto">
						<Sparkles className="h-3 w-3" />
						Knowledge Base
					</div>
					<h1 className="text-4xl md:text-6xl font-black tracking-tight">
						Frequently Asked Questions
					</h1>
					<p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
						Everything you need to know about Plaude Poll. Find answers to
						common questions about our AI-powered polling platform.
					</p>
				</div>

				<div className="space-y-6">
					<FAQItem
						question="Is Plaude Poll free?"
						answer="Yes! Our basic polling features are completely free for everyone. We believe in providing simple, accessible tools for everyone to gather feedback without financial barriers."
					/>
					<FAQItem
						question="Do I need an account to vote?"
						answer="Yes, we require a quick signup or login to vote. This helps us ensure the integrity of our polls by preventing fraudulent voting, bot spam, and providing a more reliable experience for creators."
					/>
					<FAQItem
						question="Can I see live results?"
						answer="Absolutely! Once you've cast your vote, you'll gain access to real-time analytics and high-fidelity charts showing exactly how the community is responding."
					/>
					<FAQItem
						question="How does the AI creation magic work?"
						answer="Simply describe your objective in the AI prompt dialog, and our models will suggest optimized questions, categories, and option structures to maximize engagement."
					/>
					<FAQItem
						question="Is my data secure?"
						answer="Security is our top priority. We use industry-standard encryption and never sell your personal data to third parties. Check our Privacy Policy for more details."
					/>
				</div>

				<div className="mt-20 p-8 rounded-3xl bg-orange-50 border border-orange-100 text-center space-y-4">
					<h3 className="text-2xl font-bold text-slate-800">
						Still have questions?
					</h3>
					<p className="text-slate-600">
						Can't find the answer you're looking for? Please chat to our
						friendly team.
					</p>
					<div className="pt-4">
						<button
							type="button"
							className="px-8 h-12 rounded-xl bg-[#F36B21] text-white font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
						>
							Get in Touch
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
	return (
		<div className="group border border-border bg-card/40 backdrop-blur-sm rounded-2xl p-6 md:p-8 hover:border-[#F36B21]/30 transition-all cursor-pointer shadow-sm hover:shadow-xl hover:shadow-orange-500/5">
			<div className="flex justify-between items-center gap-4">
				<h4 className="text-xl font-bold text-slate-700 group-hover:text-[#F36B21] transition-colors">
					{question}
				</h4>
				<div className="h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center group-hover:bg-[#F36B21] group-hover:text-white transition-all shrink-0">
					<Plus className="h-5 w-5" />
				</div>
			</div>
			<p className="mt-6 text-lg text-muted-foreground leading-relaxed hidden group-hover:block animate-in fade-in slide-in-from-top-2 duration-300">
				{answer}
			</p>
		</div>
	);
}
