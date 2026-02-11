export default function GuidesPage() {
	return (
		<div className="container mx-auto px-4 md:px-6 py-24 space-y-8 max-w-4xl min-h-[60vh]">
			<div className="space-y-4">
				<h1 className="text-4xl md:text-5xl font-black tracking-tight">
					Guides & Tutorials
				</h1>
				<p className="text-xl text-muted-foreground">
					Learn how to make the most out of Plaude Poll.
				</p>
			</div>

			<div className="grid gap-8 pt-8">
				<div className="p-8 border rounded-2xl bg-secondary/20 hover:bg-secondary/30 transition-all border-border/50 shadow-sm group">
					<h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
						Creating your first poll
					</h3>
					<p className="text-lg text-muted-foreground leading-relaxed">
						Navigate to the dashboard and click "Create a poll". Add your
						question, provide some options, and customize your settings. It's
						that easy!
					</p>
				</div>
				<div className="p-8 border rounded-2xl bg-secondary/20 hover:bg-secondary/30 transition-all border-border/50 shadow-sm group">
					<h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
						Analyzing results
					</h3>
					<p className="text-lg text-muted-foreground leading-relaxed">
						Access your poll's results page to see beautiful, real-time charts.
						You can export the data to share with your team or use it for deeper
						analysis.
					</p>
				</div>
			</div>
		</div>
	);
}
