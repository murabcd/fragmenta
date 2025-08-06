import { WorkspaceForm } from "@/components/settings/workspace-form";

export const revalidate = 0;

export default function SettingsWorkspacePage() {
	return (
		<div className="space-y-6">
			<WorkspaceForm />
		</div>
	);
}
