import { OrgForm } from "./org-form";

export const revalidate = 0;

export default function SettingsOrganizationPage() {
  return (
    <div className="space-y-6">
      <OrgForm />
    </div>
  );
}
