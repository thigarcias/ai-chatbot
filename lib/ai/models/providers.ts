/**
 * Provider information for the model selector UI
 */

export interface ProviderInfo {
  id: string
  name: string
  description: string
  iconUrl: string
}

export const providers: ProviderInfo[] = [
  {
    id: 'github',
    name: 'GitHub Models',
    description: 'Models powered by GitHub',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/25/25231.png'
  },
  {
    id: 'copilot',
    name: 'Copilot',
    description: 'Models optimized for code generation',
    iconUrl: 'https://files.svgcdn.io/tabler/brand-github-copilot.svg'
  },
  {
    id: 'custom',
    name: 'Custom',
    description: 'Specialized models with custom system prompts',
    iconUrl: 'https://api.iconify.design/mdi:shield-key.svg?color=%236E56CF'
  }
]

// Map category names to provider IDs
export const categoryToProviderId: Record<string, string> = {
  'GitHub Models': 'github',
  'Copilot': 'copilot',
  'Custom': 'custom'
}