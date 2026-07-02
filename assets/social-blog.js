const parseCount = (text) => {
  const match = String(text || '').match(/([\d.]+)\s*([KM])?/i);
  if (!match) return 0;
  const value = Number(match[1]);
  const suffix = (match[2] || '').toUpperCase();
  if (suffix === 'K') return Math.round(value * 1000);
  if (suffix === 'M') return Math.round(value * 1000000);
  return Math.round(value);
};

const formatCount = (value) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(value >= 10000000 ? 0 : 1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}K`;
  return String(value);
};

const cleanLikeText = (text) => {
  const match = String(text || '').match(/([\d.]+\s*[KM]?\s*likes?)/i);
  return match ? match[1].replace(/\s+/g, ' ') : '';
};

const removeBlueprintIconFragment = () => {
  if (!/\/blueprint(?:\.html)?\/?$/.test(window.location.pathname)) return;
  document.querySelectorAll('body > rect, body > text').forEach((node) => node.remove());
  document.body.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE && node.textContent.includes('"/>')) node.remove();
  });
};

removeBlueprintIconFragment();

const countSets = [
  ['2.8K', '143', '81'],
  ['1.9K', '98', '57'],
  ['1.4K', '76', '44'],
  ['987', '51', '29'],
  ['812', '42', '24'],
  ['733', '38', '21'],
  ['1.1K', '64', '36'],
  ['644', '31', '18'],
  ['591', '27', '15'],
  ['462', '19', '12']
];

document.querySelectorAll('.post-card').forEach((post, index) => {
  let metrics = post.querySelector('.post-metrics');
  const [likes, comments, shares] = countSets[index % countSets.length];
  if (!metrics) {
    metrics = document.createElement('div');
    metrics.className = 'post-metrics';
    post.querySelector('.post-actions')?.insertAdjacentElement('beforebegin', metrics);
  }
  const existingLikes = metrics.querySelector('span:first-child')?.textContent || `${likes} likes`;
  const existingSocial = metrics.querySelector('span:last-child')?.textContent || `${comments} comments · ${shares} shares`;
  const likeText = cleanLikeText(existingLikes) || `${likes} likes`;
  const commentMatch = existingSocial.match(/([\d.]+K?)\s*comments?/i);
  const shareMatch = existingSocial.match(/([\d.]+K?)\s*shares?/i);
  metrics.innerHTML = `<span class="like-count" data-base-likes="${parseCount(likeText)}">👍 ${likeText}</span><span>💬 ${commentMatch ? commentMatch[1] : comments} comments · ↗️ ${shareMatch ? shareMatch[1] : shares} shares</span>`;
});

const ensureFeedback = (post) => {
  let feedback = post.querySelector('.social-feedback');
  if (!feedback) {
    feedback = document.createElement('div');
    feedback.className = 'social-feedback';
    post.querySelector('.post-actions')?.insertAdjacentElement('afterend', feedback);
  }
  return feedback;
};

document.querySelectorAll('[data-react]').forEach((button) => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    const post = button.closest('.post-card, .article-post');
    const likeCount = post?.querySelector('.like-count');
    const wasActive = button.classList.toggle('active');
    button.textContent = wasActive ? 'Liked' : 'Like';
    if (likeCount) {
      const base = Number(likeCount.dataset.baseLikes || parseCount(likeCount.textContent));
      likeCount.dataset.baseLikes = String(base);
      likeCount.textContent = `👍 ${formatCount(base + (wasActive ? 1 : 0))} likes`;
    }
    ensureFeedback(post).innerHTML = wasActive
      ? '<strong>You liked this.</strong> The count updated.'
      : '<strong>Like removed.</strong> You can tap Like again anytime.';
  });
});

document.querySelectorAll('.post-actions a').forEach((link) => {
  const label = link.textContent.trim().toLowerCase();
  if (!label.includes('comment') && !label.includes('share')) return;
  link.addEventListener('click', async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const post = link.closest('.post-card, .article-post');
    const feedback = ensureFeedback(post);
    if (label.includes('comment')) {
      feedback.innerHTML = `
        <div class="comment-composer">
          <img src="https://statics.myclickfunnels.com/workspace/vGVGzP/image/20204117/file/904663e23eb23a39d6f2459104b7bccc.png" alt="">
          <input type="text" placeholder="Write a comment..." aria-label="Write a comment">
          <button type="button">Post</button>
        </div>
        <div class="comment-thread"><strong>You:</strong> This is exactly what I needed to see today.</div>
      `;
      const input = feedback.querySelector('input');
      feedback.querySelector('button').addEventListener('click', () => {
        const text = input.value.trim() || 'This is exactly what I needed to see today.';
        feedback.querySelector('.comment-thread').innerHTML = `<strong>You:</strong> ${text}`;
        input.value = '';
      });
      input.focus();
    }
    if (label.includes('share')) {
      const title = post?.querySelector('h2')?.textContent?.trim() || document.title;
      const href = post?.dataset.cardHref || location.href;
      try {
        if (navigator.clipboard) await navigator.clipboard.writeText(new URL(href, location.href).href);
      } catch (_) {}
      feedback.innerHTML = `<strong>Shared.</strong> Link copied for: ${title}`;
      link.textContent = 'Shared';
      window.setTimeout(() => { link.textContent = 'Share'; }, 1800);
    }
  });
});

document.querySelectorAll('[data-card-href]').forEach((card) => {
  card.addEventListener('click', (event) => {
    if (event.target.closest('a,button,input')) return;
    const href = card.getAttribute('data-card-href');
    if (href) window.location.href = href;
  });
});

const fallbackSearchIndex = [
  {
    url: '/',
    title: 'Sean Ali - Build Freedom With AI, Money Mindset, and Subconscious Reprogramming',
    description: 'Start here for Claude27 prompts, AI income systems, subconscious reset guides, manifestation tools, and Sean Ali proof pages.',
    tags: 'home start sean ali ai income money mindset subconscious reprogramming manifestation freedom panama prompts'
  },
  {
    url: '/prompts.html',
    title: 'Claude27 Prompts',
    description: 'Get 27 Claude prompts to find your offer, create content, build landing pages, write emails, and get your first buyer online.',
    tags: 'claude prompts ai income offer content landing page emails buyer start here'
  },
  {
    url: '/prompts-guide.html',
    title: 'Claude27 Prompt Guide',
    description: 'Preview the full prompt guide for building an AI income stream from zero with Claude.',
    tags: 'prompt guide claude27 ai income brainstorming research content generation'
  },
  {
    url: '/quit-your-9-to-5-with-ai.html',
    title: 'Quit Your 9-to-5 With AI',
    description: 'A practical AI escape plan for building systems, offers, content, and online income outside the traditional job path.',
    tags: 'quit 9 to 5 ai success systems freedom income online business'
  },
  {
    url: '/what-are-money-blocks.html',
    title: 'What Are Money Blocks?',
    description: 'Learn how money blocks form, why scarcity patterns repeat, and how subconscious reprogramming can interrupt the loop.',
    tags: 'money blocks scarcity survival nervous system subconscious sleep theta'
  },
  {
    url: '/how-to-reprogram-your-subconscious-mind.html',
    title: 'How To Reprogram Your Subconscious Mind',
    description: 'A practical guide to theta states, sleep audio, identity rewrites, neuroplasticity, and changing subconscious patterns.',
    tags: 'subconscious mind reprogramming theta brainwave sleep audio neuroplasticity identity'
  },
  {
    url: '/best-ai-manifestation-app.html',
    title: 'Best AI Manifestation App',
    description: 'How AI can identify self-sabotage patterns, personalize manifestation work, and support subconscious reprogramming.',
    tags: 'ai manifestation app self sabotage patterns genie reprogramming personalized'
  },
  {
    url: '/guide.html',
    title: 'The Hidden Mental Brake',
    description: 'A focused guide on why smart people stay stuck and how to interrupt survival loops before sleep.',
    tags: 'mental brake stuck subconscious survival loop nighttime reset money stress'
  },
  {
    url: '/blueprint.html',
    title: 'AI Freedom Blueprint',
    description: 'A blueprint for building online income systems with AI, offers, content, research, ads, and execution checklists.',
    tags: 'blueprint ai freedom ad creative research checklist income systems'
  },
  {
    url: '/story.html',
    title: 'Sean Ali Story',
    description: 'Sean Ali founder story, online business background, Canada to Panama move, and the path behind the work.',
    tags: 'story about sean ali canada panama founder online business proof'
  },
  {
    url: '/reset/',
    title: 'Subconscious Reset',
    description: 'Nighttime reset signup for weakening old subconscious patterns before sleep.',
    tags: 'reset nighttime subconscious sleep money stress audio'
  },
  {
    url: '/sign-up',
    title: 'Sean Ali Wealth Identity Masterclass',
    description: 'Free Masterclass for online creators who want to break the 5 hidden money patterns keeping them stuck at $2K-$10K/month.',
    tags: 'masterclass online creators hidden money patterns wealth identity income ceiling'
  },
  {
    url: '/videos/moneyblocks1.html',
    title: 'Money Blocks Video',
    description: 'Video lesson on money blocks, subconscious patterns, and financial survival loops.',
    tags: 'video money blocks subconscious financial survival'
  },
  {
    url: '/videos/genie.html',
    title: 'Manifestation Genie Video',
    description: 'Video page for manifestation, AI support, and reprogramming patterns.',
    tags: 'video genie manifestation ai reprogramming'
  },
  {
    url: '/videos/theta-waves.html',
    title: 'Theta Waves Video',
    description: 'Video page focused on theta waves, sleep states, and subconscious access.',
    tags: 'video theta waves sleep subconscious brainwaves'
  }
];

const normalizeSearchText = (value) => String(value || '').toLowerCase().replace(/\s+/g, ' ').trim();

const decodeHtmlEntities = (value) => {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = value || '';
  return textarea.value;
};

const getSearchPath = (url) => {
  try {
    const parsed = new URL(url, window.location.origin);
    return parsed.pathname === '/index.html' ? '/' : parsed.pathname;
  } catch (_) {
    return url;
  }
};

const extractSearchDocument = (html, url) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.querySelectorAll('script,style,noscript,svg,iframe,header,footer,.mobile-tabbar').forEach((node) => node.remove());
  const title = doc.querySelector('meta[property="og:title"]')?.content || doc.querySelector('title')?.textContent || getSearchPath(url);
  const description = doc.querySelector('meta[name="description"]')?.content || doc.querySelector('meta[property="og:description"]')?.content || '';
  const headings = Array.from(doc.querySelectorAll('h1,h2,h3')).map((heading) => heading.textContent).join(' ');
  const body = doc.body?.textContent || '';
  return {
    url: getSearchPath(url),
    title: decodeHtmlEntities(title.replace(/\s*[|-].*Sean Ali.*$/i, '').trim()),
    description: decodeHtmlEntities(description.trim()),
    tags: normalizeSearchText(`${headings} ${body}`).slice(0, 5000)
  };
};

let siteSearchIndexPromise;

const loadSiteSearchIndex = async () => {
  if (siteSearchIndexPromise) return siteSearchIndexPromise;
  siteSearchIndexPromise = (async () => {
    if (!/^https?:$/.test(window.location.protocol)) return fallbackSearchIndex;
    try {
      const sitemapResponse = await fetch('/sitemap.xml', { cache: 'force-cache' });
      if (!sitemapResponse.ok) throw new Error('Sitemap unavailable');
      const sitemapText = await sitemapResponse.text();
      const sitemap = new DOMParser().parseFromString(sitemapText, 'application/xml');
      const urls = Array.from(sitemap.querySelectorAll('loc'))
        .map((loc) => loc.textContent.trim())
        .filter((url) => {
          const parsed = new URL(url);
          const pageHost = parsed.hostname.replace(/^www\./, '');
          const currentHost = window.location.hostname.replace(/^www\./, '');
          return pageHost === currentHost && !parsed.pathname.endsWith('.pdf');
        })
        .slice(0, 30);

      const fetchedPages = await Promise.all(urls.map(async (url) => {
        try {
          const response = await fetch(getSearchPath(url), { cache: 'force-cache' });
          if (!response.ok) return null;
          return extractSearchDocument(await response.text(), url);
        } catch (_) {
          return null;
        }
      }));

      const pages = fetchedPages.filter(Boolean);
      return pages.length ? pages : fallbackSearchIndex;
    } catch (_) {
      return fallbackSearchIndex;
    }
  })();
  return siteSearchIndexPromise;
};

const scoreSearchResult = (page, terms) => {
  const title = normalizeSearchText(page.title);
  const description = normalizeSearchText(page.description);
  const tags = normalizeSearchText(page.tags);
  return terms.reduce((score, term) => {
    if (!term) return score;
    if (title.includes(term)) score += 10;
    if (description.includes(term)) score += 5;
    if (tags.includes(term)) score += 2;
    return score;
  }, 0);
};

const renderSearchResults = (panel, results, query) => {
  panel.hidden = false;
  if (!query) {
    panel.innerHTML = fallbackSearchIndex.slice(0, 5).map((page) => `
      <a class="site-search-result" href="${page.url}">
        <strong>${page.title}</strong>
        <span>${page.description}</span>
      </a>
    `).join('');
    return;
  }
  if (!results.length) {
    panel.innerHTML = '<div class="site-search-empty">No matches yet. Try AI income, money blocks, reset, prompts, or Panama.</div>';
    return;
  }
  panel.innerHTML = results.slice(0, 6).map((page) => `
    <a class="site-search-result" href="${page.url}">
      <strong>${page.title}</strong>
      <span>${page.description}</span>
    </a>
  `).join('');
};

document.querySelectorAll('[data-feed-search]').forEach((input) => {
  const searchWrap = input.closest('.social-search');
  const panel = document.createElement('div');
  panel.className = 'site-search-results';
  panel.hidden = true;
  panel.setAttribute('role', 'listbox');
  searchWrap?.appendChild(panel);

  const runSearch = async () => {
    const query = input.value.trim().toLowerCase();
    document.querySelectorAll('[data-feed-card]').forEach((card) => {
      card.hidden = query && !card.textContent.toLowerCase().includes(query);
    });

    const terms = normalizeSearchText(query).split(' ').filter(Boolean);
    const index = await loadSiteSearchIndex();
    const results = terms.length
      ? index
        .map((page) => ({ ...page, score: scoreSearchResult(page, terms) }))
        .filter((page) => page.score > 0)
        .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
      : [];
    renderSearchResults(panel, results, query);
  };

  input.addEventListener('focus', runSearch);
  input.addEventListener('input', runSearch);
  input.addEventListener('keydown', async (event) => {
    if (event.key === 'Escape') {
      panel.hidden = true;
      input.blur();
    }
    if (event.key === 'Enter') {
      const firstResult = panel.querySelector('a');
      if (firstResult) {
        event.preventDefault();
        window.location.href = firstResult.href;
      }
    }
  });
  document.addEventListener('click', (event) => {
    if (!searchWrap?.contains(event.target)) panel.hidden = true;
  });
  panel.addEventListener('mousedown', (event) => {
    event.stopPropagation();
  });
});
