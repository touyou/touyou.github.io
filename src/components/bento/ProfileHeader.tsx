import Image from "next/image";
import type { BentoProfile } from "@/lib/bento-types";

interface ProfileHeaderProps {
  profile: BentoProfile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center mb-8">
      <div className="w-28 h-28 rounded-full overflow-hidden shadow-lg mb-4 ring-4 ring-white">
        <Image
          src={profile.avatar}
          alt={profile.name}
          width={112}
          height={112}
          className="w-full h-full object-cover"
          priority
        />
      </div>
      <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
      <div className="text-gray-600 text-center mt-2 space-y-1">
        {profile.bio.map((line, i) => (
          <p key={i} className={line === "" ? "h-2" : ""}>
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
