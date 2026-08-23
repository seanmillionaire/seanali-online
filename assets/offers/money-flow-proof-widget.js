(() => {
  const checkoutUrl = 'https://buy.hypnoticmeditations.ai/l/hzxybu?wanted=true';
  const customers = [
    { name: 'Maria T.', location: 'Toronto, Canada', quote: 'I slept straight through the first time I used Sleep Reset.' },
    { name: 'Layla S.', location: 'London, UK', quote: 'Now I am out in under 20 minutes. Life changer.' },
    { name: 'James L.', location: 'Seattle, USA', quote: 'Sleep Reset gave me my mornings back. I feel sharp again.' },
    { name: 'David K.', location: 'Austin, USA', quote: 'Two weeks later I raised my rate $50 an hour and the client did not even flinch.' },
    { name: 'Elijah R.', location: 'New York, USA', quote: 'Closed two new coaching clients the same week I started listening.' },
    { name: 'Chris M.', location: 'Chicago, USA', quote: 'I launched my course after sitting on it for eight months.' },
    { name: 'Anita W.', location: 'Sydney, Australia', quote: 'The Relax session is the first thing that actually changed something.' },
    { name: 'Mark D.', location: 'Nashville, USA', quote: 'Just press play. This $27 session did more for me in a week.' },
    { name: 'Keiko N.', location: 'San Francisco, USA', quote: 'After ten minutes of Night Anxiety Reset, I am calm.' },
    { name: 'Nova M.', location: 'Phoenix, USA', quote: 'Something inside me clicked. I asked for a raise and got it.' },
    { name: 'Jerome S.', location: 'New York, USA', quote: 'I thought it was all woo-woo. Then I got two new clients within days.' },
    { name: 'Nina T.', location: 'Denver, USA', quote: 'I felt confident, deserving, like the world finally saw me.' },
    { name: 'Sean A.', location: 'Panama', quote: 'These short hypnotic meditations are better than anything else I have tried.' },
    { name: 'Priya J.', location: 'Mumbai, India', quote: 'You have to try these meditations for yourself.' },
    { name: 'Melinda A.', location: 'Manchester, UK', quote: 'In a few minutes a day I can relax my mind on demand.' },
    { name: 'Marcus D.', location: 'Business owner', quote: 'Nothing moved the needle like these meditations.' },
    { name: 'Amara O.', location: 'Yoga teacher', quote: 'This is the first thing that changed my money relationship.' },
    { name: 'Tyra B.', location: 'Sales manager', quote: 'I started waking up ready to attack the day.' },
    { name: 'Camille R.', location: 'Freelance designer', quote: 'Now I have a tool I can use anywhere.' },
    { name: 'Derek L.', location: 'Tech founder', quote: 'I recommended it to my whole team.' }
  ];

  const widget = document.createElement('a');
  widget.className = 'money-flow-proof';
  widget.href = checkoutUrl;
  widget.setAttribute('aria-label', 'Open the Money Flow checkout');
  widget.setAttribute('aria-live', 'polite');
  widget.innerHTML = `
    <span class="money-flow-proof__avatar" aria-hidden="true"></span>
    <span class="money-flow-proof__copy">
      <strong class="money-flow-proof__name"></strong>
      <span class="money-flow-proof__location"></span>
      <span class="money-flow-proof__quote"></span>
      <span class="money-flow-proof__meta">
        <span class="money-flow-proof__stars" aria-label="5 out of 5 stars">★★★★★</span>
        <span class="money-flow-proof__check">●</span> Verified review
      </span>
    </span>`;
  document.body.appendChild(widget);

  const avatar = widget.querySelector('.money-flow-proof__avatar');
  const name = widget.querySelector('.money-flow-proof__name');
  const location = widget.querySelector('.money-flow-proof__location');
  const quote = widget.querySelector('.money-flow-proof__quote');

  function shuffle(items) {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
    }
    return result;
  }

  let queue = shuffle(customers);
  let index = 0;

  function showCustomer() {
    const customer = queue[index];
    avatar.textContent = customer.name
      .split(/\s+/)
      .map((part) => part.charAt(0))
      .join('')
      .slice(0, 2);
    name.textContent = customer.name;
    location.textContent = ` (${customer.location})`;
    quote.textContent = `“${customer.quote}”`;
    widget.classList.add('is-visible');

    window.setTimeout(() => {
      widget.classList.remove('is-visible');
      index += 1;
      if (index >= queue.length) {
        queue = shuffle(customers);
        index = 0;
      }
    }, 6500);
  }

  window.setTimeout(showCustomer, 2800);
  window.setInterval(showCustomer, 11000);
})();
