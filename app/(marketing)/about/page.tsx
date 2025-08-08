import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/icons";

export const metadata = {
	title: "About",
	description: "About Fragmenta",
};

export default function AboutPage() {
	return (
		<div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
			<div className="mx-auto max-w-2xl text-center">
				<h1 className="text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl">
					Your business deserves{" "}
					<span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60">
						superpower
					</span>
				</h1>
				<p className="mt-6 text-lg/8 text-pretty text-muted-foreground">
					Fragmenta turns digital interactions into lasting personal
					connections. We're building the future of form creation and data
					collection.
				</p>
			</div>

			<div className="mx-auto mt-16 max-w-2xl lg:max-w-4xl">
				<div className="grid gap-8 md:grid-cols-2">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Icons.fragmenta className="h-5 w-5" />
								Our Mission
							</CardTitle>
							<CardDescription>
								Empowering teams to collect meaningful data and gain actionable
								insights
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">
								We believe that every interaction with your audience is an
								opportunity to learn and grow. Fragmenta makes it easy to create
								beautiful forms that not only collect data but also provide
								insights that drive better decisions.
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Open Source</CardTitle>
							<CardDescription>
								Built with transparency and community in mind
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">
								Fragmenta is open source, meaning you can inspect, modify, and
								contribute to the codebase. We believe in building in public and
								fostering a community of developers and designers.
							</p>
						</CardContent>
					</Card>
				</div>

				<div className="mt-16 text-center">
					<h2 className="text-2xl font-semibold mb-6">Get in touch</h2>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button asChild>
							<Link href="mailto:murad@fragmenta.ai">Talk to us</Link>
						</Button>
						<Button variant="outline" asChild>
							<Link href="https://github.com/murabcd/fragmenta" target="_blank">
								<Icons.github className="mr-2 h-4 w-4" />
								View on GitHub
							</Link>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
