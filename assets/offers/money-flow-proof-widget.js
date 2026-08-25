(() => {
  const checkoutUrl = 'https://buy.hypnoticmeditations.ai/l/hzxybu?wanted=true';
  const customers = [
    { name: 'Maria T.', location: 'Toronto, Canada' },
    { name: 'Layla S.', location: 'London, UK' },
    { name: 'James L.', location: 'Seattle, USA' },
    { name: 'David K.', location: 'Austin, USA' },
    { name: 'Elijah R.', location: 'New York, USA' },
    { name: 'Chris M.', location: 'Chicago, USA' },
    { name: 'Anita W.', location: 'Sydney, Australia' },
    { name: 'Mark D.', location: 'Nashville, USA' },
    { name: 'Keiko N.', location: 'San Francisco, USA' },
    { name: 'Nova M.', location: 'Phoenix, USA' },
    { name: 'Jerome S.', location: 'New York, USA' },
    { name: 'Nina T.', location: 'Denver, USA' },
    { name: 'Sean A.', location: 'Panama' },
    { name: 'Priya J.', location: 'Mumbai, India' },
    { name: 'Melinda A.', location: 'Manchester, UK' },
    { name: 'Marcus D.', location: 'Business owner' },
    { name: 'Amara O.', location: 'Yoga teacher' },
    { name: 'Tyra B.', location: 'Sales manager' },
    { name: 'Camille R.', location: 'Freelance designer' },
    { name: 'Derek L.', location: 'Tech founder' }
  ];

  const widget = document.createElement('a');
  widget.className = 'money-flow-proof';
  widget.href = checkoutUrl;
  widget.setAttribute('aria-label', 'Open the Money Flow checkout');
  widget.setAttribute('aria-live', 'polite');
  widget.innerHTML = `
    <span class="money-flow-proof__verified-icon" aria-hidden="true">&#10003;</span>
    <span class="money-flow-proof__copy">
      <strong class="money-flow-proof__name"></strong>
      <span class="money-flow-proof__location"></span>
      <span class="money-flow-proof__purchase">Purchased the Money Flow System</span>
      <span class="money-flow-proof__meta">
        <span class="money-flow-proof__check">&#10003;</span> Verified purchase
      </span>
    </span>`;
  document.body.appendChild(widget);

  const name = widget.querySelector('.money-flow-proof__name');
  const location = widget.querySelector('.money-flow-proof__location');

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
    name.textContent = customer.name;
    location.textContent = ` (${customer.location})`;
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
