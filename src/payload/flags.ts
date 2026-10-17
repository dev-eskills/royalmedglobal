/** Flag emoji lookup for common medical-study destinations. */
export const FLAG_EMOJI: Record<string, string> = {
  uzbekistan: '🇺🇿',
  russia: '🇷🇺',
  'russian federation': '🇷🇺',
  kazakhstan: '🇰🇿',
  kyrgyzstan: '🇰🇬',
  tajikistan: '🇹🇯',
  georgia: '🇬🇪',
  armenia: '🇦🇲',
  azerbaijan: '🇦🇿',
  turkey: '🇹🇷',
  egypt: '🇪🇬',
  china: '🇨🇳',
  philippines: '🇵🇭',
  bangladesh: '🇧🇩',
  nepal: '🇳🇵',
  ukraine: '🇺🇦',
  belarus: '🇧🇾',
  moldova: '🇲🇩',
  romania: '🇷🇴',
}

/** Returns the flag emoji for a country title, or '' when unknown. */
export function flagForCountry(title: string): string {
  if (typeof title !== 'string') return ''
  return FLAG_EMOJI[title.trim().toLowerCase()] ?? ''
}
