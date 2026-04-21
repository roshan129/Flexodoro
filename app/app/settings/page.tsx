import { SettingsPanel } from "@/features/settings/components/settings-panel";

export default function SettingsWorkspacePage() {
  return (
    <section id="settings" className="space-y-4">
      <div className="surface-card p-6 sm:p-8">
        <p className="text-xs font-semibold tracking-[0.15em] text-primary uppercase">Workspace</p>
        <h1 className="brand-display mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Preferences</h1>
        <p className="mt-2 text-sm text-muted">Theme, default mode, and timing ratios.</p>
      </div>

      <SettingsPanel />
    </section>
  );
}
