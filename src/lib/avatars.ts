export const AVATARS = [
 { id: 'explorador-01', label: 'Tranças e óculos de exploração', image: '/assets/avatars/explorador-01.webp' },
 { id: 'explorador-02', label: 'Cabelo castanho e sardas', image: '/assets/avatars/explorador-02.webp' },
 { id: 'explorador-03', label: 'Cabelo preto e lenço dourado', image: '/assets/avatars/explorador-03.webp' },
 { id: 'explorador-04', label: 'Cachos curtos e sorriso curioso', image: '/assets/avatars/explorador-04.webp' },
 { id: 'explorador-05', label: 'Cabelo ruivo e trança lateral', image: '/assets/avatars/explorador-05.webp' },
 { id: 'explorador-06', label: 'Cabelo escuro e bandana verde', image: '/assets/avatars/explorador-06.webp' },
 { id: 'explorador-07', label: 'Cachos castanhos e óculos redondos', image: '/assets/avatars/explorador-07.webp' },
 { id: 'explorador-08', label: 'Cabelo escuro e óculos de exploração', image: '/assets/avatars/explorador-08.webp' },
 { id: 'explorador-09', label: 'Cabelo loiro e boné de expedição', image: '/assets/avatars/explorador-09.webp' },
 { id: 'explorador-10', label: 'Cabelo curto e lenço terracota', image: '/assets/avatars/explorador-10.webp' },
] as const;

export type AvatarId = typeof AVATARS[number]['id'];
const legacyAvatars: Record<string, AvatarId> = {
 'Bússola': 'explorador-01', 'Lanterna': 'explorador-02', 'Guardião': 'explorador-03',
 'Estrela': 'explorador-04', 'Tesouro': 'explorador-05', 'Mapa': 'explorador-06',
};
export function migrateAvatar(value: unknown): AvatarId | undefined {
 if (typeof value !== 'string') return undefined;
 return AVATARS.find(avatar => avatar.id === value)?.id ?? (Object.hasOwn(legacyAvatars,value) ? legacyAvatars[value] : undefined);
}
export function getAvatar(id: AvatarId) { return AVATARS.find(avatar => avatar.id === id) ?? AVATARS[0]; }
