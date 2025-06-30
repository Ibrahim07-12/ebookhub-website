import { Session } from "next-auth";

export function UserAvatar({ session }: { session: Session | null }) {
  if (!session?.user) return null;
  return (
    <div className="flex items-center gap-2">
      <img
        src={session.user.image || "/default-avatar.png"}
        alt={session.user.name || "User"}
        className="w-8 h-8 rounded-full object-cover border border-gray-700"
      />
      <span className="text-white font-semibold">{session.user.name}</span>
    </div>
  );
}
