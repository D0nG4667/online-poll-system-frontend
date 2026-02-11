import {
	BarChart3,
	Clock,
	Code,
	Settings,
	ShieldCheck,
	Smile,
	Users,
	Zap,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function Home() {
	return (
		<div className="bg-background relative overflow-hidden">
			{/* Decor elements */}
			<div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-indigo-500/10 blur-[120px] rounded-full -z-10" />
			<div className="absolute top-[800px] right-0 w-[400px] h-[400px] bg-purple-500/5 blur-[100px] rounded-full -z-10" />

			{/* Hero Section */}
			<section className="container mx-auto px-4 md:px-6 py-20 text-center md:py-32 flex flex-col items-center">
				<div className="max-w-[800px] space-y-6">
					<h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
						Create a poll <br />
						<span className="text-primary italic">in seconds</span>
					</h1>
					<p className="mx-auto max-w-[600px] text-muted-foreground text-lg md:text-xl font-medium">
						Want to ask your friends where to go Friday night or get quick
						feedback? Create a poll – and get answers in no time.
					</p>

					<div className="flex flex-col gap-4 min-[400px]:flex-row justify-center pt-4">
						<Link href="/signup">
							<Button
								size="lg"
								variant="unicorn"
								className="w-full min-[400px]:w-auto px-10 h-14 text-base font-bold transition-all shadow-xl hover:shadow-purple-500/40"
							>
								Create a poll
							</Button>
						</Link>
						<Link href="/signup">
							<Button
								size="lg"
								variant="outline"
								className="w-full min-[400px]:w-auto px-10 h-14 text-base font-bold rounded-md bg-secondary/50 backdrop-blur-sm border-secondary-foreground/10 hover:bg-secondary/80"
							>
								Live Demo
							</Button>
						</Link>
					</div>
					<p className="text-xs text-muted-foreground font-medium">
						Signup required to vote
					</p>
				</div>

				{/* Mock Illustration / Hero Image */}
				<div className="mt-16 w-full max-w-5xl aspect-[16/9] rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm shadow-2xl relative overflow-hidden flex items-center justify-center p-8 group">
					<div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-purple-500/10 opacity-50 group-hover:opacity-100 transition-opacity" />
					<div className="relative z-10 w-full h-full border border-border/50 rounded-xl bg-background/80 shadow-inner flex flex-col p-6 items-center justify-center text-center">
						<div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-6">
							<Zap className="h-12 w-12 text-primary" />
						</div>
						<h3 className="text-2xl font-bold mb-2">Plaude Poll Dashboard</h3>
						<p className="text-muted-foreground max-w-sm">
							Experience real-time voting and advanced analytics with our
							intuitive interface.
						</p>
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="w-full border-y border-border/40 bg-secondary/20 backdrop-blur-sm">
				<div className="container mx-auto px-4 md:px-6 py-12 md:py-20 flex flex-col md:flex-row justify-center items-center gap-12 md:gap-24 text-center">
					<div className="space-y-1">
						<h2 className="text-4xl md:text-5xl font-black">2.3M+</h2>
						<p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
							Users
						</p>
					</div>
					<div className="space-y-1">
						<h2 className="text-4xl md:text-5xl font-black">13M+</h2>
						<p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
							Polls
						</p>
					</div>
					<div className="space-y-1">
						<h2 className="text-4xl md:text-5xl font-black">290M+</h2>
						<p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
							Votes
						</p>
					</div>
				</div>
			</section>

			{/* Advanced Features */}
			<section className="container mx-auto px-4 md:px-6 py-24">
				<div className="max-w-5xl mx-auto space-y-32">
					{/* Feature 1: Advanced Maker */}
					<div className="grid md:grid-cols-2 gap-12 items-center">
						<div className="space-y-6">
							<div className="h-12 w-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
								<Settings className="h-6 w-6" />
							</div>
							<h2 className="text-3xl md:text-4xl font-bold">
								Use our advanced <br /> poll maker
							</h2>
							<p className="text-lg text-muted-foreground leading-relaxed">
								A Plaude Poll is a quick and simple voting tool used to
								determine the opinion of a group or the public on any issue.
								Plaude Polls are perfect for when the majority opinion matters
								most.
							</p>
							<div className="flex gap-4">
								<Link href="/dashboard/create">
									<Button variant="unicorn" className="font-bold">
										Create a poll
									</Button>
								</Link>
								<Link href="/faq">
									<Button
										variant="ghost"
										className="font-bold border-border/10"
									>
										View example
									</Button>
								</Link>
							</div>
						</div>
						<div className="aspect-video rounded-xl bg-secondary/30 border border-border/50 flex items-center justify-center p-6 shadow-xl relative overflow-hidden group">
							<div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent" />
							<div className="w-full h-full bg-background rounded shadow-2xl relative z-10 p-4 space-y-3">
								<div className="h-4 w-1/2 bg-secondary rounded" />
								<div className="h-8 w-full bg-secondary/50 rounded" />
								<div className="h-8 w-full bg-secondary/50 rounded" />
								<div className="h-8 w-full bg-secondary/50 rounded" />
								<div className="pt-4 flex gap-2">
									<div className="h-8 w-20 bg-primary/20 rounded" />
									<div className="h-8 w-20 bg-secondary rounded" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Feature Grid */}
			<section className="container mx-auto px-4 md:px-6 py-24 text-center">
				<p className="text-primary text-xs font-bold uppercase tracking-widest mb-4">
					Polling Made Easy
				</p>
				<h2 className="text-3xl md:text-5xl font-bold mb-6">
					Simple polls with powerful configuration
				</h2>
				<p className="text-muted-foreground max-w-3xl mx-auto mb-16 text-lg">
					While we make our polls as simple and beautiful as possible, we also
					offer powerful customization options to enable on-demand adjustments
					for many different purposes.
				</p>

				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<FeatureCard
						icon={ShieldCheck}
						title="Fake Detection"
						description="By default, bots and VPN users are blocked from voting on Plaude polls."
						color="text-indigo-500"
					/>
					<FeatureCard
						icon={Clock}
						title="Deadlines"
						description="Our polls run indefinitely. You can change that by setting a deadline."
						color="text-blue-500"
					/>
					<FeatureCard
						icon={Smile}
						title="Emoji Support"
						description="We support all Emojis natively. Feel free to use as many as you want!"
						color="text-purple-500"
					/>
					<FeatureCard
						icon={BarChart3}
						title="Live Results"
						description="Evaluate your poll results in a pie chart or bar graph in real-time."
						color="text-pink-500"
					/>
					<FeatureCard
						icon={Code}
						title="Poll API"
						description="We provide an easy-to-use API for poll creation and result analysis."
						color="text-indigo-500"
						href="/api/schema/swagger-ui/"
					/>
					<FeatureCard
						icon={Users}
						title="Active Development"
						description="We are continuously working on new features and DX updates."
						color="text-blue-500"
					/>
				</div>
			</section>

			{/* Final CTA */}
			<section className="container mx-auto px-4 md:px-6 py-24">
				<div className="w-full bg-secondary/40 backdrop-blur-sm border border-border/50 rounded-3xl p-12 md:p-20 text-center flex flex-col items-center gap-8 shadow-2xl">
					<div className="space-y-4">
						<h2 className="text-3xl md:text-5xl font-bold">
							Ready to get started?
						</h2>
						<h2 className="text-3xl md:text-5xl font-bold text-primary italic leading-tight">
							It's free!
						</h2>
					</div>
					<div className="flex flex-col gap-4 min-[400px]:flex-row justify-center">
						<Link href="/signin">
							<Button
								variant="unicorn"
								className="h-12 px-10 font-bold text-sm"
							>
								Create a poll
							</Button>
						</Link>
						<Link href="/signup">
							<Button
								variant="outline"
								className="h-12 px-10 font-bold text-sm border-primary/20 text-primary hover:bg-primary/10"
							>
								Sign Up
							</Button>
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
}

interface FeatureCardProps {
	icon: React.ElementType;
	title: string;
	description: string;
	color: string;
	href?: string;
}

function FeatureCard({
	icon: Icon,
	title,
	description,
	color,
	href,
}: FeatureCardProps) {
	const content = (
		<Card className="bg-secondary/20 border-none backdrop-blur-sm text-left hover:bg-secondary/40 transition-colors group h-full">
			<CardHeader className="space-y-4">
				<div
					className={`h-10 w-10 rounded-lg bg-background/50 flex items-center justify-center ${color} shadow-sm group-hover:scale-110 transition-transform`}
				>
					<Icon className="h-5 w-5" />
				</div>
				<CardTitle className="text-xl">{title}</CardTitle>
				<CardDescription className="text-muted-foreground leading-relaxed text-sm font-medium">
					{description}
				</CardDescription>
			</CardHeader>
		</Card>
	);

	if (href) {
		return <Link href={href}>{content}</Link>;
	}

	return content;
}
