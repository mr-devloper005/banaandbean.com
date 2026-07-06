import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'Local directory + reference library',
      description:
        'Search the local directory and the reference library from one place. Verified entries, downloadable guides, free to keep.',
      openGraphTitle: 'Local directory + reference library',
      openGraphDescription:
        'Search the local directory and the reference library from one place — verified places, free downloadable guides.',
      keywords: ['local directory', 'reference library', 'community', 'downloads'],
    },
    hero: {
      badge: 'Local directory + Reference library',
      title: ['Find what’s local.', 'Keep what’s useful.'],
      description:
        'The neighbourhood directory and a free-to-keep reference library, side by side. Search the places worth visiting; download the briefings worth saving.',
      primaryCta: { label: 'Browse the Local Directory', href: '/listings' },
      secondaryCta: { label: 'Open the Reference Library', href: '/pdf' },
      searchPlaceholder: 'Search places, references, categories…',
      focusLabel: 'Focus',
      featureCardBadge: 'this week',
      featureCardTitle: 'The new arrivals shape what the homepage looks like.',
      featureCardDescription:
        'Recent listings and freshly filed reference material stay at the centre of the experience.',
    },
    intro: {
      badge: 'How this works',
      title: 'One surface for local places and a reference library you can keep.',
      paragraphs: [
        'Some sites help you find local places. Some sites hand you reference files. This one does both, from the same navigation, with the same care around what gets published.',
        'The directory keeps every listing structured — hours, contact, map, category — so comparisons are easy. The reference library keeps every file free to download and free to keep.',
        'Whether you start with a place or a briefing, the trail from one to the other should feel natural.',
      ],
      sideBadge: 'At a glance',
      sidePoints: [
        'Verified local entries, with map and contact on every record.',
        'Reference library of briefings and guides, free to download.',
        'Search across the directory and the library from one field.',
        'Community submissions welcome — reviewed before they publish.',
      ],
      primaryLink: { label: 'Browse the Local Directory', href: '/listings' },
      secondaryLink: { label: 'Open the Reference Library', href: '/pdf' },
    },
    cta: {
      badge: 'Start exploring',
      title: 'Search the directory. Download the library. Free to keep.',
      description:
        'One search field, one library, one directory. Take a few briefings home; find the place you need on the way back.',
      primaryCta: { label: 'Browse the Local Directory', href: '/listings' },
      secondaryCta: { label: 'Contact us', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest in {label}',
      descriptionSuffix: 'Fresh entries from this section.',
    },
  },
  about: {
    badge: 'Our story',
    title: 'One surface for the directory and the reference library.',
    description: `${slot4BrandConfig.siteName} keeps the local directory and a free reference library under one roof — because both belong in the same civic conversation.`,
    paragraphs: [
      'Every listing in the directory is structured the same way — hours, contact, location, category — so comparing places feels honest, not like an ad grid.',
      'Every file in the reference library is free to download and free to keep. No account required; no watermark; no expiry.',
      'Wherever you start, you should be able to follow the trail — from a briefing to the neighbourhood it describes, or from a place to the reference material that put it on your radar.',
    ],
    values: [
      {
        title: 'Verified over volume',
        description:
          'We would rather list 40 real places than 400 auto-imported ones. Every directory record is reviewed before it publishes.',
      },
      {
        title: 'Free to keep',
        description:
          'Every entry in the reference library is downloadable, uncrippled and free — no email walls, no expiring links, no extraction fees.',
      },
      {
        title: 'Local first',
        description:
          'The directory is built for the neighbourhood, not the algorithm. Reference material follows the same instinct.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'Tell us what you’re looking for — the directory or the library will meet you there.',
    description:
      'Adding a place. Suggesting a reference file. Fixing a fact. Reporting a broken download. Whichever it is, this form routes it to the right lane.',
    formTitle: 'Send a message',
  },
  search: {
    metadata: {
      title: 'Search',
      description: 'Search across the local directory and the reference library.',
    },
    hero: {
      badge: 'Search',
      title: 'Search the directory and the library at once.',
      description:
        'One field, both surfaces. Try a neighbourhood, a category or a phrase from a briefing you half-remember.',
      placeholder: 'Search places, references, categories…',
    },
    resultsTitle: 'Latest matches',
  },
  create: {
    metadata: {
      title: 'Submit',
      description: 'Submit a new entry to the directory or the reference library.',
    },
    locked: {
      badge: 'Contributor access',
      title: 'Sign in to submit.',
      description: 'Use your account to open the submission workspace and add an entry to the directory or the reference library.',
    },
    hero: {
      badge: 'Submission workspace',
      title: 'Add to the directory or file a reference briefing.',
      description:
        'Choose what you’re adding, fill in the details, and we’ll review it before it publishes. Free for the community, always.',
    },
    formTitle: 'Entry details',
    submitLabel: 'Submit for review',
    successTitle: 'Thanks — your submission is in the queue.',
  },
  auth: {
    login: {
      metadataDescription: 'Sign in to your account.',
      badge: 'Member',
      title: 'Welcome back.',
      description: 'Sign in to continue submitting, saving and following the directory and the reference library.',
      formTitle: 'Sign in',
      submitLabel: 'Continue',
      noAccount: 'No account matched these details. Create one first, then sign in.',
      success: 'Signed in. Redirecting…',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Create an account.',
      badge: 'New member',
      title: 'Create an account to submit and save.',
      description:
        'A quick account unlocks submitting entries to the directory, filing new reference briefings, and saving what you want to come back to.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created. Redirecting…',
      loginCta: 'Sign in',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'More from the journal',
      fallbackTitle: 'Story details',
    },
    listing: {
      relatedTitle: 'More in the Local Directory',
      fallbackTitle: 'Directory entry',
    },
    image: {
      relatedTitle: 'More from the gallery',
      fallbackTitle: 'Gallery item',
    },
    profile: {
      relatedTitle: 'Recent stories',
      fallbackDescription: 'Profile details will appear here once available.',
      visitButton: 'Visit their site',
    },
  },
} as const
