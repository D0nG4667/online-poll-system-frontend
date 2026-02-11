"use client";

import {
	BarChart3,
	Clock,
	LineChart,
	Plus,
	Share2,
	ShieldCheck,
	Sparkles,
	Users,
	Zap,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
	return (
		<div className="bg-background relative overflow-hidden">
			{/* Decor elements */}
			<div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-indigo-500/10 blur-[120px] rounded-full -z-10" />
			<div className="absolute top-[800px] right-0 w-[400px] h-[400px] bg-purple-500/5 blur-[100px] rounded-full -z-10" />

			{/* Hero Section */}
			<section className="container mx-auto px-4 md:px-6 py-20 text-center md:py-32 flex flex-col items-center">
				<div className="max-w-[900px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 text-xs font-bold uppercase tracking-wider mb-2">
						<Sparkles className="h-3 w-3" />
						AI-Powered Polling
					</div>
					<h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-8xl lg:text-8xl">
						Create Intelligent Polls <br />
						<span className="bg-gradient-to-r from-[#F36B21] to-orange-400 bg-clip-text text-transparent">
							With AI Assistance
						</span>
					</h1>
					<p className="mx-auto max-w-[700px] text-muted-foreground text-lg md:text-xl font-medium leading-relaxed">
						Streamline your polling process from creation to analysis. Generate
						and edit questions, collect responses, and gain actionable insights
						with minimal effort.
					</p>

					<div className="flex flex-col gap-4 min-[400px]:flex-row justify-center pt-4">
						<Link href="/signup">
							<Button
								size="lg"
								variant="unicorn"
								className="w-full min-[400px]:w-auto px-10 h-14 text-base font-bold bg-[#F36B21] hover:bg-orange-600 border-none shadow-xl shadow-orange-500/20"
							>
								Get Started
							</Button>
						</Link>
						<Link href="/dashboard">
							<Button
								size="lg"
								variant="outline"
								className="w-full min-[400px]:w-auto px-10 h-14 text-base font-bold rounded-xl border-muted-foreground/20 hover:bg-muted/10 transition-all"
							>
								View a Demo
							</Button>
						</Link>
					</div>
				</div>

				{/* Dashboard Mockup Visual */}
				<div className="mt-20 w-full max-w-6xl relative animate-in zoom-in-95 duration-1000 delay-300">
					<div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-purple-500/20 rounded-[2.5rem] blur-2xl opacity-50" />
					<div className="relative rounded-[2rem] border border-white/20 bg-white/5 shadow-2xl backdrop-blur-sm overflow-hidden p-4 md:p-8">
						<div className="rounded-xl border border-white/10 bg-[#0F172A] shadow-inner overflow-hidden aspect-[16/10] flex flex-col">
							{/* Mock Header */}
							<div className="h-12 border-b border-white/5 flex items-center px-4 gap-4 bg-white/5">
								<div className="flex gap-1.5">
									<div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
									<div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
									<div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
								</div>
								<div className="h-6 w-32 bg-white/5 rounded-full mx-auto" />
							</div>
							{/* Mock Content */}
							<div className="flex-1 p-6 flex gap-6">
								<div className="w-48 hidden md:flex flex-col gap-4">
									<div className="h-8 w-full bg-white/10 rounded-lg" />
									<div className="h-8 w-full bg-[#F36B21]/20 border border-[#F36B21]/30 rounded-lg" />
									<div className="h-8 w-full bg-white/5 rounded-lg" />
									<div className="h-8 w-full bg-white/5 rounded-lg" />
								</div>
								<div className="flex-1 space-y-6">
									<div className="h-12 w-full bg-white/10 rounded-xl" />
									<div className="grid grid-cols-2 gap-4">
										<div className="h-32 bg-white/5 rounded-xl animate-pulse" />
										<div className="h-32 bg-white/5 rounded-xl" />
									</div>
									<div className="h-48 w-full bg-gradient-to-br from-white/5 to-transparent rounded-xl border border-white/5" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Core Features */}
			<section className="container mx-auto px-4 md:px-6 py-24 md:py-32">
				<div className="text-center space-y-4 mb-20">
					<p className="text-[#F36B21] text-sm font-bold uppercase tracking-[0.2em]">
						Our capabilities
					</p>
					<h2 className="text-4xl md:text-6xl font-black tracking-tight">
						Core Features
					</h2>
					<p className="text-muted-foreground text-lg max-w-2xl mx-auto">
						Everything you need to create, distribute, and analyze polls with AI
						assistance.
					</p>
				</div>

				<div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
					<FeatureCardLong
						icon={Sparkles}
						title="AI-Assisted Creation"
						description="Generate polls instantly from simple prompts. Our AI suggests questions, categories, and optimal option structures."
					/>
					<FeatureCardLong
						icon={Share2}
						title="Easy Distribution"
						description="Share your polls with a single link or embed them directly on your website. Reach your audience wherever they are."
					/>
					<FeatureCardLong
						icon={Zap}
						title="Real-Time Responses"
						description="Watch as votes come in live. Our platform handles thousands of concurrent participants with sub-second updates."
					/>
					<FeatureCardLong
						icon={BarChart3}
						title="Advanced Analytics"
						description="Go beyond simple counts. Visualize trends, demographic breakdowns, and correlation insights automatically."
					/>
				</div>
			</section>

			{/* Insights Section */}
			<section className="container mx-auto px-4 md:px-6 py-24 bg-muted/30 relative">
				<div className="absolute top-1/2 left-0 w-72 h-72 bg-orange-500/5 blur-[100px] rounded-full" />
				<div className="text-center space-y-4 mb-20">
					<div className="inline-flex py-1 px-3 rounded-full bg-orange-500/10 text-[#F36B21] text-xs font-bold border border-orange-500/20 mx-auto">
						Analytical Edge
					</div>
					<h2 className="text-4xl md:text-6xl font-black tracking-tight max-w-3xl mx-auto leading-tight">
						Research-grade insights. <br />
						<span className="text-[#F36B21]">Instant results.</span>
					</h2>
					<p className="text-muted-foreground text-lg max-w-2xl mx-auto">
						Generate statistical data across responses from thousands of
						participants, visualized instantly to help you make better
						decisions.
					</p>
				</div>

				<div className="grid lg:grid-cols-5 gap-12 items-center max-w-6xl mx-auto">
					{/* Left Side: Mockup */}
					<div className="lg:col-span-3 h-[400px] bg-background rounded-3xl border border-border shadow-2xl relative overflow-hidden p-6 group">
						<div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-green-500 animate-pulse" />
						<div className="space-y-6">
							<div className="h-4 w-48 bg-muted rounded-full" />
							<div className="h-10 w-full bg-muted/50 rounded-xl" />
							<div className="space-y-4 pt-4">
								<div className="flex justify-between items-center">
									<div className="h-4 w-32 bg-muted rounded-full" />
									<div className="h-4 w-8 bg-muted rounded-full" />
								</div>
								<div className="h-2 w-full bg-muted rounded-full overflow-hidden">
									<div className="h-full w-[65%] bg-indigo-500" />
								</div>
								<div className="flex justify-between items-center">
									<div className="h-4 w-24 bg-muted rounded-full" />
									<div className="h-4 w-8 bg-muted rounded-full" />
								</div>
								<div className="h-2 w-full bg-muted rounded-full overflow-hidden">
									<div className="h-full w-[40%] bg-purple-500" />
								</div>
							</div>
							<div className="pt-6 h-32 w-full border border-dashed border-muted rounded-2xl flex items-center justify-center">
								<LineChart className="h-12 w-12 text-muted/50" />
							</div>
						</div>
					</div>

					{/* Right Side: Stats Grid */}
					<div className="lg:col-span-2 grid gap-4">
						<StatCard
							icon={<Zap className="h-4 w-4 text-green-500" />}
							title="82% faster"
							description="In data collection"
						/>
						<StatCard
							icon={<Clock className="h-4 w-4 text-blue-500" />}
							title="<5 min"
							description="Average result time"
						/>
						<StatCard
							icon={<ShieldCheck className="h-4 w-4 text-orange-500" />}
							title="95%"
							description="Decision accuracy"
						/>
						<StatCard
							icon={<Users className="h-4 w-4 text-purple-500" />}
							title="15+"
							description="Participated agencies"
						/>
					</div>
				</div>

				<div className="flex justify-center mt-16">
					<Button
						variant="unicorn"
						className="bg-[#F36B21] px-12 h-14 text-lg font-bold group"
					>
						See Detailed Analytics
						<Share2 className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
					</Button>
				</div>
			</section>

			{/* FAQ Section */}
			<section className="container mx-auto px-4 md:px-6 py-24">
				<div className="text-center space-y-4 mb-20">
					<div className="inline-flex py-1 px-3 rounded-full bg-orange-500/10 text-[#F36B21] text-xs font-bold border border-orange-500/20">
						FAQ
					</div>
					<h2 className="text-4xl md:text-6xl font-black tracking-tight">
						Everything You Need To Know
					</h2>
					<p className="text-muted-foreground text-lg">
						Get answers to common questions about our AI-powered voting
						platform.
					</p>
				</div>

				<div className="max-w-3xl mx-auto space-y-4">
					<FAQItem
						question="What is Plaude Poll?"
						answer="Plaude Poll is a state-of-the-art AI-powered platform for creating, managing, and analyzing polls with research-grade precision."
					/>
					<FAQItem
						question="Is it really free to use?"
						answer="Yes! Our core features are free for everyone. We offer premium plans for advanced enterprise needs."
					/>
					<FAQItem
						question="How does Poll AI templates work?"
						answer="Simply describe your objective, and our AI will generate a complete poll structure including optimized questions and options."
					/>
					<FAQItem
						question="Can I export my analytics?"
						answer="Absolutely. All poll data can be exported in various formats including CSV, JSON, and high-res chart images."
					/>
				</div>
			</section>

			{/* Newsletter Section */}
			<section className="container mx-auto px-4 md:px-6 py-24 pb-32">
				<div className="max-w-6xl mx-auto rounded-[3rem] bg-orange-50 p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
					<div className="absolute top-0 right-0 w-64 h-64 bg-orange-200/50 blur-[120px] rounded-full" />
					<div className="flex-1 space-y-6 relative z-10 text-center md:text-left">
						<div className="inline-flex px-3 py-1 rounded-full bg-[#F36B21] text-white text-[10px] font-bold uppercase tracking-widest">
							Newsletter
						</div>
						<h2 className="text-4xl md:text-5xl font-extrabold text-[#1E293B]">
							Stay updated with{" "}
							<span className="text-[#F36B21]">Plaude Poll</span>
						</h2>
						<p className="text-slate-600 text-lg">
							Subscribe to our newsletter for the latest features, tips, and
							polling best practices direct to your inbox.
						</p>
						<div className="flex items-center gap-2 text-slate-500 font-medium justify-center md:justify-start">
							<div className="flex -space-x-2">
								{[1, 2, 3].map((i) => (
									<div
										key={i}
										className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px]"
									>
										<Users className="h-3 w-3" />
									</div>
								))}
							</div>
							<p className="text-sm ml-2">Join 10,000+ pollsters worldwide.</p>
						</div>
					</div>
					<div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-orange-100 relative z-10">
						<form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
							<div className="space-y-2">
								<label
									htmlFor="newsletter-name"
									className="text-xs font-bold text-slate-500 uppercase ml-1"
								>
									Full Name
								</label>
								<input
									id="newsletter-name"
									type="text"
									placeholder="John Doe"
									className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-[#F36B21]/50 text-slate-700"
								/>
							</div>
							<div className="space-y-2">
								<label
									htmlFor="newsletter-email"
									className="text-xs font-bold text-slate-500 uppercase ml-1"
								>
									Email
								</label>
								<input
									id="newsletter-email"
									type="email"
									placeholder="john@example.com"
									className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-[#F36B21]/50 text-slate-700"
								/>
							</div>
							<Button className="w-full h-12 rounded-xl bg-[#F36B21] hover:bg-orange-600 text-white font-bold shadow-lg shadow-orange-500/25">
								Subscribe Now
							</Button>
							<p className="text-[10px] text-center text-slate-400 mt-4">
								By subscribing, you agree to our Terms and Privacy Policy.
							</p>
						</form>
					</div>
				</div>
			</section>
		</div>
	);
}

interface FeatureCardLongProps {
	icon: React.ElementType;
	title: string;
	description: string;
}

function FeatureCardLong({
	icon: Icon,
	title,
	description,
}: FeatureCardLongProps) {
	return (
		<div className="rounded-3xl border border-border bg-card/40 backdrop-blur-sm p-8 flex flex-col gap-6 hover:shadow-2xl hover:shadow-orange-500/5 transition-all group">
			<div className="flex items-center gap-4">
				<div className="h-12 w-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-[#F36B21] group-hover:bg-[#F36B21] group-hover:text-white transition-all">
					<Icon className="h-6 w-6" />
				</div>
				<h3 className="text-2xl font-bold">{title}</h3>
			</div>
			<p className="text-muted-foreground leading-relaxed">{description}</p>
			<div className="mt-4 aspect-[16/8] rounded-2xl bg-muted/30 border border-border/50 relative overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-tr from-orange-500/5 to-transparent" />
				<div className="absolute bottom-[-20%] left-[10%] right-[10%] h-[120%] bg-background rounded-t-xl border border-border/50 shadow-2xl p-4 flex flex-col gap-3">
					<div className="h-4 w-1/3 bg-muted rounded-full" />
					<div className="h-8 w-full bg-muted/50 rounded-lg" />
					<div className="h-8 w-full bg-muted/50 rounded-lg" />
				</div>
			</div>
		</div>
	);
}

interface StatCardProps {
	icon: React.ReactNode;
	title: string;
	description: string;
}

function StatCard({ icon, title, description }: StatCardProps) {
	return (
		<div className="bg-background border border-border p-4 rounded-2xl flex items-center gap-4 hover:shadow-lg transition-shadow">
			<div className="h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center">
				{icon}
			</div>
			<div>
				<h4 className="font-bold text-slate-800">{title}</h4>
				<p className="text-xs text-muted-foreground">{description}</p>
			</div>
		</div>
	);
}

interface FAQItemProps {
	question: string;
	answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
	return (
		<div className="group border border-border bg-card/40 rounded-2xl p-6 hover:border-orange-200 transition-all cursor-pointer">
			<div className="flex justify-between items-center gap-4">
				<h4 className="text-lg font-bold text-slate-700">{question}</h4>
				<div className="h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all">
					<Plus className="h-4 w-4" />
				</div>
			</div>
			<p className="mt-4 text-muted-foreground leading-relaxed hidden group-hover:block animate-in fade-in slide-in-from-top-2 duration-300">
				{answer}
			</p>
		</div>
	);
}
