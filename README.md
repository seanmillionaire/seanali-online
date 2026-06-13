# SeanAli.online

Source code for [SeanAli.online](https://seanali.online), Sean Ali's personal brand, content, and AI Freedom System website.

The site is built to turn attention into subscribers and customers through direct-response pages, practical AI content, proof, and clear calls to action.

## About The Site

SeanAli.online positions Sean Ali as a direct-response marketer, media buyer, AI systems builder, and digital entrepreneur.

The main customer path is:

1. Discover Sean through useful content and social-style pages.
2. Learn how AI can help one operator move faster.
3. Explore the AI Freedom System.
4. Join through the connected Whop checkout.

## Technology

This is a static website built with:

- HTML
- CSS
- Vanilla JavaScript
- Google Fonts
- Externally hosted images and media

There is no framework, package manager, database, or build step.

## Main Files

- `index.html` - Main AI Freedom System landing page
- `system.html` - Long-form AI Freedom System sales page
- `story.html` - Sean's story and positioning
- `assets/social-blog.css` - Shared styling for the social and content pages
- `assets/social-blog.js` - Search, reactions, sharing, and other social-page interactions
- `assets/inside-afs.png` - AI Freedom System product preview

The repository also contains supporting content, lead-generation, offer, confirmation, and campaign pages.

## Run Locally

Because the site is static, you can open `index.html` directly in a browser.

For a more accurate local preview, run a simple web server from the repository folder:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Editing The Site

Most pages contain their own page-specific styles. Shared social and blog pages use the files inside `assets/`.

When making changes:

- Keep the site mobile-first.
- Preserve existing checkout URLs unless the offer itself changes.
- Preserve Meta Pixel and other tracking code.
- Preserve the Respond.io customer chat widget.
- Keep calls to action large, clear, and easy to find.
- Use direct-response structure: promise, proof, offer, and action.
- Check links and repeated calls to action across the full page.

## Offers And External Services

The site connects to third-party services for key business functions:

- Whop for AI Freedom System checkout and access
- Meta Pixel for advertising measurement
- Respond.io for customer messaging
- Bunny CDN and other hosted sources for images
- Google Fonts for typography

These integrations are embedded directly in the HTML. No API keys or local environment variables are required to preview the site.

## Deployment

The repository can be deployed to any static hosting provider.

A deployment should serve `index.html` at the root and preserve the existing `.html` page paths and `assets/` directory.

Before publishing, verify:

- The homepage loads correctly on mobile and desktop.
- Internal page links work.
- Checkout buttons point to the intended live offers.
- Images and externally hosted assets load.
- Tracking scripts remain present.
- The Respond.io widget loads.

## Live Site

[https://seanali.online](https://seanali.online)

## Repository

[https://github.com/seanmillionaire/seanali-online](https://github.com/seanmillionaire/seanali-online)

## Copyright

Copyright Sean Ali. All rights reserved.
