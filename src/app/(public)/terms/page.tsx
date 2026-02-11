export default function TermsPage() {
	return (
		<div className="container mx-auto px-4 md:px-6 py-24 space-y-8 max-w-4xl min-h-[60vh]">
			<div className="space-y-4">
				<h1 className="text-4xl md:text-5xl font-black tracking-tight">
					Terms of Service
				</h1>
				<p className="text-lg text-muted-foreground italic">
					Last Updated: February 11, 2026
				</p>
			</div>

			<div className="prose dark:prose-invert max-w-none space-y-12 pt-8">
				<section className="space-y-4">
					<h2 className="text-3xl font-bold">1. Acceptance of Terms</h2>
					<p className="text-lg text-muted-foreground leading-relaxed">
						By accessing or using Plaude Poll, you agree to be bound by these
						Terms of Service. If you do not agree to these terms, please do not
						use our platform.
					</p>
				</section>
				<section className="space-y-4">
					<h2 className="text-3xl font-bold">2. User Conduct</h2>
					<p className="text-lg text-muted-foreground leading-relaxed">
						You agree to use Plaude Poll only for lawful purposes. You are
						prohibited from using the service to harass others, distribute spam,
						or attempt to manipulate voting results through automated means.
					</p>
				</section>
				<section className="space-y-4">
					<h2 className="text-3xl font-bold">3. Account Responsibility</h2>
					<p className="text-lg text-muted-foreground leading-relaxed">
						Since signup is required to vote, you are responsible for
						maintaining the security of your account and for all activities that
						occur under your credentials.
					</p>
				</section>
			</div>
		</div>
	);
}
