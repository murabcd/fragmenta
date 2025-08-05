const stats = [
	{ id: 1, name: "Forms created", value: "10,000+" },
	{ id: 2, name: "Responses collected", value: "1M+" },
	{ id: 3, name: "Uptime guarantee", value: "99.9%" },
	{ id: 4, name: "Active users", value: "5,000+" },
];

export const StatsSection = () => {
	return (
		<div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-56 lg:px-8">
			<div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl">
				<h2 className="text-base/8 font-semibold text-primary">
					Our track record
				</h2>
				<p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-foreground sm:text-5xl">
					Trusted by thousands of marketers&nbsp;worldwide
				</p>
				<p className="mt-6 text-lg/8 text-muted-foreground">
					Join the growing community of marketers, and product teams who trust
					Fragmenta for their data collection needs.
				</p>
			</div>
			<dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-10 text-foreground sm:mt-20 sm:grid-cols-2 sm:gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-4">
				{stats.map((stat) => (
					<div
						key={stat.id}
						className="flex flex-col gap-y-3 border-l border-border pl-6"
					>
						<dt className="text-sm/6">{stat.name}</dt>
						<dd className="order-first text-3xl font-semibold tracking-tight">
							{stat.value}
						</dd>
					</div>
				))}
			</dl>
		</div>
	);
};
