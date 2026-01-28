import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import bentoData from "@/data/bento-links.json";
import { fetchMultipleOGP } from "@/lib/ogp";
import type { BentoData, BentoLink, OGPData, SocialPlatform } from "@/lib/bento-types";

export const metadata: Metadata = {
  title: "Bento | touyou.dev",
  description: "Yosuke Fujii - Design Engineer at Goodpatch Inc.",
};

// SVG Icons
const TwitterIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`${className} fill-current`}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const GitHubIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`${className} fill-current`}>
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const YouTubeIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`${className} fill-current`}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const LinkedInIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`${className} fill-current`}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const InstagramIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`${className} fill-current`}>
    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
  </svg>
);

const FacebookIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`${className} fill-current`}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const ThreadsIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`${className} fill-current`}>
    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.182.408-2.256 1.333-3.022.812-.672 1.927-1.073 3.222-1.16 1.168-.079 2.237.058 3.179.395.034-.715-.009-1.39-.129-2.012-.234-1.213-.822-2.071-1.706-2.484-.968-.451-2.25-.485-3.71-.098l-.543-1.923c1.043-.277 2.011-.403 2.905-.393 1.297.014 2.439.283 3.4.802 1.204.648 2.053 1.686 2.454 3.003.263.864.384 1.867.359 2.975l.037.042c1.069.636 1.885 1.497 2.374 2.62.749 1.715.784 4.416-1.347 6.503-1.79 1.753-4.053 2.553-7.147 2.579zM11.96 14.51c-.924.063-1.645.31-2.145.735-.514.436-.774 1.027-.73 1.67.039.584.354 1.088.886 1.42.591.368 1.358.513 2.164.465 1.082-.065 1.94-.459 2.551-1.172.465-.543.784-1.29.946-2.183-.753-.243-1.601-.359-2.525-.355a9.2 9.2 0 0 0-1.147.07z" />
  </svg>
);

const BlueskyIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`${className} fill-current`}>
    <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z" />
  </svg>
);

const FedibirdIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`${className} fill-current`}>
    <path d="M23.268 5.313c-.35-2.578-2.617-4.61-5.304-5.004C17.51.242 15.792 0 11.813 0h-.03c-3.98 0-4.835.242-5.288.309C3.882.692 1.496 2.518.917 5.127.64 6.412.61 7.837.661 9.143c.074 1.874.088 3.745.26 5.611.118 1.24.325 2.47.62 3.68.55 2.237 2.777 4.098 4.96 4.857 2.336.792 4.849.923 7.256.38.265-.061.527-.132.786-.213.585-.184 1.27-.39 1.774-.753a.057.057 0 0 0 .023-.043v-1.809a.052.052 0 0 0-.02-.041.053.053 0 0 0-.046-.01 20.282 20.282 0 0 1-4.709.545c-2.73 0-3.463-1.284-3.674-1.818a5.593 5.593 0 0 1-.319-1.433.053.053 0 0 1 .066-.054c1.517.363 3.072.546 4.632.546.376 0 .75 0 1.125-.01 1.57-.044 3.224-.124 4.768-.422.038-.008.077-.015.11-.024 2.435-.464 4.753-1.92 4.989-5.604.008-.145.03-1.52.03-1.67.002-.512.167-3.63-.024-5.545zm-3.748 9.195h-2.561V8.29c0-1.309-.55-1.976-1.67-1.976-1.23 0-1.846.79-1.846 2.35v3.403h-2.546V8.663c0-1.56-.617-2.35-1.848-2.35-1.112 0-1.668.668-1.668 1.977v6.218H4.822V8.102c0-1.31.337-2.35 1.011-3.12.696-.77 1.608-1.164 2.74-1.164 1.311 0 2.302.5 2.962 1.498l.638 1.06.638-1.06c.66-.999 1.65-1.498 2.96-1.498 1.13 0 2.043.395 2.74 1.164.675.77 1.012 1.81 1.012 3.12z" />
  </svg>
);

const ZennIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`${className} fill-current`}>
    <path d="M.264 23.771h4.984c.264 0 .498-.147.645-.352L19.614.874c.176-.293-.029-.645-.381-.645h-4.72c-.235 0-.44.117-.557.323L.03 23.361c-.088.176.029.41.234.41zM17.445 23.419l6.479-10.408c.205-.323-.029-.733-.41-.733h-4.691c-.176 0-.352.088-.44.235l-6.655 10.643c-.176.264.029.616.352.616h4.779c.234-.001.468-.118.586-.353z" />
  </svg>
);

const QiitaIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`${className} fill-current`}>
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.178 12.836a4.814 4.814 0 0 1-3.297 1.267 4.814 4.814 0 0 1-3.297-1.267 4.595 4.595 0 0 1-1.365-3.297c0-1.277.499-2.489 1.365-3.387a4.814 4.814 0 0 1 3.297-1.365c1.277 0 2.489.499 3.297 1.365a4.814 4.814 0 0 1 1.365 3.387c0 1.277-.499 2.489-1.365 3.297zm4.178 6.844l-2.489-2.489a7.206 7.206 0 0 1-1.957 1.178l2.489 2.489a1.086 1.086 0 0 0 1.535 0 1.086 1.086 0 0 0 .422-.768c0-.275-.116-.55-.391-.775z" />
  </svg>
);

const WantedlyIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`${className} fill-current`}>
    <path d="M18.453 14.555c-.171-.111-.251-.311-.331-.48-.48-1.072-1.012-2.405-1.513-3.617-.611-1.483-1.112-2.825-1.503-3.828a.545.545 0 0 0-.501-.341h-1.644a.545.545 0 0 0-.501.341c-.351.912-.812 2.104-1.333 3.437-.521-1.333-.982-2.525-1.333-3.437a.545.545 0 0 0-.501-.341H7.649a.545.545 0 0 0-.501.341c-.391 1.003-.892 2.345-1.503 3.828-.501 1.212-1.033 2.545-1.513 3.617-.08.169-.16.369-.331.48-.14.089-.32.079-.5.079H2.18a.545.545 0 0 0-.54.62l.28 1.593a.545.545 0 0 0 .54.47h1.443c.572 0 1.023-.341 1.273-.872.481-1.032.952-2.224 1.423-3.437.471 1.213.942 2.405 1.423 3.437.25.531.701.872 1.273.872h.802c.572 0 1.023-.341 1.273-.872.481-1.032.952-2.224 1.423-3.437.471 1.213.942 2.405 1.423 3.437.25.531.701.872 1.273.872h.802c.572 0 1.023-.341 1.273-.872.481-1.032.952-2.224 1.423-3.437.471 1.213.942 2.405 1.423 3.437.25.531.701.872 1.273.872h1.443a.545.545 0 0 0 .54-.47l.28-1.593a.545.545 0 0 0-.54-.62h-1.122c-.18 0-.36.01-.5-.079z" />
  </svg>
);

const GitLabIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`${className} fill-current`}>
    <path d="m23.6 9.593-.033-.086L20.3.98a.851.851 0 0 0-.336-.405.865.865 0 0 0-.996.053.857.857 0 0 0-.29.44l-2.212 6.78H7.534L5.322 1.068a.857.857 0 0 0-.29-.44.865.865 0 0 0-.996-.053.854.854 0 0 0-.336.405L.433 9.502l-.032.086a6.066 6.066 0 0 0 2.012 7.01l.01.009.03.02 4.98 3.73 2.463 1.865 1.5 1.133a1.008 1.008 0 0 0 1.22 0l1.5-1.133 2.462-1.865 5.012-3.754.013-.01a6.072 6.072 0 0 0 2.007-7z" />
  </svg>
);

const GoogleIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`${className} fill-current`}>
    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
  </svg>
);

const HoYoLabIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`${className} fill-current`}>
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 21.6c-5.302 0-9.6-4.298-9.6-9.6S6.698 2.4 12 2.4s9.6 4.298 9.6 9.6-4.298 9.6-9.6 9.6zm0-16.8a7.2 7.2 0 1 0 0 14.4 7.2 7.2 0 0 0 0-14.4z" />
  </svg>
);

const LinkIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`${className}`} fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

// Platform icon mapping
const platformIcons: Record<SocialPlatform, React.ComponentType<{ className?: string }>> = {
  twitter: TwitterIcon,
  github: GitHubIcon,
  youtube: YouTubeIcon,
  linkedin: LinkedInIcon,
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  threads: ThreadsIcon,
  bluesky: BlueskyIcon,
  fedibird: FedibirdIcon,
  zenn: ZennIcon,
  qiita: QiitaIcon,
  speakerdeck: LinkIcon,
  gitlab: GitLabIcon,
  google: GoogleIcon,
  wantedly: WantedlyIcon,
  hoyolab: HoYoLabIcon,
  hatena: LinkIcon,
};

// Platform hover colors
const platformColors: Record<SocialPlatform, string> = {
  twitter: "hover:bg-black hover:text-white",
  github: "hover:bg-[#333] hover:text-white",
  youtube: "hover:bg-[#FF0000] hover:text-white",
  linkedin: "hover:bg-[#0A66C2] hover:text-white",
  instagram: "hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:text-white",
  facebook: "hover:bg-[#1877F2] hover:text-white",
  threads: "hover:bg-black hover:text-white",
  bluesky: "hover:bg-[#0085FF] hover:text-white",
  fedibird: "hover:bg-[#6364FF] hover:text-white",
  zenn: "hover:bg-[#3EA8FF] hover:text-white",
  qiita: "hover:bg-[#55C500] hover:text-white",
  speakerdeck: "hover:bg-[#009287] hover:text-white",
  gitlab: "hover:bg-[#FC6D26] hover:text-white",
  google: "hover:bg-[#4285F4] hover:text-white",
  wantedly: "hover:bg-[#21BDDB] hover:text-white",
  hoyolab: "hover:bg-[#1E90FF] hover:text-white",
  hatena: "hover:bg-[#00A4DE] hover:text-white",
};

// Base card styles
const cardBase = "bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300 overflow-hidden";

// Social Card Component
function SocialCard({ link }: { link: BentoLink }) {
  const platform = link.platform as SocialPlatform | undefined;
  const Icon = platform ? platformIcons[platform] : LinkIcon;
  const hoverColor = platform ? platformColors[platform] : "hover:bg-gray-100";

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noreferrer"
      className={`${cardBase} flex items-center gap-3 p-4 ${hoverColor}`}
    >
      <Icon className="w-6 h-6 flex-shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="font-medium text-gray-900 text-sm truncate">{link.title}</p>
        {link.username && (
          <p className="text-gray-500 text-xs truncate">{link.username}</p>
        )}
      </div>
    </a>
  );
}

// OGP Card Component - unified size, no URL display
function OGPCard({ link, ogpData }: { link: BentoLink; ogpData?: OGPData }) {
  const displayTitle = ogpData?.title || link.title;
  const imageUrl = ogpData?.image;

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noreferrer"
      className={`${cardBase} flex flex-col group col-span-2`}
    >
      {imageUrl && (
        <div className="relative w-full h-36 overflow-hidden bg-gray-100">
          <Image
            src={imageUrl}
            alt={displayTitle}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized
          />
        </div>
      )}
      <div className="p-4">
        <p className="font-medium text-gray-900 text-sm line-clamp-2">{displayTitle}</p>
      </div>
    </a>
  );
}

// Simple Link Card Component
function SimpleLinkCard({ link }: { link: BentoLink }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noreferrer"
      className={`${cardBase} flex items-center gap-3 p-4 hover:bg-gray-50`}
    >
      <LinkIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
      <p className="font-medium text-gray-900 text-sm truncate">{link.title}</p>
    </a>
  );
}

// Section Header Component
function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="col-span-2 md:col-span-4 text-gray-600 text-sm font-semibold mt-6 first:mt-0 px-1">
      {children}
    </h2>
  );
}

export default async function BentoPage() {
  const data = bentoData as BentoData;

  // Collect all OGP URLs
  const ogpUrls = data.sections
    .flatMap((section) => section.links)
    .filter((link) => link.cardType === "ogp")
    .map((link) => link.url);

  // Fetch all OGP data in parallel
  const ogpDataMap = await fetchMultipleOGP(ogpUrls);

  return (
    <main className="min-h-screen bg-[#f5f5f7]">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Back to home */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition mb-8"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        {/* Profile Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-28 h-28 rounded-full overflow-hidden shadow-lg mb-4 ring-4 ring-white">
            <Image
              src={data.profile.avatar}
              alt={data.profile.name}
              width={112}
              height={112}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{data.profile.name}</h1>
          <div className="text-gray-600 text-center mt-2 space-y-1">
            {data.profile.bio.map((line, i) => (
              <p key={i} className={line === "" ? "h-2" : ""}>{line}</p>
            ))}
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {data.sections.map((section) => (
            <div key={section.id} className="contents">
              {section.title && <SectionHeader>{section.title}</SectionHeader>}
              {section.links.map((link, index) => {
                if (link.cardType === "social") {
                  return <SocialCard key={index} link={link} />;
                }
                if (link.cardType === "ogp") {
                  const ogpData = ogpDataMap.get(link.url);
                  return <OGPCard key={index} link={link} ogpData={ogpData} />;
                }
                return <SimpleLinkCard key={index} link={link} />;
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-400 text-sm">
          <p>Copyrights © 2015- touyou. All Rights Reserved.</p>
        </footer>
      </div>
    </main>
  );
}
