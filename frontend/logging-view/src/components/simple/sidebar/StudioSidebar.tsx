// Right-hand studio panel. All session series are available by default
// (parsed lazily on first use), so the panel focuses on: building plots,
// composing derived series, and tuning the FFT.
import { Separator } from "@workspace/ui/components";
import { Activity, Layers, Timer } from "@workspace/ui/icons";
import type { LucideIcon } from "@workspace/ui/icons";
import { cn } from "@workspace/ui/lib";
import ComposedSection from "./ComposedSection";
import FFTSection from "./FFTSection";
import PlotsSection from "./PlotsSection";

function SectionHeader({ icon: Icon, title }: { icon: LucideIcon; title: string }) {
  return (
    <div className="from-primary/8 mb-4 flex items-center gap-2.5 rounded-md bg-gradient-to-r to-transparent px-1 py-1.5">
      <div className="bg-primary/15 flex size-6 shrink-0 items-center justify-center rounded">
        <Icon className="text-primary size-3.5" />
      </div>
      <span className="text-foreground text-[11px] font-semibold uppercase tracking-widest">
        {title}
      </span>
    </div>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="px-3 py-4">
      <SectionHeader icon={icon} title={title} />
      {children}
    </div>
  );
}

export default function StudioSidebar({ collapsed }: { collapsed: boolean }) {
  return (
    <aside
      className={cn(
        "bg-sidebar flex flex-col overflow-y-auto overflow-x-hidden border-l transition-all duration-300",
        collapsed ? "w-0 min-w-0" : "w-72 min-w-72",
      )}
    >
      <Section icon={Activity} title="Plots">
        <PlotsSection />
      </Section>

      <Separator />

      <Section icon={Layers} title="Composed Series">
        <ComposedSection />
      </Section>

      <Separator />

      <Section icon={Timer} title="FFT Settings">
        <FFTSection />
      </Section>
    </aside>
  );
}
