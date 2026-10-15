import { getAvatar, type AvatarId } from '@/lib/avatars';

export function ProfileAvatar({ id, className = '', decorative = false }: { id: AvatarId; className?: string; decorative?: boolean }) {
 const avatar = getAvatar(id);
 return <span className={`profile-avatar ${className}`}><img src={avatar.image} alt={decorative ? '' : avatar.label} width={160} height={160} loading="lazy" decoding="async" /></span>;
}
