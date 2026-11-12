// Storybook exports this subpath; the current ESLint resolver doesn't resolve package exports.
// eslint-disable-next-line import/no-unresolved
import { fn } from 'storybook/test';
import decorate from './cards.js';
import './cards.css';
import './cards.stories.css';

const isText = (value) => typeof value === 'string' && value.trim().length > 0;

function isSafeUrl(value, image = false) {
  if (!isText(value)) return false;
  try {
    const { protocol } = new URL(value, window.location.href);
    return image ? ['http:', 'https:'].includes(protocol) : ['http:', 'https:', 'mailto:', 'tel:'].includes(protocol);
  } catch {
    return false;
  }
}

function createLink(href, content) {
  const link = document.createElement('a');
  link.href = href;
  link.append(content);
  return link;
}

function renderCard(card, options) {
  const row = document.createElement('div');
  const href = !options.hideLinks && isSafeUrl(card.href) ? card.href : '';

  if (!options.hideImages && isSafeUrl(card.image, true)) {
    const imageCell = document.createElement('div');
    const picture = document.createElement('picture');
    const image = document.createElement('img');
    image.src = card.image;
    image.alt = isText(card.alt) ? card.alt : '';
    picture.append(image);
    imageCell.append(href ? createLink(href, picture) : picture);
    row.append(imageCell);
  }

  const hasTitle = !options.hideTitles && isText(card.title);
  const hasEyebrow = !options.hideEyebrows && isText(card.eyebrow);
  const hasDescription = !options.hideDescriptions && isText(card.description);
  if (hasTitle || hasEyebrow || hasDescription) {
    const body = document.createElement('div');
    if (hasTitle) {
      const heading = document.createElement('h3');
      heading.textContent = card.title;
      body.append(href ? createLink(href, heading) : heading);
    }
    if (hasEyebrow) {
      const eyebrow = document.createElement('p');
      eyebrow.textContent = card.eyebrow;
      body.append(eyebrow);
    }
    if (hasDescription) {
      const description = document.createElement('p');
      description.textContent = card.description;
      body.append(description);
    }
    row.append(body);
  }

  return row;
}

function renderCards({
  cards = [],
  onCardClick,
  hideImages = false,
  hideLinks = false,
  hideTitles = false,
  hideEyebrows = false,
  hideDescriptions = false,
}) {
  const story = document.createElement('div');
  story.className = 'cards-story';

  const block = document.createElement('div');
  block.className = 'cards';
  const options = {
    hideImages,
    hideLinks,
    hideTitles,
    hideEyebrows,
    hideDescriptions,
  };
  (Array.isArray(cards) ? cards : []).forEach((card) => {
    if (card && typeof card === 'object') block.append(renderCard(card, options));
  });
  decorate(block);
  block.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link || !block.contains(link)) return;
    event.preventDefault();
    if (typeof onCardClick === 'function') {
      onCardClick({
        href: link.getAttribute('href'),
        label: link.textContent.trim() || link.querySelector('img')?.alt || 'Card image',
      });
    }
  });

  story.append(block);
  return story;
}

const meta = {
  title: 'Blocks/Cards',
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true },
  },
  argTypes: {
    cards: {
      control: 'object',
      description: 'Edit the card array to change item count, image, copy, and links.',
    },
    hideImages: {
      control: 'boolean',
      description: 'Hide all card images.',
    },
    hideLinks: {
      control: 'boolean',
      description: 'Render linked card content as plain text.',
    },
    hideTitles: {
      control: 'boolean',
      description: 'Hide card titles.',
    },
    hideEyebrows: {
      control: 'boolean',
      description: 'Hide optional eyebrow labels.',
    },
    hideDescriptions: {
      control: 'boolean',
      description: 'Hide card descriptions.',
    },
    onCardClick: {
      control: false,
      description: 'Logged in the Actions panel when a card link is clicked.',
    },
  },
  args: {
    onCardClick: fn(),
    hideImages: false,
    hideLinks: false,
    hideTitles: false,
    hideEyebrows: false,
    hideDescriptions: false,
  },
  render: renderCards,
};

export default meta;

export const Default = {
  args: {
    cards: [
      {
        title: 'Amplify AAPI Cross Industry Report',
        description: 'Habits and buying behaviors of Asian American, Native Hawaiian, or Pacific Islander communities.',
        image: '/images/cross-industry-report-image.png',
        alt: 'Cover of Cross-Industry Report',
        href: 'https://mailchi.mp/norc/amplifyaapi-cross-industry-report',
      },
      {
        title: 'AAPI Data | AP-NORC Survey September/October 2025',
        description: 'Trump receives worse marks with AAPI adults than general public on key issues.',
        image: '/images/aapidata-sept-oct.png',
        alt: 'Thumbnail of report cover',
        href: 'https://aapidata.com/surveys/aapi-data-ap-norc-survey-september-october-2025',
      },
      {
        title: 'AAPI Data | AP-NORC Survey June/July 2025',
        description: 'AAPI adults are skeptical of tariffs and have more unfavorable views of Trump than before he took office.',
        image: '/images/aapidata-jun-jul.png',
        alt: 'Thumbnail image of project report',
        href: 'https://aapidata.com/surveys/aapi-data-ap-norc-survey-july-2025',
      },
      {
        title: 'AAPI Data AP-NORC',
        description: 'A series of monthly polls, delivering regular insights on crucial issues, from policy priorities to civic engagement.',
        image: '/images/aapi-data-ap-norc.png',
        alt: 'Older Asian man with an American flag in a stadium',
        href: 'https://apnorc.org/topics/aapi-data/',
      },
      {
        title: 'State of Chinese Americans Survey 2024',
        description: 'A survey done in partnership with Committee of 100 focused on the politics and policy needs of Chinese Americans.',
        image: '/images/c100logothumbnail.png',
        alt: 'Committee of 100 logo',
        href: 'https://www.committee100.org/our-work/the-state-of-chinese-americans-survey-2024/',
      },
      {
        title: 'The State of Anti-AA/PI Hate',
        description: 'A comprehensive picture of the state of anti-Asian American and anti-Pacific Islander hate in 2023.',
        image: '/images/state-of-hate-banner.png',
        alt: 'State of Hate report: From Pain to Power',
        href: 'https://stopaapihate.org/2024/09/25/state-of-hate-sept24/',
      },
    ],
  },
};

export const MixedContent = {
  args: {
    cards: [
      {
        title: 'Image and linked content',
        description: 'A card with an image, title, description, and link.',
        image: '/images/hero-home.jpg',
        alt: 'A father and daughter',
        href: 'https://example.com/image-and-copy',
      },
      {
        title: 'Text-only card',
        description: 'Cards remain useful when no image is supplied.',
      },
      {
        image: '/images/cta-banner.jpg',
        alt: 'Wide banner image',
        href: 'https://example.com/image-only',
      },
      {
        title: 'Video interview',
        eyebrow: 'Video',
        description: 'An optional eyebrow label can appear between the title and supporting copy.',
        href: 'https://example.com/video',
      },
    ],
  },
};

export const TextOnly = {
  args: {
    cards: [
      { title: 'Research', description: 'A text-only card with a short summary.' },
      { title: 'Community insights', description: 'Another card without a media cell.' },
      { title: 'Watch the interview', eyebrow: 'Video', description: 'Title, eyebrow, and body copy.' },
    ],
  },
};

export const ImageOnly = {
  args: {
    cards: [
      { image: '/images/hero-home.jpg', alt: 'A father and daughter', href: 'https://example.com/hero' },
      { image: '/images/stephanie-morimoto.png', alt: 'Stephanie Morimoto', href: 'https://example.com/stephanie' },
      { image: '/images/kevin-pang.png', alt: 'Kevin Pang', href: 'https://example.com/kevin' },
    ],
  },
};

export const SingleCard = {
  args: {
    cards: [
      {
        title: 'One featured story',
        description: 'The grid naturally adapts when there is only one item.',
        image: '/images/nancy-chen.png',
        alt: 'Nancy Chen',
        href: 'https://example.com/featured-story',
      },
    ],
  },
};

export const LongCopy = {
  args: {
    cards: [
      {
        title: 'How trusted research creates a fuller picture',
        description: 'This example uses longer supporting copy to demonstrate how card bodies grow with content. Amplify AAPI shares research that helps organizations better understand the opinions, experiences, and needs of Asian American, Native Hawaiian, and Pacific Islander communities.',
        image: '/images/cross-industry-report-image.png',
        alt: 'Cover of Cross-Industry Report',
        href: 'https://example.com/long-copy',
      },
      {
        title: 'A short card',
        description: 'Short copy.',
      },
    ],
  },
};
