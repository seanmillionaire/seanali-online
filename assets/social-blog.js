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

document.querySelectorAll('[data-feed-search]').forEach((input) => {
  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();
    document.querySelectorAll('[data-feed-card]').forEach((card) => {
      card.hidden = query && !card.textContent.toLowerCase().includes(query);
    });
  });
});
