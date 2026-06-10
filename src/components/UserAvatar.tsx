import { cn } from "../lib/utils";

type UserAvatarProps = {
  name?: string;
  avatarUrl?: string;
  className?: string;
  textClassName?: string;
};

export function UserAvatar({
  name,
  avatarUrl,
  className,
  textClassName,
}: UserAvatarProps) {
  const initial = (name?.[0] || "U").toUpperCase();

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name ? `${name} profile` : "Profile"}
        className={cn("rounded-full object-cover", className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold uppercase",
        className,
      )}
    >
      <span className={textClassName}>{initial}</span>
    </div>
  );
}
