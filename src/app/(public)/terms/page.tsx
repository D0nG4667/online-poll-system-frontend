"use client";

import { FileText, Sparkles } from "lucide-react";

export default function TermsPage() {
	return (
		<div className="relative min-h-screen overflow-hidden">
			{/* Decorative blurs */}
			<div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/5 blur-[120px] rounded-full -z-10" />
			<div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full -z-10" />

			<div className="container mx-auto px-4 md:px-6 py-24 md:py-32 max-w-4xl relative z-10">
				<div className="space-y-6 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 text-center md:text-left">
					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-500/10 border border-slate-500/20 text-slate-600 text-xs font-bold uppercase tracking-widest">
						<FileText className="h-3 w-3" />
						Agreement
					</div>
					<h1 className="text-4xl md:text-6xl font-black tracking-tight">
						Terms of Service
					</h1>
					<p className="text-lg text-muted-foreground italic flex items-center justify-center md:justify-start gap-2">
						<Sparkles className="h-4 w-4 text-[#F36B21]" />
						Last Updated: February 11, 2026
					</p>
				</div>

				<div className="prose prose-slate prose-lg dark:prose-invert max-w-none space-y-16 pt-8">
					<section className="space-y-6">
						<h2 className="text-3xl font-bold text-slate-800">
							Acceptance of Terms
						</h2>
						<p className="text-lg text-muted-foreground leading-relaxed">
							By accessing or using Plaude Poll, you agree to be bound by these
							Terms of Service. If you do not agree to all of these terms, do
							not use our services.
						</p>
					</section>

					<section className="space-y-6">
						<h2 className="text-3xl font-bold text-slate-800">User Conduct</h2>
						<p className="text-lg text-muted-foreground leading-relaxed">
							You are responsible for any content you post on Plaude Poll. You
							agree not to use the service for:
						</p>
						<ul className="list-disc pl-6 space-y-2 text-muted-foreground">
							<li>Spamming or spreading misinformation</li>
							<li>Harassment or abusive behavior</li>
							<li>Impersonation of others</li>
							<li>Any illegal activities</li>
						</ul>
					</section>

					<section className="space-y-6">
						<h2 className="text-3xl font-bold text-slate-800">
							Intellectual Property
						</h2>
						<p className="text-lg text-muted-foreground leading-relaxed">
							The Plaude Poll logo, service, and infrastructure are the
							intellectual property of Plaude Poll. Content submitted by users
							remains their property, but by submitting it, you grant us a
							license to host and display it within our platform's services.
						</p>
					</section>

					<section className="space-y-6">
						<h2 className="text-3xl font-bold text-slate-800">
							Disclaimer of Warranties
						</h2>
						<p className="text-lg text-muted-foreground leading-relaxed">
							Plaude Poll is provided "as is" without any warranties, express or
							implied. We do not guarantee uninterrupted or error-free service.
						</p>
					</section>

					<section className="pt-12 border-t border-border">
						<p className="text-sm text-center text-muted-foreground">
							Questions about terms? Contact{" "}
							<span className="font-bold text-slate-800">
								support@plaudepoll.com
							</span>
						</p>
					</section>
				</div>
			</div>
		</div>
	);
}
