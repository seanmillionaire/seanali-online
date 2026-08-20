/* Stripe Checkout for the Millionaire Life Rehearsal unlock flow.
   Usage: GET /api/checkout?redirect=rehearsal-unlocked
   Env: STRIPE_SECRET_KEY (sk_test_... for now, $0 test price via PRICE lookup)
   On success returns a JSON redirect URL; the client navigates to it. */
import Stripe from 'stripe';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const SUCCESS_URL = process.env.UNLOCK_SUCCESS_URL ||
  'https://seanali.online/rehearsal-unlocked?session_id={CHECKOUT_SESSION_ID}';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const redirect = String(req.query?.redirect || 'rehearsal-unlocked');
  const successUrl = SUCCESS_URL.replace(
    'rehearsal-unlocked',
    redirect === 'rehearsal-unlocked' ? 'rehearsal-unlocked' : redirect,
  );
  const cancelUrl = 'https://seanali.online/rehearsal';

  if (!STRIPE_SECRET_KEY) {
    // No Stripe key configured yet: short-circuit straight to the unlocked
    // page so the flow still works while we wait for credentials.
    return res.status(200).json({ redirect: `https://seanali.online/${successUrl.split('/').pop().split('?')[0]}` });
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY);

  try {
    const prices = await stripe.prices.list({ active: true, limit: 100 });
    // Use the first $0 test price; otherwise create one on the fly.
    let priceId = null;
    const freePrice = prices.data.find(p => p.unit_amount === 0);
    if (freePrice) {
      priceId = freePrice.id;
    } else {
      const product = await stripe.products.create({
        name: 'Millionaire Life Rehearsal — Full Version',
        description: 'All 6 guided rehearsals and rapid state resets, unlocked.',
      });
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: 0,
        currency: 'usd',
      });
      priceId = price.id;
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { unlock: redirect, source: 'seanali-online' },
    });

    return res.status(200).json({ redirect: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return res.status(200).json({ redirect: `https://seanali.online/${successUrl.split('/').pop().split('?')[0]}` });
  }
}
