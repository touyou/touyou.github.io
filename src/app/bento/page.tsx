import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Bento | touyou.dev",
  description: "Yosuke Fujii - Design Engineer at Goodpatch Inc.",
};

// SVG Icons
const XIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
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

// Base card styles (bento.me style)
const cardBase = "bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300 overflow-hidden";

// Social Card with Icon
const SocialCard = ({
  href,
  icon: Icon,
  title,
  username,
  buttonText,
  buttonColor = "bg-gray-100 text-gray-700",
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  username?: string;
  buttonText?: string;
  buttonColor?: string;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className={`${cardBase} flex flex-col items-center justify-center p-4 gap-2 group`}
  >
    <Icon className="w-8 h-8 text-gray-700 group-hover:scale-110 transition-transform" />
    <div className="text-center">
      <p className="font-semibold text-gray-900 text-sm">{title}</p>
      {username && <p className="text-gray-500 text-xs">{username}</p>}
    </div>
    {buttonText && (
      <span className={`text-xs px-3 py-1 rounded-full ${buttonColor}`}>
        {buttonText}
      </span>
    )}
  </a>
);

// OGP Card with Image Preview
const OGPCard = ({
  href,
  image,
  title,
  domain,
  large = false,
}: {
  href: string;
  image: string;
  title: string;
  domain: string;
  large?: boolean;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className={`${cardBase} flex flex-col group ${large ? "col-span-2 row-span-2" : "col-span-2"}`}
  >
    <div className={`relative w-full ${large ? "flex-1 min-h-[160px]" : "h-32"} overflow-hidden bg-gray-100`}>
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>
    <div className="p-3">
      <p className="font-medium text-gray-900 text-sm line-clamp-2">{title}</p>
      <p className="text-gray-400 text-xs mt-1">{domain}</p>
    </div>
  </a>
);

// Simple Link Card
const LinkCard = ({
  href,
  title,
  domain,
  icon,
}: {
  href: string;
  title: string;
  domain: string;
  icon?: React.ReactNode;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className={`${cardBase} flex items-center gap-3 p-4 group`}
  >
    {icon && <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">{icon}</div>}
    <div className="flex-1 min-w-0">
      <p className="font-medium text-gray-900 text-sm truncate group-hover:text-blue-600 transition-colors">{title}</p>
      <p className="text-gray-400 text-xs">{domain}</p>
    </div>
  </a>
);

// Section Header
const SectionHeader = ({ children }: { children: React.ReactNode }) => (
  <p className="col-span-2 md:col-span-4 text-gray-500 text-sm font-medium mt-4 first:mt-0">{children}</p>
);

// Image Card (decorative)
const ImageCard = ({
  src,
  alt,
  span = 1,
}: {
  src: string;
  alt: string;
  span?: number;
}) => (
  <div className={`${cardBase} relative ${span === 2 ? "col-span-2 row-span-2" : ""}`}>
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover"
    />
  </div>
);

export default function BentoPage() {
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
          <div className="w-28 h-28 rounded-full overflow-hidden shadow-lg mb-4">
            <Image
              src="/avatar.jpg"
              alt="Yosuke Fujii"
              width={112}
              height={112}
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Yosuke Fujii</h1>
          <div className="text-gray-600 text-center mt-2 space-y-1">
            <p>Design Engineer at Goodpatch Inc. 💙</p>
            <p>オンライン劇場ZA UXエンジニア 🎭</p>
            <p className="text-gray-400 text-sm">あだ名はtouyou（とうよう）です</p>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[100px]">

          {/* SNS Row 1 */}
          <SocialCard
            href="https://x.com/touyou_dev"
            icon={XIcon}
            title="Twitter [dev]"
            username="@touyou_dev"
            buttonText="Follow"
          />
          <SocialCard
            href="https://github.com/touyou"
            icon={GitHubIcon}
            title="touyou - GitHub"
            buttonText="Follow"
          />
          <SocialCard
            href="https://youtube.com/@touyoubuntu"
            icon={YouTubeIcon}
            title="touyou"
            buttonText="Subscribe 10"
            buttonColor="bg-red-100 text-red-600"
          />
          <SocialCard
            href="https://linkedin.com/in/touyou"
            icon={LinkedInIcon}
            title="LinkedIn"
            username="linkedin.com"
          />

          {/* Instagram with photos */}
          <SocialCard
            href="https://instagram.com/touyou_work"
            icon={InstagramIcon}
            title="@touyou_work"
            buttonText="Follow 69"
            buttonColor="bg-pink-100 text-pink-600"
          />
          <SocialCard
            href="https://instagram.com/touyou1121"
            icon={InstagramIcon}
            title="@touyou1121"
            buttonText="Follow 544"
            buttonColor="bg-pink-100 text-pink-600"
          />
          <ImageCard src="/bento/insta-1.jpg" alt="Instagram post" />
          <ImageCard src="/bento/insta-2.jpg" alt="Instagram post" />

          {/* Private SNS */}
          <SectionHeader>もっとプライベート</SectionHeader>

          <SocialCard
            href="https://x.com/touyoubuntu"
            icon={XIcon}
            title="Twitter [private]"
            username="@touyoubuntu"
            buttonText="Follow"
          />
          <SocialCard
            href="https://x.com/touyou_game"
            icon={XIcon}
            title="Twitter [game]"
            username="@touyou_game"
            buttonText="Follow"
          />

          {/* Portfolio links */}
          <LinkCard
            href="https://www.wantedly.com/id/touyoubuntu"
            title="Wantedly"
            domain="wantedly.com"
          />
          <LinkCard
            href="https://touyou.dev"
            title="touyou.dev"
            domain="touyou.dev"
          />
          <LinkCard
            href="https://gitlab.com/touyou"
            title="touyou · GitLab"
            domain="gitlab.com"
          />
          <SocialCard
            href="https://www.facebook.com/fujiyou/"
            icon={FacebookIcon}
            title="Facebook"
            username="facebook.com"
          />
          <LinkCard
            href="https://developers.google.com/profile/u/touyou"
            title="Yosuke Fujii - Google Developers"
            domain="developers.google.com"
          />
          <SocialCard
            href="https://www.threads.net/@touyou1121"
            icon={ThreadsIcon}
            title="藤井 陽介"
            username="threads.net"
          />
          <SocialCard
            href="https://bsky.app/profile/touyou.bsky.social"
            icon={BlueskyIcon}
            title="とうよう"
            username="bsky.app"
          />
          <SocialCard
            href="https://zenn.dev/touyou"
            icon={ZennIcon}
            title="とうよう"
            username="zenn.dev"
          />

          {/* Works Section */}
          <SectionHeader>これまでやってきたこと</SectionHeader>

          <OGPCard
            href="https://goodpatch.com/work/suntory"
            image="/bento/suntory.jpg"
            title="SUNTORY＋｜Work｜Goodpatch グッドパッチ"
            domain="goodpatch.com"
            large
          />
          <OGPCard
            href="https://goodpatch.com/work/clinics"
            image="/bento/clinics.jpg"
            title="CLINICS｜Work｜Goodpatch グッドパッチ"
            domain="goodpatch.com"
            large
          />
          <OGPCard
            href="https://za.theater/"
            image="/bento/za.jpg"
            title="オンライン劇場 ZA"
            domain="za.theater"
            large
          />

          {/* Writing & Speaking Section */}
          <SectionHeader>書く、発表する、しゃべる</SectionHeader>

          <OGPCard
            href="https://www.youtube.com/watch?v=4wC7tlLHyYw"
            image="/bento/aws-devday.jpg"
            title="AWS Dev Day Online Japan C-5 : AWSサーバレスが支える劇団ノーミーツのオンライン劇場"
            domain="youtube.com"
            large
          />
          <OGPCard
            href="https://speakerdeck.com/touyou/aws-dev-day-online-2021-c-5"
            image="/bento/aws-speakerdeck.jpg"
            title="AWSサーバーレスが支える劇団ノーミーツのオンライン劇場ZA"
            domain="speakerdeck.com"
          />
          <OGPCard
            href="https://github.com/touyou/NeumorphismTab"
            image="/bento/neumorphism.jpg"
            title="GitHub - touyou/NeumorphismTab: Custom TabBarController with Neumorphism."
            domain="github.com"
          />
          <OGPCard
            href="https://www.youtube.com/watch?v=wJpIZr7sqtE"
            image="/bento/visionpro.jpg"
            title="UXデザイナー・エンジニアが考察するApple Vision Pro"
            domain="youtube.com"
          />
          <OGPCard
            href="https://goodpatch.com/blog/2024-02-designcats"
            image="/bento/design-cats.jpg"
            title="狙い通りのユーザー体験を&quot;ゼロ距離&quot;で実装する──Goodpatch流「UXデザイナー×エンジニア」の協力体制とは"
            domain="goodpatch.com"
          />
          <OGPCard
            href="https://speakerdeck.com/touyou/sheng-cheng-aihuo-yong-purodakutogamu-zhi-sitehosiiwei-lai"
            image="/bento/genai-product.jpg"
            title="生成AI活用プロダクトが目指してほしい未来"
            domain="speakerdeck.com"
          />
          <OGPCard
            href="https://www.youtube.com/watch?v=07LIxk1ow1Q"
            image="/bento/liquid-glass.jpg"
            title="Liquid GlassとAppIntentsについての考察 @touyou_dev #1 day2"
            domain="youtube.com"
            large
          />
          <OGPCard
            href="https://www.youtube.com/watch?v=mH51h_BoG4c"
            image="/bento/flutterkaigi.jpg"
            title="Add-to-appで真のLiquid Glass対応を目指してみた"
            domain="youtube.com"
          />

          {/* More links */}
          <SocialCard
            href="https://fedibird.com/@touyou"
            icon={FedibirdIcon}
            title="とうよう"
            username="fedibird.com"
          />
          <SocialCard
            href="http://qiita.com/touyou"
            icon={QiitaIcon}
            title="@touyou"
            username="qiita.com"
          />

          {/* Decorative images */}
          <ImageCard src="/bento/insta-3.jpg" alt="Instagram post" />
          <ImageCard src="/bento/insta-4.jpg" alt="Instagram post" />
          <ImageCard src="/bento/nippo.jpg" alt="にっぽ" span={2} />
          <ImageCard src="/bento/logo-touyou.jpg" alt="touyou logo" />
          <ImageCard src="/bento/touyou-logo.png" alt="TOUYOU" />

        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-400 text-sm">
          <p>Copyrights © 2015- touyou. All Rights Reserved.</p>
        </footer>
      </div>
    </main>
  );
}
