import {
  Bot,
  Chrome,
  DatabaseZap,
  Github,
  Globe2,
  KeyRound,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const gridCells = Array.from({ length: 16 }, (_, index) => `cell-${index}`);

function CardShell({
  children,
  className = "",
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-[#080c14] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-colors hover:border-white/20 ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.08),transparent_34%),linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[length:100%_100%,28px_28px,28px_28px] opacity-70" />
      <div className="relative z-10 flex h-full flex-col">{children}</div>
    </article>
  );
}

function CardCopy({
  title,
  body,
}: Readonly<{
  title: string;
  body: string;
}>) {
  return (
    <div className="mt-auto">
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <p className="mt-3 text-[15px] leading-7 text-zinc-400">{body}</p>
    </div>
  );
}

function FloatingDocuments() {
  return (
    <div className="relative mb-10 h-40">
      <div className="absolute left-3 top-10 h-20 w-16 rounded-xl bg-slate-600/70 shadow-2xl shadow-blue-500/10 before:absolute before:right-0 before:top-0 before:size-5 before:rounded-bl-xl before:bg-slate-400/50">
        <div className="mt-8 space-y-2 px-3">
          <div className="h-1.5 w-8 rounded-full bg-white/45" />
          <div className="h-1.5 w-10 rounded-full bg-white/35" />
          <div className="h-1.5 w-7 rounded-full bg-white/30" />
        </div>
        <span className="absolute -bottom-2 -right-2 flex size-5 items-center justify-center rounded-full bg-red-500 text-[11px] text-white">
          x
        </span>
      </div>
      <div className="absolute left-24 top-10 h-20 w-16 rounded-xl bg-slate-600/75 before:absolute before:right-0 before:top-0 before:size-5 before:rounded-bl-xl before:bg-slate-400/50">
        <div className="mt-8 space-y-2 px-3">
          <div className="h-1.5 w-8 rounded-full bg-white/45" />
          <div className="h-1.5 w-10 rounded-full bg-white/35" />
          <div className="h-1.5 w-7 rounded-full bg-white/30" />
        </div>
        <span className="absolute -bottom-2 -right-2 flex size-5 items-center justify-center rounded-full bg-red-500 text-[11px] text-white">
          x
        </span>
      </div>
      <div className="absolute left-44 top-10 h-20 w-16 rounded-xl bg-indigo-500/45 shadow-[0_0_55px_rgba(99,102,241,0.34)] before:absolute before:right-0 before:top-0 before:size-5 before:rounded-bl-xl before:bg-indigo-200/50">
        <div className="mt-8 space-y-2 px-3">
          <div className="h-1.5 w-8 rounded-full bg-white/55" />
          <div className="h-1.5 w-10 rounded-full bg-white/45" />
          <div className="h-1.5 w-7 rounded-full bg-white/35" />
        </div>
        <span className="absolute -bottom-2 -right-2 flex size-5 items-center justify-center rounded-full bg-blue-500 text-[11px] text-white">
          ✓
        </span>
      </div>
    </div>
  );
}

function ZeroVault() {
  return (
    <div className="mb-11 flex h-40 items-center justify-center">
      <div className="relative text-[140px] font-black leading-none text-white/[0.10] drop-shadow-[0_0_24px_rgba(59,130,246,0.16)]">
        0
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(59,130,246,0.22)_1px,transparent_1px)] bg-[length:8px_8px] opacity-40" />
      </div>
    </div>
  );
}

function VaultTiles() {
  return (
    <div className="mb-12 grid h-40 grid-cols-3 gap-2">
      {[0, 1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className={`rounded-xl border border-white/5 bg-gradient-to-br from-zinc-700/55 to-zinc-900/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] ${
            item > 2 ? "col-span-1.5" : ""
          }`}
        />
      ))}
    </div>
  );
}

function PreviewCard() {
  return (
    <div className="relative mb-10 flex h-36 items-center justify-center">
      <div className="absolute right-12 top-16 h-20 w-28 rounded-xl bg-zinc-700/30 blur-sm" />
      <div className="relative rounded-xl border border-white/10 bg-zinc-800 p-3 shadow-2xl shadow-cyan-500/10">
        <div className="mb-2 h-16 w-28 rounded-lg bg-gradient-to-br from-zinc-600 via-zinc-800 to-zinc-900" />
        <div className="flex items-center justify-between font-mono text-[10px] text-zinc-500">
          <span>metadata</span>
          <span>PNG</span>
        </div>
      </div>
    </div>
  );
}

function LogoRail({ icons }: Readonly<{ icons: { Icon: IconComponent; label: string }[] }>) {
  return (
    <div className="mt-auto flex items-center gap-5 text-zinc-500">
      {icons.map(({ Icon, label }) => (
        <Icon key={label} className="size-6" />
      ))}
    </div>
  );
}

function FileTree() {
  return (
    <div className="mt-auto h-48 overflow-hidden">
      <div className="ml-9 mt-10 w-64 rotate-[-9deg] rounded-xl border border-white/10 bg-zinc-800/80 p-4 font-mono text-xs text-zinc-400 shadow-2xl shadow-indigo-500/10">
        <div className="mb-2 text-zinc-300">⌄ vaults</div>
        <div className="ml-4 space-y-2">
          <div>├ product-research</div>
          <div>├ design-systems</div>
          <div>├ discord-toolkit</div>
          <div className="text-zinc-600">└ private-notes</div>
        </div>
      </div>
    </div>
  );
}

function TemplateGrid() {
  return (
    <div className="mt-auto h-44 overflow-hidden">
      <div className="grid h-full grid-cols-4 grid-rows-4 border-l border-t border-white/5">
        {gridCells.map((cell) => (
          <div key={cell} className="border-r border-b border-white/5" />
        ))}
      </div>
      <div className="-mt-36 ml-3 w-36 rounded-lg border border-white/10 bg-zinc-800 px-3 py-3 font-mono text-xs text-zinc-300 shadow-xl">
        &lt;VaultCard&gt;
      </div>
    </div>
  );
}

export function LandingFeatures() {
  return (
    <section className="relative w-full px-6 py-20 text-left md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-3xl">
          <p className="mb-3 text-sm font-medium text-emerald-300">Feature set</p>
          <h2 className="text-3xl font-semibold tracking-normal text-white md:text-5xl">
            A vault should feel organized before anyone clicks.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
          <CardShell className="min-h-[380px] md:col-span-2">
            <FloatingDocuments />
            <CardCopy
              title="Content collections"
              body="Turn scattered links into named vaults with categories, previews, and enough structure for people to trust."
            />
          </CardShell>

          <CardShell className="min-h-[380px] md:col-span-2">
            <ZeroVault />
            <CardCopy
              title="Zero clutter by default"
              body="Devault keeps the page calm: save the resource, fetch the useful metadata, and leave the noisy browser tab behind."
            />
          </CardShell>

          <CardShell className="min-h-[380px] md:col-span-2">
            <VaultTiles />
            <CardCopy
              title="Vault views"
              body="Browse public spaces, private rooms, and shared collections with layouts made for scanning."
            />
          </CardShell>

          <CardShell className="min-h-[204px] md:col-span-4">
            <div className="grid h-full gap-6 md:grid-cols-[1fr_1.1fr] md:items-center">
              <CardCopy
                title="Optimized previews"
                body="Titles, descriptions, and images are pulled from URLs so every bookmark has context before opening."
              />
              <PreviewCard />
            </div>
          </CardShell>

          <CardShell className="min-h-[204px] md:col-span-2">
            <CardCopy
              title="UI integrations"
              body="Built around the places communities already gather, starting with Discord access gates."
            />
            <LogoRail
              icons={[
                { Icon: MessageCircle, label: "discord" },
                { Icon: Users, label: "members" },
                { Icon: KeyRound, label: "password" },
                { Icon: ShieldCheck, label: "verified" },
                { Icon: Github, label: "github" },
              ]}
            />
          </CardShell>

          <CardShell className="min-h-[370px] md:col-span-2 md:row-span-2">
            <CardCopy
              title="Space-based routing"
              body="Each vault gets its own shareable home, so members understand where they are and what belongs there."
            />
            <FileTree />
          </CardShell>

          <CardShell className="min-h-[158px] md:col-span-2">
            <CardCopy
              title="Access controls"
              body="Choose public, password protected, or Discord-gated access per vault."
            />
          </CardShell>

          <CardShell className="min-h-[158px] md:col-span-2">
            <CardCopy
              title="Actions"
              body="Create vaults, add categories, capture bookmarks, and share the finished room."
            />
          </CardShell>

          <CardShell className="min-h-[197px] md:col-span-2">
            <CardCopy
              title="Deployment adapters"
              body="Open source, Next.js based, and ready to self-host when you want full control."
            />
            <LogoRail
              icons={[
                { Icon: Github, label: "github" },
                { Icon: DatabaseZap, label: "database" },
                { Icon: Globe2, label: "web" },
                { Icon: Chrome, label: "browser" },
              ]}
            />
          </CardShell>

          <CardShell className="min-h-[386px] md:col-span-2 md:row-span-2">
            <CardCopy
              title="Simple templating"
              body="Small, repeatable cards make collections feel consistent without needing a heavy wiki."
            />
            <TemplateGrid />
          </CardShell>

          <CardShell className="min-h-[173px] md:col-span-2">
            <CardCopy
              title="Instant page loads"
              body="A focused landing and dashboard experience keeps the important links close to hand."
            />
          </CardShell>

          <CardShell className="min-h-[173px] md:col-span-2">
            <CardCopy
              title="AI-ready"
              body="The roadmap points toward summaries and auto-categorization for fast-growing resource libraries."
            />
            <div className="mt-5 flex gap-3 text-zinc-500">
              <Bot className="size-6" />
              <Sparkles className="size-6" />
            </div>
          </CardShell>
        </div>
      </div>
    </section>
  );
}
