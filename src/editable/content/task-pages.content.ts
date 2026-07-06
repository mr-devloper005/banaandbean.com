import type { TaskKey } from '@/lib/site-config'

export type TaskPageVoice = {
  eyebrow: string
  headline: string
  description: string
  filterLabel: string
  secondaryNote: string
  chips: string[]
}

/*
  Task voices for a Local Directory + Reference Library platform.

  Public labels:
    listing → "Local Directory"
    pdf     → "Reference Library"
*/
export const taskPageVoices = {
  article: {
    eyebrow: 'Journal',
    headline: 'Longer reads and community briefings.',
    description:
      'Stories, guides and neighbourhood reporting that put a little context around every listing and every reference in the library.',
    filterLabel: 'Choose a topic',
    secondaryNote: 'Slower reading with a calmer editorial rhythm.',
    chips: ['Long-form', 'Guides', 'Briefings'],
  },
  classified: {
    eyebrow: 'Marketplace',
    headline: 'Fast-moving community postings.',
    description:
      'Time-sensitive offers, requests and short notices from people around the neighbourhood — scan them quickly, act on them faster.',
    filterLabel: 'Filter marketplace',
    secondaryNote: 'Prioritize urgency, short summaries and direct action.',
    chips: ['Fast scan', 'Offers', 'Community'],
  },
  sbm: {
    eyebrow: 'Saves',
    headline: 'Resources the community keeps coming back to.',
    description:
      'Curated links, tools and references saved by the community — a shelf you can browse instead of a firehose you have to filter.',
    filterLabel: 'Filter saved shelf',
    secondaryNote: 'Curated resources with calm metadata and clear grouping.',
    chips: ['Collections', 'Resources', 'Curated'],
  },
  profile: {
    eyebrow: 'People',
    headline: 'The operators and voices behind the listings.',
    description:
      'Owners, makers and community members with public profiles — trust cues and identity first, so it feels like meeting someone.',
    filterLabel: 'Filter people',
    secondaryNote: 'Make identity and credibility visible before the grid begins.',
    chips: ['Identity first', 'Trust cues', 'Community voices'],
  },
  pdf: {
    eyebrow: 'Reference Library',
    headline: 'Downloadable briefings, guides and reference material.',
    description:
      'A library of reference material you can save to keep — briefings, guides, checklists and reports, all free to download.',
    filterLabel: 'Filter the library',
    secondaryNote: 'Every file lists its category, page count and updated date up front.',
    chips: ['Downloadable', 'Free to keep', 'Cited'],
  },
  listing: {
    eyebrow: 'Local Directory',
    headline: 'Places, businesses and services near you.',
    description:
      'Search the local directory by neighbourhood, category or need — verified entries surface first, with hours, contact and a map on every record.',
    filterLabel: 'Filter the directory',
    secondaryNote: 'Optimised for comparison, location and direct action paths.',
    chips: ['Verified', 'Local first', 'Comparable'],
  },
  image: {
    eyebrow: 'Gallery',
    headline: 'A visual feed from around the community.',
    description:
      'Photos of the places, moments and finds from around the neighbourhood — lead with the image, tuck the story just below.',
    filterLabel: 'Filter the gallery',
    secondaryNote: 'Let images carry the page before long text does.',
    chips: ['Visual-first', 'Community', 'Portfolio mood'],
  },
} satisfies Record<TaskKey, TaskPageVoice>
