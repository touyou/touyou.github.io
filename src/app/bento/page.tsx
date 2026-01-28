import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Bento | touyou.dev",
  description: "Yosuke Fujii - Design Engineer at Goodpatch Inc.",
};

// SNS Link icons as simple SVG components
const XIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
  </svg>
);

const ThreadsIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.182.408-2.256 1.333-3.022.812-.672 1.927-1.073 3.222-1.16 1.168-.079 2.237.058 3.179.395.034-.715-.009-1.39-.129-2.012-.234-1.213-.822-2.071-1.706-2.484-.968-.451-2.25-.485-3.71-.098l-.543-1.923c1.043-.277 2.011-.403 2.905-.393 1.297.014 2.439.283 3.4.802 1.204.648 2.053 1.686 2.454 3.003.263.864.384 1.867.359 2.975l.037.042c1.069.636 1.885 1.497 2.374 2.62.749 1.715.784 4.416-1.347 6.503-1.79 1.753-4.053 2.553-7.147 2.579zM11.96 14.51c-.924.063-1.645.31-2.145.735-.514.436-.774 1.027-.73 1.67.039.584.354 1.088.886 1.42.591.368 1.358.513 2.164.465 1.082-.065 1.94-.459 2.551-1.172.465-.543.784-1.29.946-2.183-.753-.243-1.601-.359-2.525-.355a9.2 9.2 0 0 0-1.147.07z" />
  </svg>
);

const BlueskyIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z" />
  </svg>
);

const FedibirdIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M23.268 5.313c-.35-2.578-2.617-4.61-5.304-5.004C17.51.242 15.792 0 11.813 0h-.03c-3.98 0-4.835.242-5.288.309C3.882.692 1.496 2.518.917 5.127.64 6.412.61 7.837.661 9.143c.074 1.874.088 3.745.26 5.611.118 1.24.325 2.47.62 3.68.55 2.237 2.777 4.098 4.96 4.857 2.336.792 4.849.923 7.256.38.265-.061.527-.132.786-.213.585-.184 1.27-.39 1.774-.753a.057.057 0 0 0 .023-.043v-1.809a.052.052 0 0 0-.02-.041.053.053 0 0 0-.046-.01 20.282 20.282 0 0 1-4.709.545c-2.73 0-3.463-1.284-3.674-1.818a5.593 5.593 0 0 1-.319-1.433.053.053 0 0 1 .066-.054c1.517.363 3.072.546 4.632.546.376 0 .75 0 1.125-.01 1.57-.044 3.224-.124 4.768-.422.038-.008.077-.015.11-.024 2.435-.464 4.753-1.92 4.989-5.604.008-.145.03-1.52.03-1.67.002-.512.167-3.63-.024-5.545zm-3.748 9.195h-2.561V8.29c0-1.309-.55-1.976-1.67-1.976-1.23 0-1.846.79-1.846 2.35v3.403h-2.546V8.663c0-1.56-.617-2.35-1.848-2.35-1.112 0-1.668.668-1.668 1.977v6.218H4.822V8.102c0-1.31.337-2.35 1.011-3.12.696-.77 1.608-1.164 2.74-1.164 1.311 0 2.302.5 2.962 1.498l.638 1.06.638-1.06c.66-.999 1.65-1.498 2.96-1.498 1.13 0 2.043.395 2.74 1.164.675.77 1.012 1.81 1.012 3.12z" />
  </svg>
);

const ZennIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M.264 23.771h4.984c.264 0 .498-.147.645-.352L19.614.874c.176-.293-.029-.645-.381-.645h-4.72c-.235 0-.44.117-.557.323L.03 23.361c-.088.176.029.41.234.41zM17.445 23.419l6.479-10.408c.205-.323-.029-.733-.41-.733h-4.691c-.176 0-.352.088-.44.235l-6.655 10.643c-.176.264.029.616.352.616h4.779c.234-.001.468-.118.586-.353z" />
  </svg>
);

const QiitaIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.178 12.836a4.814 4.814 0 0 1-3.297 1.267 4.814 4.814 0 0 1-3.297-1.267 4.595 4.595 0 0 1-1.365-3.297c0-1.277.499-2.489 1.365-3.387a4.814 4.814 0 0 1 3.297-1.365c1.277 0 2.489.499 3.297 1.365a4.814 4.814 0 0 1 1.365 3.387c0 1.277-.499 2.489-1.365 3.297zm4.178 6.844l-2.489-2.489a7.206 7.206 0 0 1-1.957 1.178l2.489 2.489a1.086 1.086 0 0 0 1.535 0 1.086 1.086 0 0 0 .422-.768c0-.275-.116-.55-.391-.775z" />
  </svg>
);

const SpeakerDeckIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M10.025 13.875H4.687a4.688 4.688 0 0 1 0-9.375h6.227a.46.46 0 0 1 .46.46v8.455a.46.46 0 0 1-.46.46h-.889zm3.95 0h5.338a4.688 4.688 0 0 0 0-9.375h-6.227a.46.46 0 0 0-.46.46v8.455c0 .254.206.46.46.46h.889zM10.914 19.5H4.687a4.687 4.687 0 0 1-3.316-8.003.46.46 0 0 1 .326-.135h8.328a.46.46 0 0 1 .46.46v7.218a.46.46 0 0 1-.46.46h.889zm2.172 0h6.227a4.687 4.687 0 0 0 3.316-8.003.46.46 0 0 0-.326-.135h-8.328a.46.46 0 0 0-.46.46v7.218c0 .254.206.46.46.46h-.889z" />
  </svg>
);

const WantedlyIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M18.453 14.555c-.171-.111-.32-.256-.438-.428L15.63 9.538l-2.386 4.59c-.118.172-.267.316-.438.427a1.205 1.205 0 0 1-.642.178h-2.16c-.235 0-.46-.063-.642-.178-.171-.111-.32-.256-.438-.428L4.72 4.478h3.93l2.386 5.696 2.385-5.696h3.93l2.386 5.696 2.385-5.696h3.93l-4.204 9.65c-.118.171-.267.316-.438.427a1.205 1.205 0 0 1-.642.178h-2.16c-.235 0-.46-.063-.642-.178z" />
  </svg>
);

const GoogleDevIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M12 0C5.372 0 0 5.373 0 12s5.372 12 12 12c6.627 0 12-5.373 12-12S18.627 0 12 0zm-.001 4.8a7.2 7.2 0 1 1 0 14.4 7.2 7.2 0 0 1 0-14.4z" />
  </svg>
);

const GitLabIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="m23.6 9.593-.033-.086L20.3.98a.851.851 0 0 0-.336-.405.875.875 0 0 0-.994.056.857.857 0 0 0-.29.44l-2.204 6.748H7.524L5.32 1.07a.857.857 0 0 0-.29-.44.875.875 0 0 0-.994-.055.851.851 0 0 0-.336.405L.433 9.502l-.032.086a6.066 6.066 0 0 0 2.012 7.01l.01.008.028.02 4.984 3.73 2.466 1.866 1.502 1.135a1.014 1.014 0 0 0 1.226 0l1.502-1.135 2.466-1.866 5.012-3.75.013-.01a6.066 6.066 0 0 0 2.009-7.003z" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

// Section Header Component
const SectionHeader = ({ icon, title }: { icon: string; title: string }) => (
  <div className="col-span-2 md:col-span-4 flex items-center gap-2 mt-4 first:mt-0">
    <span className="text-xl">{icon}</span>
    <h2 className="text-white font-semibold text-lg">{title}</h2>
  </div>
);

// Social Link Card Component
const SocialLinkCard = ({
  href,
  icon,
  label,
  username,
  hoverColor = "hover:text-white",
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  username?: string;
  hoverColor?: string;
}) => (
  <Card className="bg-zinc-900/80 border-zinc-800 hover:bg-zinc-800/80 hover:border-zinc-700 transition-all group">
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`h-full w-full flex flex-col items-center justify-center gap-1.5 text-zinc-400 ${hoverColor} transition p-3`}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
      {username && <span className="text-[10px] text-zinc-500">{username}</span>}
    </a>
  </Card>
);

// Link Card Component for portfolio/work links
const LinkCard = ({
  href,
  title,
  subtitle,
  large = false,
}: {
  href: string;
  title: string;
  subtitle?: string;
  large?: boolean;
}) => (
  <Card className={`bg-zinc-900/80 border-zinc-800 hover:bg-zinc-800/80 hover:border-zinc-700 transition-all group ${large ? "col-span-2" : ""}`}>
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="h-full w-full flex items-center justify-between p-4"
    >
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-medium truncate group-hover:text-blue-400 transition">{title}</h3>
        {subtitle && <p className="text-zinc-500 text-xs truncate mt-0.5">{subtitle}</p>}
      </div>
      <ExternalLinkIcon />
    </a>
  </Card>
);

export default function BentoPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Back to home */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition mb-8"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Home
        </Link>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[100px]">

          {/* Profile Card */}
          <Card className="col-span-2 row-span-2 bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-zinc-800 overflow-hidden">
            <CardContent className="p-6 h-full flex flex-col items-center justify-center gap-4">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden ring-4 ring-blue-500/30">
                <Image
                  src="/avatar.jpg"
                  alt="Yosuke Fujii"
                  width={112}
                  height={112}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center">
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Yosuke Fujii
                </h1>
                <p className="text-zinc-400 text-sm mt-1">
                  touyou / 藤井陽介
                </p>
                <p className="text-blue-400 text-xs md:text-sm mt-2">
                  Design Engineer at Goodpatch Inc. 💙
                </p>
                <p className="text-zinc-500 text-xs mt-1">
                  オンライン劇場ZA UXエンジニア 🎭
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Main Links */}
          <LinkCard href="https://touyou.dev" title="touyou.dev" subtitle="Portfolio" />
          <LinkCard href="https://www.wantedly.com/id/touyoubuntu" title="Wantedly" subtitle="Profile" />

          {/* Section: SNS */}
          <SectionHeader icon="🔗" title="SNS" />

          {/* Twitter accounts */}
          <SocialLinkCard
            href="https://x.com/touyou_dev"
            icon={<XIcon />}
            label="X (dev)"
            username="@touyou_dev"
            hoverColor="hover:text-white"
          />
          <SocialLinkCard
            href="https://x.com/touyoubuntu"
            icon={<XIcon />}
            label="X (private)"
            username="@touyoubuntu"
            hoverColor="hover:text-white"
          />
          <SocialLinkCard
            href="https://x.com/touyou_game"
            icon={<XIcon />}
            label="X (game)"
            username="@touyou_game"
            hoverColor="hover:text-white"
          />
          <SocialLinkCard
            href="https://github.com/touyou"
            icon={<GitHubIcon />}
            label="GitHub"
            username="@touyou"
            hoverColor="hover:text-white"
          />
          <SocialLinkCard
            href="https://www.youtube.com/@touyoubuntu"
            icon={<YouTubeIcon />}
            label="YouTube"
            username="@touyoubuntu"
            hoverColor="hover:text-red-500"
          />
          <SocialLinkCard
            href="https://www.linkedin.com/in/touyou"
            icon={<LinkedInIcon />}
            label="LinkedIn"
            username="touyou"
            hoverColor="hover:text-blue-500"
          />
          <SocialLinkCard
            href="https://www.instagram.com/touyou_work"
            icon={<InstagramIcon />}
            label="Instagram (work)"
            username="@touyou_work"
            hoverColor="hover:text-pink-500"
          />
          <SocialLinkCard
            href="https://www.instagram.com/touyou1121"
            icon={<InstagramIcon />}
            label="Instagram"
            username="@touyou1121"
            hoverColor="hover:text-pink-500"
          />
          <SocialLinkCard
            href="https://www.threads.net/@touyou1121"
            icon={<ThreadsIcon />}
            label="Threads"
            username="@touyou1121"
            hoverColor="hover:text-white"
          />
          <SocialLinkCard
            href="https://bsky.app/profile/touyou.bsky.social"
            icon={<BlueskyIcon />}
            label="Bluesky"
            username="@touyou.bsky.social"
            hoverColor="hover:text-blue-400"
          />
          <SocialLinkCard
            href="https://fedibird.com/@touyou"
            icon={<FedibirdIcon />}
            label="Fedibird"
            username="@touyou"
            hoverColor="hover:text-purple-500"
          />

          {/* Section: Tech Profile */}
          <SectionHeader icon="💻" title="Tech Profile" />

          <SocialLinkCard
            href="https://zenn.dev/touyou"
            icon={<ZennIcon />}
            label="Zenn"
            hoverColor="hover:text-[#3EA8FF]"
          />
          <SocialLinkCard
            href="https://qiita.com/touyou"
            icon={<QiitaIcon />}
            label="Qiita"
            hoverColor="hover:text-[#55C500]"
          />
          <SocialLinkCard
            href="https://speakerdeck.com/touyou"
            icon={<SpeakerDeckIcon />}
            label="SpeakerDeck"
            hoverColor="hover:text-[#009287]"
          />
          <SocialLinkCard
            href="https://gitlab.com/touyou"
            icon={<GitLabIcon />}
            label="GitLab"
            hoverColor="hover:text-orange-500"
          />
          <LinkCard href="https://developers.google.com/profile/u/touyou" title="Google Developers" subtitle="Profile" />

          {/* Section: Works */}
          <SectionHeader icon="🎨" title="Works" />

          <LinkCard href="https://goodpatch.com/work/suntory" title="SUNTORY＋" subtitle="Goodpatch" large />
          <LinkCard href="https://goodpatch.com/work/clinics" title="CLINICS" subtitle="Goodpatch" large />
          <LinkCard href="https://za.theater/" title="オンライン劇場 ZA" subtitle="UX Engineer" large />

          {/* Section: Articles */}
          <SectionHeader icon="📝" title="Articles (Goodpatch Tech Blog)" />

          <LinkCard
            href="https://goodpatch-tech.hatenablog.com/entry/2020/12/10/080000"
            title="新卒1年目が学んだエンジニアのコミュニケーション術"
            large
          />
          <LinkCard
            href="https://goodpatch-tech.hatenablog.com/entry/2021/12/07/080000"
            title="SwiftUIのObservableObjectをReact Hooksとして見る"
            large
          />
          <LinkCard
            href="https://goodpatch-tech.hatenablog.com/entry/2022/12/01/080000"
            title="エンジニアのためのデザイン4大原則"
            large
          />
          <LinkCard
            href="https://goodpatch-tech.hatenablog.com/entry/2023/12/14/080000"
            title="ChatGPTに書かせた技術記事に赤入れしてみた"
            large
          />
          <LinkCard
            href="https://goodpatch-tech.hatenablog.com/entry/2024/12/12/080000"
            title="iOS 17 天気アプリの雨粒演出を作ってみた"
            large
          />
          <LinkCard
            href="https://goodpatch-tech.hatenablog.com/entry/2025/02/27/083000"
            title="大生成AI時代に学ぶAIのしくみ基礎の基礎"
            large
          />

          {/* Section: Talks */}
          <SectionHeader icon="🎤" title="Talks" />

          <LinkCard
            href="https://speakerdeck.com/touyou/aws-dev-day-online-japan"
            title="AWS Dev Day Online Japan C-5"
            subtitle="登壇資料"
            large
          />

        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-zinc-500 text-sm">
          <p>Copyrights © 2015- touyou. All Rights Reserved.</p>
        </footer>
      </div>
    </main>
  );
}
