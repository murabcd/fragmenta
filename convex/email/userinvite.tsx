import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Html,
	Link,
	Hr,
	Preview,
	Section,
	Text,
	Tailwind,
} from "@react-email/components";

interface InviteEmailProps {
	email: string;
	role: "admin" | "member";
	inviteLink: string;
	name: string;
}

export function InviteEmail({
	email,
	role,
	name,
	inviteLink,
}: InviteEmailProps) {
	const previewText = `You've been invited to join ${name}`;

	return (
		<Html>
			<Head />
			<Preview>{previewText}</Preview>
			<Tailwind>
				<Body className="bg-white my-auto mx-auto font-sans px-2">
					<Container className="border border-solid border-gray-300 rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
						<Heading className="text-black text-2xl font-normal text-center p-0 my-[30px] mx-0">
							You're invited to join
						</Heading>
						<Text className="text-black text-sm leading-6">
							Hello <strong>{email}</strong>,
						</Text>
						<Text className="text-black text-sm leading-6">
							You've been invited to join <strong>{name}</strong> organization
							as <strong>{role}</strong>. Click the button below to get started.
						</Text>
						<Section className="text-center mt-8 mb-8">
							<Button
								className="bg-black rounded text-white text-xs font-semibold no-underline text-center px-5 py-3"
								href={inviteLink}
							>
								Join the organization
							</Button>
						</Section>
						<Text className="text-black text-sm leading-6">
							or copy and paste this URL into your browser:{" "}
							<Link href={inviteLink} className="text-blue-600 no-underline">
								{inviteLink}
							</Link>
						</Text>
						<Hr className="border border-solid border-gray-200 my-[26px] mx-0 w-full" />
						<Text className="text-gray-500 text-xs leading-6">
							If you did not expect this invitation, please ignore this email.
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}
