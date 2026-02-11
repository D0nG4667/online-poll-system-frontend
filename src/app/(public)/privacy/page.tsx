"use client";

import { ShieldCheck, Sparkles } from "lucide-react";

export default function PrivacyPage() {
	return (
		<div className="relative min-h-screen overflow-hidden">
			{/* Decorative blurs */}
			<div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full -z-10" />
			<div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full -z-10" />

			<div className="container mx-auto px-4 md:px-6 py-24 md:py-32 max-w-4xl relative z-10">
				<div className="space-y-6 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 text-center md:text-left">
					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 text-xs font-bold uppercase tracking-widest">
						<ShieldCheck className="h-3 w-3" />
						Legal Center
					</div>
					<h1 className="text-4xl md:text-6xl font-black tracking-tight">
						Privacy Policy
					</h1>
					<p className="text-lg text-muted-foreground italic flex items-center justify-center md:justify-start gap-2">
						<Sparkles className="h-4 w-4 text-[#F36B21]" />
						Last Updated: February 11, 2026
					</p>
				</div>

				<div className="prose prose-slate prose-lg dark:prose-invert max-w-none space-y-16 pt-8">
					<section className="space-y-6">
						<h2 className="text-3xl font-bold flex items-center gap-4 text-slate-800">
							<span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-white text-base">
								1
							</span>
							Information We Collect
						</h2>
						<p className="text-lg text-muted-foreground leading-relaxed">
							At Plaude Poll, we prioritize your data security. We only collect
							information strictly necessary to provide our services. This
							includes your email address during registration, and basic
							technical data (IP, browser type) to ensure the security and
							integrity of our voting system.
						</p>
					</section>

					<section className="space-y-6">
						<h2 className="text-3xl font-bold flex items-center gap-4 text-slate-800">
							<span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white text-base">
								2
							</span>
							How We Use Your Data
						</h2>
						<p className="text-lg text-muted-foreground leading-relaxed">
							Your data is primarily used to manage your personal polls, prevent
							duplicate or fraudulent voting via bot detection, and improve the
							overall user experience. **We never sell your personal information
							to third parties.**
						</p>
						<ul className="list-disc pl-6 space-y-2 text-muted-foreground">
							<li>Account management and authentication</li>
							<li>Poll integrity and fraud prevention</li>
							<li>System performance and bug tracking</li>
							<li>Occasional newsletter updates (if opted in)</li>
						</ul>
					</section>

					<section className="space-y-6">
						<h2 className="text-3xl font-bold flex items-center gap-4 text-slate-800">
							<span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500 text-white text-base">
								3
							</span>
							Cookies & Local Storage
						</h2>
						<p className="text-lg text-muted-foreground leading-relaxed">
							We use essential cookies and session tokens to maintain your login
							status and ensure that voting is fair and accurate. Without these,
							we wouldn't be able to provide a secure environment for poll
							creators and participants.
						</p>
					</section>

					<section className="space-y-6 border-t border-border pt-12">
						<h2 className="text-3xl font-bold text-slate-800">
							Contact Legal Team
						</h2>
						<p className="text-muted-foreground">
							If you have any questions about this Privacy Policy, please
							contact us at:
						</p>
						<p className="font-bold text-indigo-600">legal@plaudepoll.com</p>
					</section>
				</div>
			</div>
		</div>
	);
}
