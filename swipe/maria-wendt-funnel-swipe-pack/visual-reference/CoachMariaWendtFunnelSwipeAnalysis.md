# Coach Maria Wendt Funnel Swipe Analysis

**Prepared for:** King Ali  
**Prepared by:** Manus AI  
**Review date:** August 22, 2026  
**Sources reviewed:** the two supplied landing pages and the public Meta Ad Library listing for Maria Wendt Official.

> **Purpose.** This is a reference swipe file and conversion teardown. It documents what is observable on the live pages, explains why the architecture is suited to direct-response traffic, and separates verified page evidence from strategic inference. It is not an independent verification of revenue, student outcomes, ad spend, ROAS, or profitability.

## 1. Executive diagnosis

The two pages use a direct-to-checkout, low-ticket architecture designed to convert cold or lightly aware traffic without requiring an opt-in, a long application, or a visible sales call. The first page sells one broad transformation—starting and scaling a digital-products business—for **$27**. The second page sells a stack of eight Instagram products for **$8 total**, using low entry price, visual abundance, and two outcome routes: visitors who want more sales and visitors who want more followers. Both pages send every visible CTA directly to a SamCart product checkout rather than to a lead-capture page.[1] [2]

The strongest conversion idea is **message continuity**. The ad-library examples use the same hooks the Instagram page uses: “$1 Instagram courses,” “8 Instagram courses for just $8,” beginner-friendly growth and sales, and Maria’s follower-count authority. This creates a plausible ad-to-page match: the visitor sees a simple, concrete offer in the ad and lands on a page that repeats the same promise, price, mechanism, and proof.[2] [3]

The pages are not sophisticated because they hide the offer. They are effective because they make the offer obvious very quickly. The recurring pattern is: **large outcome headline → product collage → numerical authority → simple benefits → visible CTA → proof or course stack → another visible CTA**. There is no visible form friction on either page, no visible quiz, and no visible application step. The HTML snapshots contain zero forms and one iframe on each page; the primary action is an external SamCart checkout anchor.[1] [2]

### The swipe in one page

| Swipe layer | What to reproduce | Why it matters |
|---|---|---|
| Traffic promise | Repeat the ad’s plain-language promise in the first headline and CTA | Prevents the visitor from having to reinterpret the offer after the click |
| Tangible package | Show a product mockup, bundle collage, screenshots, or named deliverables above the fold | Makes an intangible digital offer feel real and inspectable |
| Authority | Use one specific, source-supported creator proof point | Establishes a reason to believe before the visitor reads the full stack |
| Mechanism | Name the actions, tools, or steps the buyer will copy | Converts aspiration into a believable process |
| Friction removal | Answer time, technology, beginner, and complexity objections | Reduces the reasons to delay checkout |
| Value architecture | For one product, emphasize one transformation; for a bundle, show named components and anchor values | Prevents either vagueness or choice overload |
| Goal routing | If the bundle serves multiple intents, group the products by desired outcome | Lets different buyers see their own path without splitting the checkout |
| Proof sequence | Place visual proof after the offer explanation and repeat the CTA immediately afterward | Gives the visitor a natural point to act while belief is highest |
| Measurement | Use one checkout destination and consistent tracking across CTAs | Simplifies attribution and reduces broken-path risk |

The most reusable version of this structure is therefore not a clone of Maria Wendt’s claims or design. It is a **message-matched, low-friction offer page** in which every section answers one buyer question: what is it, will it work for someone like me, what exactly do I get, why should I believe it, and what do I do now?

## 2. Funnel snapshot

| Dimension | Make Money Selling Digital Products | Ultimate Instagram Course Bundle |
|---|---|---|
| Primary audience | A beginner or aspiring creator who wants to sell digital products | An Instagram user who wants more sales, more followers, or both |
| Primary promise | Learn how to make money selling digital products | Get eight Instagram courses teaching growth and monetization |
| Entry price shown | $27 | $8 for the bundle; component sections repeatedly frame individual courses as $1 today |
| Core mechanism | Tutorial-style walkthrough, niche/product selection, roadmap, simple automations, minimal tech | Eight tactical trainings covering sales, Stories, Manychat, hooks, follower ads, Trial Reels, follower challenge, and batch content |
| Main authority | $850k/month, 4,000 digital products per month, over $15M total | $800k/month, 800K followers, over $7M in Instagram sales, $11,077/day |
| Primary proof style | Revenue dashboards and a student-income claim with disclaimer | Instagram profile/dashboard screenshots, product mockups, student-love claim, and public ad repetition |
| CTA count in HTML snapshot | 3 visible button anchors | 6 primary button anchors plus one legacy/secondary empty-text SamCart anchor |
| Checkout destination | `mariawendt.samcart.com/products/make-money-selling-digital-products` | `mariawendt.samcart.com/products/get-paid-with-instagram-maria-wendts-ultimate-instagram-course-bundle` |
| Forms | None observed | None observed |
| Iframes | 1 observed | 1 observed |
| Page-builder structure | 12 `lp-pom-block` elements, 17 `lp-pom-text` elements, 2 boxes | 36 `lp-pom-block` elements, 48 `lp-pom-text` elements |
| Dominant visual language | White, pale pink, pale mint, magenta text, green CTA buttons | Pale pink, pale blue, white, magenta CTA buttons, blue CTA buttons, blue check icons |

## 3. Page one: Make Money Selling Digital Products

### 3.1 Offer positioning

The page positions the product as a simple, tutorial-led path into digital products. It does not lead with a complicated business model, a named proprietary framework, or an extensive curriculum table. Instead, it promises a complete walkthrough from a person who claims to make **$850k a month**, then immediately places the product mockup and a checkout CTA beside the promise.[1]

The offer is deliberately broad enough to catch multiple beginner intents. The visitor may want to choose a product, find a niche, make a first sale, scale sales, automate the work, or avoid technical setup. The page places all of those desires inside one inexpensive course rather than asking the visitor to self-select between several products.

### 3.2 Section-by-section map

| Order | Observable section | Exact or near-exact page language | Conversion job | Visual / layout notes |
|---:|---|---|---|---|
| 1 | Footer/legal text is present in the DOM | “Privacy Policy,” “Shipping Policy,” “Return Policy,” “Terms of Use,” copyright 2026, Facebook non-endorsement disclaimer | Establishes basic legal coverage and reduces platform-relationship ambiguity | The legal copy is present but not the primary visual focus |
| 2 | Brand mark | “Maria” signature logo | Establishes personal-brand recognition | Centered above the hero |
| 3 | Hero headline | “Make Money Selling Digital Products” | States the desired outcome in plain language | Large display headline in magenta; right side of a two-column hero |
| 4 | Hero subhead | “In this course, I give you a complete step-by-step walkthrough of how to make money selling digital products, from someone who makes $850k a month (proof below).” | Combines completeness, specific topic, authority, and an open loop toward proof | Centered paragraph beneath the headline |
| 5 | Hero product visual | Course / digital-products mockup with a video thumbnail | Makes the intangible course feel like a concrete product | Large collage on the left; the video thumbnail contains a visible play icon |
| 6 | Hero CTA | “I'M READY TO LEARN THIS! [$27]” | Converts the visitor before they need to read the full page | Green button; links directly to the SamCart checkout |
| 7 | First content promise | “a complete tutorial-style walkthrough of how to start making money with digital products” | Reassures the beginner that the product is step-by-step, not abstract theory | Large supporting copy with selected phrases emphasized |
| 8 | Product-selection promise | Guidance on choosing “the right digital product” to create so it will go viral; “Getting this part wrong is why 98% of digital products never sell.” | Agitates the cost of choosing the wrong offer and presents product selection as a key mechanism | Bold/magenta emphasis on “right digital product” |
| 9 | Scaling promise | “best practices for scaling your digital product sales” and “I sell over 4,000 digital products every single month!” | Adds operational proof and moves the promise beyond a single first sale | Authority is embedded in the benefit line rather than isolated in a testimonial |
| 10 | First-sale roadmap | “a detailed roadmap that shows you exactly how to get your very first sale” and then “quickly ramp up to dozens of sales a day” | Gives the visitor a sequence: first sale first, scale second | Uses a future-state progression to reduce perceived ambiguity |
| 11 | Niche-selection promise | Instructions on how to “pick a profitable niche” | Addresses the fear of building for the wrong market | Emphasis is placed on “profitable niche” |
| 12 | Price anchor | “Price: $27” | Makes the decision concrete and keeps the offer low-friction | Price appears inside the offer content rather than only inside the CTA |
| 13 | Automation promise | “also included are my simple automations that you can copy to do most of the work for you” and “you only need about 1.5 hrs a day” | Reduces the time and labor objection | The automation promise is visually emphasized in bold |
| 14 | Product visual repetition | Repeated digital-product / course mockups | Turns the abstract promises into a tangible package | Several repeated image elements appear in the HTML; visual repetition reinforces product reality |
| 15 | “What’s Included” transition | “What's Included:” | Signals that the page is moving from promise to package detail | Visually separated section with a product image above a white content card |
| 16 | Tech-friction removal | “very minimal and simple tech” and “no website, Etsy store, or fancy camera equipment required!” | Removes common beginner objections before checkout | Uses green check-style visual treatment and magenta emphasis |
| 17 | Mid-page CTA | “THIS IS SO HELPFUL, I NEED THIS!” | Converts an emotionally persuaded reader without making them return to the top | Green CTA linking to the same SamCart product |
| 18 | Category breadth | “I sell courses, templates, scripts, ebooks, pdf bundles, audio files, & digital tools. This $27 course shows you how.” | Expands the perceived applicability of the course and explains what “digital products” can include | Centered paragraph before the final CTA |
| 19 | Final CTA before proof | “I'M READY TO GET STARTED!” | Captures visitors who need the offer restated in plain action language | Large green button |
| 20 | Seller revenue proof | “Last month, I made over $850k selling digital products:” | Turns the authority claim into a proof section | Pale pink band; large magenta headline; revenue screenshots occupy most of the visual attention |
| 21 | Student-result claim | “My average student who completed and implemented this course made $2,309.59 in their first 24 days!” | Transfers the promise from the creator to students | Presented as a headline-like result followed by a detailed disclaimer |
| 22 | Student-result disclaimer | Results vary; the figure is described as the average income of 20 randomly selected students who completed, implemented, and put in consistent effort | Attempts to qualify the numerical result and reduce overclaiming | The disclaimer is visible as small explanatory copy below the claim |
| 23 | Lifetime proof | “And over $15M total:” | Adds a cumulative authority layer after the recent-month proof | Another revenue dashboard / year-by-year bar-chart visual |
| 24 | Closing state | No visible FAQ, guarantee, qualification block, or additional testimonial copy was present in the extracted page text | Leaves the final persuasion burden on the revenue screenshots and low price | The page is short relative to a typical long-form VSL page |

### 3.3 Page-one copy architecture

The copy sequence is a **beginner-objection ladder**. It first answers “What is this?” with the direct title. It then answers “Can someone show me exactly how?” with “complete step-by-step walkthrough.” It answers “Will I choose the right thing?” with product and niche guidance. It answers “Can this scale?” with 4,000 products per month and dozens of sales per day. It answers “Will this take over my life?” with simple automations and approximately 1.5 hours per day. It answers “Do I need expensive setup?” with the no-website, no-Etsy, no-fancy-camera statement. Finally, it answers “Is this real?” with revenue screenshots and a student-result claim.[1]

The page uses **specificity as persuasion**. “$27,” “$850k,” “4,000 digital products,” “1.5 hrs a day,” “$2,309.59,” “24 days,” “20 randomly selected students,” and “over $15M total” are more concrete than generic claims such as “build freedom” or “grow your business.” The numerical specificity gives the page a measurable feel, even though the underlying claims still require independent substantiation.

### 3.4 Visual and technical observations

The visual system is high-contrast but simple: white hero, pale pink proof area, pale mint transition, magenta headline emphasis, and green CTAs. The page uses a clean two-column hero and then returns to centered, single-column sections. The HTML uses `lp-pom-*` IDs, which suggests a landing-page-builder export or template convention rather than a custom application. The snapshot contained 12 page blocks, 17 text elements, 3 CTA button elements, 1 iframe, 0 forms, and 9 external script tags.[1]

All three visible CTA anchors point to the same checkout destination: `https://mariawendt.samcart.com/products/make-money-selling-digital-products`. There is no visible email capture before checkout. The page source contains a Meta Pixel initialization with ID `373941417743718`, a PageView event, and Google Tag Manager container `GTM-TH6PTCM`. Those are observable measurement signals; they do not reveal campaign spend or performance.[1]

### 3.5 Page-one proof audit

The first revenue section contains a dashboard screenshot where the visible image shows figures including approximately **$759,865.25**, **$93,059.18 total sales**, and **$93,031.50 net sales** in the displayed panels. The headline above it says “over $850k” for last month. The lifetime graphic visibly shows approximately **$15,094,421.92** and a year-by-year revenue chart. These are observations of the screenshots, not independently verified financial statements.[1]

The most important proof risk is visual consistency. A skeptical visitor may compare the headline claim with the dashboard values and wonder whether they refer to different periods, stores, accounts, or revenue definitions. The page does not explain that relationship in the visible copy. A stronger version would label every screenshot with date range, gross/net definition, account scope, and whether the headline is an aggregate across multiple products or channels.

## 4. Page two: Get Paid With Instagram

### 4.1 Offer positioning

The Instagram page uses a **bundle-value mechanism**. It gives the visitor a large visual catalog, names eight distinct products, displays individual anchor prices in the course breakdown, and asks for only **$8 total**. The page also organizes the products by the visitor’s immediate goal: “If you want more sales from Instagram…” or “If you want more followers on Instagram…”. This is a strong way to preserve a broad bundle while giving each visitor a more personally relevant path.[2]

The bundle is also highly aligned with the public ads found in Meta Ad Library. The visible ad messages repeatedly use “$1 Instagram courses,” “8 Instagram courses for just $8,” “starting from 0,” the 700K/800K follower authority angle, and a list of the same eight products. The page therefore appears to be built as a direct landing destination for ad concepts that have already been simplified into one dominant offer message.[3]

### 4.2 Section-by-section map

| Order | Observable section | Exact or near-exact page language | Conversion job | Visual / layout notes |
|---:|---|---|---|---|
| 1 | Legal footer copy | Privacy, shipping, return, terms, copyright 2026, Facebook non-endorsement disclaimer | Basic legal and platform disclosure | Present in the DOM rather than featured in the hero |
| 2 | Brand mark | “Maria” signature logo | Personal-brand recognition | Centered above the hero |
| 3 | Hero title | “Get Paid With Instagram:” with subtitle “Maria Wendt’s Ultimate Instagram Course Bundle” | Names the platform, outcome, and package | Large magenta headline on pale pink background |
| 4 | Hero catalog visual | Numbered collage representing the eight products | Makes the bundle feel large and concrete | Oversized collage dominates the first viewport |
| 5 | First CTA | “UNLOCK 8 INSTAGRAM COURSES! [$8]” | Converts immediately after the visual value signal | Saturated magenta button; direct SamCart link |
| 6 | Core course promise | “complete step-by-step tutorials on how to use Instagram to sell digital products & services in 2026” from someone who makes $800k/month; “Just copy my exact, simple funnel for your Instagram.” | Combines topical timeliness, authority, and ease of implementation | The first course is positioned as the broad entry point |
| 7 | Component anchor language | `$37` and “Today’s Price: $1!” | Makes the $8 bundle feel like an aggregation of cheap, individually valuable products | Repeated at component level; the relationship between $1 components and the $8 total should be clarified |
| 8 | “What’s included?” prompt | “What’s included?” | Moves the visitor into the value stack | Short transition before CTA and benefits |
| 9 | Benefit stack | Content growth, automations, Stories sales, hooks/captions, exact funnel, simple ads, batch content, Trial Reels | Gives multiple entry points for different Instagram problems | Eight benefits are arranged as check-mark items |
| 10 | Second CTA | “UNLOCK 8 IG COURSES FOR $8!” | Converts after the benefit summary | Magenta CTA in the same section |
| 11 | Expansion line | “...and so much more!” | Prevents the list from feeling limited to only eight bullets | Large transition headline |
| 12 | Outcome route prompt | “If you want more sales from Instagram, focus on these courses:” | Reduces choice overload by grouping products around a goal | Pale blue section with visual tiles |
| 13 | Scroll instruction | “Keep scrolling to see a breakdown of each of the 8 courses” | Keeps the visitor engaged rather than forcing an immediate decision | Down-arrow instruction bridges the sections |
| 14 | Social proof lead-in | “1000s of students LOVE the Instagram courses included in this bundle!” and “Here’s what a few have to say...” | Uses volume-based proof before detailed course breakdown | Testimonial visuals are present, though extracted text does not include names or quote detail |
| 15 | Mid-page CTA | “UNLOCK THIS IG COURSE BUNDLE! [$8]” | Captures visitors persuaded by social proof | Direct checkout button |
| 16 | Authority statement | Strategies used to scale to 800K followers and over $7M in Instagram sales | Connects the bundle to creator-specific experience | Italic/bold emphasis over a visual proof band |
| 17 | Proof / revenue statement | “Because I know how to leverage Instagram to make money, I make $11,077 every single day.” | Gives a daily-income anchor and makes the authority personal | Pale blue background, Instagram profile screenshot and revenue chart composition |
| 18 | Bundle explanation | “For the first time ever, I put together all my best Instagram strategies into one big bundle...” | Frames the offer as an event or release rather than a random collection | Followed by another magenta CTA |
| 19 | Sales route tiles | Selling With Instagram Stories; How To Sell Your Products & Services On Instagram; Sales Around The Clock: How To Use Manychat For Sales | Gives the visitor a sales-specific mini curriculum | Three visual product tiles on a pale blue band |
| 20 | Sales route CTA | “I NEED THESE COURSES! [$8]” | Converts after the sales-specific route | Blue CTA, distinct from the magenta global CTAs |
| 21 | Follower route prompt | “If you want more followers on Instagram, focus on these courses:” | Provides a second personalized route | Pale pink section with five visual tiles |
| 22 | Follower route tiles | 1,095 Hooks; $5/Day Follower Ads; Trial Reels; batch-created Reels; 1K Followers in 30 Days | Gives a growth-specific mini curriculum | Visual mockups do much of the persuasion |
| 23 | Follower route CTA | “I NEED THESE COURSES! [$8]” | Converts after the second outcome route | Large magenta CTA closes the route |
| 24 | Course 2 | “Selling With Instagram Stories”; reveals Maria’s entire Story funnel and how she gets the most sales from every Story viewer; `$37` / “Today’s Price: $1!” | Sells a specific sales mechanism inside the bundle | Course mockup plus outcome-led description |
| 25 | Course 3 | “Sales Around The Clock: How To Use Manychat For Sales”; step-by-step automated sales system; goal of first automated sale within 24 hours; `$37` / “Today’s Price: $1!” | Adds automation and speed-to-result | Manychat is named directly, increasing mechanism specificity |
| 26 | Course 4 | “1,095 Viral Pre-Written Instagram Hooks”; proven hooks; `$57` / “Today’s Price: $1!” | Converts the blank-page problem into a ready-to-use asset | Template-pack framing makes the value tangible |
| 27 | Course 5 | “Instagram Follower Fast-Track: Simple $5/Day Follower Ads”; duplicate the funnel, attract ideal followers on autopilot, no ad experience needed; `$67` / “Today’s Price: $1!” | Makes paid acquisition feel affordable and beginner-accessible | The ad dashboard / follower visual reinforces the mechanism |
| 28 | Course 6 | “Trial Reels: How We Get 120+ Extra Followers A Day”; says Trial Reels are being boosted and take about five minutes to post; `$67` / “Today’s Price: $1!” | Uses current-platform opportunity and low effort | Creates urgency around a changing algorithm without showing a countdown |
| 29 | Course 7 | “The 1K Instagram Followers In 30 Days Challenge”; average completed student got 742 new followers, many got 10,000 or more; `$27` / “Today’s Price: $1!” | Adds a challenge structure and numerical outcome | Challenge mockup supplies a concrete visual product |
| 30 | Course 8 | “Insta-Ready: How I Batch Create 40 Reels In 2 Hours”; creates quality Reels quickly; `$27` / “Today’s Price: $1!” | Solves consistency and content-volume friction | Product imagery shows batches of content |
| 31 | Closing claim | “If you have 100+ followers, you should be making $50-$100 per DAY. These courses will show you how!” | Ends on an earnings-based implication and returns to the core monetization promise | The extracted page text ends here; no visible guarantee or FAQ was captured |

### 4.3 Page-two copy architecture

The page is organized around **value stacking plus goal routing**. The bundle is first presented as one large object. The benefit list then gives the visitor multiple reasons to care. The “more sales” route speaks to monetization through Stories, the main Instagram sales course, and Manychat. The “more followers” route speaks to reach through hooks, follower ads, Trial Reels, batch content, and the 30-day challenge. The full course breakdown then validates that the bundle is not merely a headline; it contains named products with distinct mechanisms.[2]

The copy repeatedly uses **implementation language**: “copy my exact, simple funnel,” “duplicate my simple $5/day… funnel,” “step-by-step,” “no ad experience needed,” “takes me literally 5 minutes,” and “batch create 40 Reels in 2 hours.” This is important for cold traffic because it turns an aspirational outcome into a set of observable actions.

### 4.4 Bundle economics visible on the page

The eight component prices shown in the course breakdown are $37, $37, $57, $67, $67, $27, and $27, with the first broad Instagram course also presented at $37. The visible list-price total is therefore **$356**. Against an $8 bundle price, the implied discount is approximately **97.76%**, and the bundle price is **44.5 times lower** than the sum of the displayed component prices. These are arithmetic calculations based only on the prices shown on the page; they do not establish whether each product is normally sold at those prices or whether the $8 offer is recurring, temporary, or one-time.[2]

| Visible value element | Amount / implication |
|---|---:|
| Displayed component-price total | $356 |
| Bundle price | $8 |
| Implied savings | $348 |
| Implied discount | 97.76% |
| Displayed component value multiple | 44.5× the bundle price |
| Per-course bundle-equivalent price | $1 on average, mathematically $8 ÷ 8 |

### 4.5 Visual and technical observations

The second page is more visually dense than the first. The hero uses a numbered eight-product collage; the authority section combines an Instagram profile screenshot with a revenue graph; the benefit section uses blue check icons; and the outcome routes use product tiles as navigation aids. The dominant colors are pale pink, pale blue, white, magenta, and blue. The snapshot contained 36 page blocks, 48 text elements, 6 primary CTA button elements, 1 iframe, 0 forms, and 8 external script tags.[2]

Five CTA button texts are repeated across the page, but every primary button routes to the same SamCart product: `https://mariawendt.samcart.com/products/get-paid-with-instagram-maria-wendts-ultimate-instagram-course-bundle`. The HTML also contained an empty-text link to `https://mariawendt.samcart.com/products/instagram-bundle`, which looks like a legacy or secondary route and should be checked for accidental dead-path behavior.[2]

The source contains the same observable Meta Pixel ID `373941417743718`, a PageView event, and Google Tag Manager container `GTM-TH6PTCM`. The checkout link is repeated throughout the page, which is useful for direct-response attribution because the click event can be associated with the same product destination regardless of which CTA the visitor uses.[2]

## 5. Ad-to-page alignment

The public Meta Ad Library listing for “Maria Wendt Official” showed approximately **200 results** under active ads at the time of review. Several visible ads use the same $8 Instagram bundle and $1-per-course framing found on the landing page. The listing included examples such as “These $1 Instagram courses will help you FINALLY grow and sell on IG,” “Get 8 Instagram courses for just $8 total,” “In case you missed it earlier, I’m offering 8 Instagram courses for $8,” and “These are the 8 courses I WISH I had when I was first starting out.” It also displayed ads that listed the same eight products in ad copy.[3]

The ad listing showed active ads with start dates including **February 19, 2026; May 7, 2026; May 29, 2026; June 3, 2026; June 13, 2026; July 7, 2026; July 10, 2026; July 11, 2026; July 14, 2026; and July 15, 2026**, among others. This is evidence of repeated public advertising activity around the offer. It is not evidence of the amount spent, the number of conversions, or the profitability of the campaigns.[3]

| Ad-library observation | Matching landing-page element | Strategic meaning |
|---|---|---|
| “$1 Instagram courses” | Component sections show “Today’s Price: $1!” | Strong price-message continuity |
| “8 Instagram courses for just $8 total” | Repeated $8 CTA buttons and hero offer | The visitor lands on the same simple proposition |
| “Starting from 0” / beginner angle | Copy emphasizes simple, step-by-step tutorials and no ad experience needed | Reduces intimidation for cold beginners |
| 700K / 800K follower authority | Page uses 800K followers; ads use both 700K and 800K variants | Authority is central, but the count should be kept fresh and consistent |
| Same eight-course list in ads | Same eight named products on the page | The ad pre-sells the bundle and makes the landing page a confirmation page |
| Comment-based ad calls to action such as “BUNDLE” | Landing page has direct checkout CTAs | The ad can use engagement-oriented creative while the page completes the transaction |

## 6. Why the direct-to-page model likely converts

### 6.1 The offer is understandable in seconds

Both pages lead with a topic and desired outcome that a visitor can repeat back immediately. There is no need to decode a brand concept. The first page is “make money selling digital products.” The second is “get paid with Instagram” and “eight courses for $8.” Clear propositions are especially important when paid traffic is interruptive and the visitor has not volunteered an email address.[1] [2]

### 6.2 The price is low enough to support an impulse decision

The $27 and $8 entry points reduce the psychological and financial friction of trying the offer. That does not make the offer automatically profitable; it simply makes a direct checkout path more plausible than a high-ticket application path. The $8 bundle also creates a strong contrast between the displayed component prices and the bundle price.[2]

### 6.3 Visual product proof replaces abstract curriculum explanation

The pages show product mockups, screenshots, Instagram profiles, dashboards, course tiles, and numbered bundle components. This gives a cold visitor something to inspect before buying. Product imagery also allows the page to communicate volume and legitimacy without paragraphs of explanation.[1] [2]

### 6.4 Numerical specificity creates a proof ladder

The pages do not rely on one claim. They stack creator income, product volume, follower count, Instagram sales, daily income, student outcomes, and lifetime totals. The strategy is to create several independent-looking reasons to believe the creator has a working system. The weakness is that every number increases the burden of proof; if date ranges or definitions are unclear, numerical abundance can create skepticism instead of trust.[1] [2]

### 6.5 Page two turns one broad offer into two personally relevant paths

The Instagram page avoids forcing every visitor to understand all eight products equally. Sales-oriented visitors receive a sales route. Follower-oriented visitors receive a growth route. This is a lightweight form of segmentation without a quiz or additional funnel step.[2]

### 6.6 The page sells speed and simplicity, not just information

“Copy my exact funnel,” “no ad experience needed,” “takes me literally 5 minutes,” “40 Reels in 2 hours,” and “first automated sale within 24 hours” all imply reduced implementation time. This matters because the visitor is not only buying knowledge; they are buying relief from figuring out the process alone.[2]

### 6.7 The repeated CTA reduces the cost of acting at the moment of desire

Every major section is followed by a CTA or a visual decision point. A visitor does not need to scroll back to the hero after becoming persuaded by proof or a course tile. All routes lead to the same checkout, which keeps the action simple.[1] [2]

## 7. What should be swiped—and what should not be copied blindly

| Swipe this mechanism | Do not copy without proof or clarification |
|---|---|
| A one-sentence offer that names the audience problem and desired outcome | Revenue, follower, student, or “viral” claims that cannot be substantiated |
| One dominant CTA destination repeated after major decision points | Multiple checkout URLs unless the routing and attribution are intentionally different |
| Product mockups and screenshots that make a digital product tangible | Screenshots whose date ranges, gross/net definitions, or account scope are ambiguous |
| Outcome-based grouping for a broad bundle | A large bundle with no explanation of how the products fit together |
| Beginner-friendly friction removers | “No experience needed” promises if the implementation actually requires advanced skills |
| Specific, tactical mechanisms | Trend-dependent claims such as algorithm boosts without current evidence |
| A low-ticket price that supports direct checkout | An $8/$1 offer if fulfillment, support, payment fees, refunds, and upsell economics do not work |
| Short benefit lines with concrete actions | Generic “transform your life” language that cannot be connected to a deliverable |
| Explicit disclaimer language near outcome claims | Hidden or tiny disclaimers that create compliance or trust risk |

## 8. Recommended swipe templates for a new funnel

### 8.1 Single-product direct-to-checkout page

**Hero:** use a direct outcome headline, one sentence explaining the mechanism, a concrete product visual, and a CTA that includes the price. Follow with a short section that states what the buyer will learn or receive. Then remove the three biggest objections: technical complexity, time requirement, and uncertainty about the first step.

**Proof:** show creator proof only if it is source-supported and label the date range and measurement definition. Add student proof only when the quote, attribution, product relevance, and results conditions are exact. Place the offer price and the checkout CTA immediately after the proof rather than making the visitor search for the decision.

**Close:** include the guarantee, refund policy, access timing, FAQ, and a final CTA if those terms are actually part of the offer. The reviewed first page would be stronger with a visible guarantee or access clarification if one exists on the checkout but not on the page.

### 8.2 Bundle direct-to-checkout page

**Hero:** show the bundle as a collection of named deliverables. State the bundle price immediately. If the offer uses individual anchor prices, show the total value and explain whether “$1 each” is simply a bundle-equivalent calculation or a separate individual-purchase offer.

**Routing:** group the contents by desired outcome, just as the Instagram page does with sales and follower growth. Keep the groups mutually understandable: a visitor should know which section to read first without believing they are choosing only one part of the bundle.

**Stack:** give every component a name, one-sentence result, mechanism, visual, anchor price, and bundle-equivalent price. Finish the stack with a single CTA destination, a clear access statement, a guarantee if offered, and a concise FAQ.

## 9. Test plan inspired by the observed funnel

| Test | Control | Variant | Primary metric | Reason to test |
|---|---|---|---|---|
| Message match | Generic ad-to-page headline | Exact ad hook repeated in hero headline | Checkout-start rate | The Instagram ads and page already suggest strong message continuity |
| Hero price visibility | Price only inside CTA | Price plus one-line value anchor above CTA | CTA click rate | Determines whether price transparency helps or hurts cold traffic |
| Proof labeling | Dashboard screenshot with minimal label | Same screenshot with date range, gross/net, and account scope | Scroll depth and checkout conversion | Clarity may improve trust even if the screenshot feels less dramatic |
| Route-first layout | General bundle benefits first | Sales/follower split immediately below hero | Section engagement and checkout rate | Tests whether segmentation reduces choice overload |
| CTA language | “Unlock” | “See exactly how to…” or “Get the full bundle” | CTA click-through rate | Separates action framing from access framing |
| Bundle anchor | Individual prices only | Individual prices plus $356 total and $8 today price | Purchase conversion and refund rate | Makes the economic contrast explicit while testing skepticism |
| Proof type | Creator revenue proof | Creator proof plus one exact student case | Conversion rate | Tests whether creator authority alone is sufficient |
| Checkout destination | Single SamCart product link | Same link with tracked campaign parameters | Attribution quality and ROAS | Keeps the funnel simple while improving measurement |

## 10. Risks, inconsistencies, and QA checklist

### 10.1 Offer clarity risks

The Instagram page shows component-level “Today’s Price: $1!” language while the overall CTA says **$8**. This is understandable as a bundle-equivalent framing, but the page should explicitly say “Eight courses for $8 total—about $1 per course” to eliminate any uncertainty about whether the visitor is buying one course for $1 or eight courses for $8.[2]

The first page says the creator made over $850k last month, while the visible screenshot includes a dashboard value of approximately $759,865.25 and another panel around $93,059.18. Those values may represent different periods or revenue definitions, but the page does not explain the relationship in the visible copy. Labeling the screenshots would improve credibility.[1]

The Meta Ad Library listing uses both **700K** and **800K** follower variants, while the landing page uses 800K. This may simply reflect campaign timing, but stale or inconsistent authority numbers should be refreshed so the ad and page tell the same story.[2] [3]

### 10.2 Missing or weakly visible conversion elements

The extracted page text for both pages did not show a visible guarantee, access timing, FAQ, or strong final reassurance section. That does not prove those elements are absent from the checkout or hidden in an unextracted component, but it means they are not part of the obvious landing-page persuasion sequence. For a direct-to-checkout funnel, the page should answer “What do I get immediately?”, “How do I access it?”, “What happens if it is not for me?”, and “Is this for beginners?” before the final CTA.

The Instagram page appears to use a legacy or secondary SamCart link, `https://mariawendt.samcart.com/products/instagram-bundle`, in addition to the main bundle destination. The empty-text link should be checked so that old tracking or checkout paths are not accidentally exposed.[2]

### 10.3 Compliance and trust considerations

The page includes a Facebook non-endorsement disclaimer and a results-vary disclaimer. That is useful, but disclosures should remain close enough to the relevant claim that a reasonable visitor can understand the qualification. Any future swipe should use only real proof, avoid fabricated testimonials, avoid implying guaranteed income, and clarify whether claims are gross revenue, net revenue, revenue across multiple products, or a specific storefront.[1] [2]

## 11. Reference screenshots

The following screenshots were captured during review and are included with this document:

![Page 1 hero](https://private-us-east-1.manuscdn.com/sessionFile/aJNLHB2b0Wfa3n4iEwe2nv/sandbox/VMroMVFBBUjP5vpa2L36or-images_1787446938171_na1fn_L2hvbWUvdWJ1bnR1L2Z1bm5lbF9zd2lwZV9yZWZlcmVuY2UvYXNzZXRzL3BhZ2UxX2hlcm8.webp?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvYUpOTEhCMmIwV2ZhM240aUV3ZTJudi9zYW5kYm94L1ZNcm9NVkZCQlVqUDV2cGEyTDM2b3ItaW1hZ2VzXzE3ODc0NDY5MzgxNzFfbmExZm5fTDJodmJXVXZkV0oxYm5SMUwyWjFibTVsYkY5emQybHdaVjl5WldabGNtVnVZMlV2WVhOelpYUnpMM0JoWjJVeFgyaGxjbTgud2VicCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc4OTQzMDQwMH19fV19&Key-Pair-Id=K2QY5QTL8JSY6C&Signature=MEQCIBcFFYYsg4ANP6sJdyyhHx1bNA9JzP17Uwnc3UY5LYlnAiAhVd-Sm4nTdhhqprn~o2Q5wGfC5Yi-4-6fPJ74YSO7og__)

*Page 1 hero: product collage, direct promise, and $27 CTA.*

![Page 1 proof](https://private-us-east-1.manuscdn.com/sessionFile/aJNLHB2b0Wfa3n4iEwe2nv/sandbox/VMroMVFBBUjP5vpa2L36or-images_1787446938171_na1fn_L2hvbWUvdWJ1bnR1L2Z1bm5lbF9zd2lwZV9yZWZlcmVuY2UvYXNzZXRzL3BhZ2UxX3Byb29m.webp?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvYUpOTEhCMmIwV2ZhM240aUV3ZTJudi9zYW5kYm94L1ZNcm9NVkZCQlVqUDV2cGEyTDM2b3ItaW1hZ2VzXzE3ODc0NDY5MzgxNzFfbmExZm5fTDJodmJXVXZkV0oxYm5SMUwyWjFibTVsYkY5emQybHdaVjl5WldabGNtVnVZMlV2WVhOelpYUnpMM0JoWjJVeFgzQnliMjltLndlYnAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3ODk0MzA0MDB9fX1dfQ__&Key-Pair-Id=K2QY5QTL8JSY6C&Signature=MEUCIQCIibt3hKOob3ERalJZTG8MT0IwTTHn0KK0s~U~AxiRDAIgY70jZP2~8MieYI14L3HBV-Ls01KNii1ZTt4MV5rtO~Y_)

*Page 1 proof: revenue dashboard and lifetime-total section.*

![Page 1 offer](https://private-us-east-1.manuscdn.com/sessionFile/aJNLHB2b0Wfa3n4iEwe2nv/sandbox/VMroMVFBBUjP5vpa2L36or-images_1787446938171_na1fn_L2hvbWUvdWJ1bnR1L2Z1bm5lbF9zd2lwZV9yZWZlcmVuY2UvYXNzZXRzL3BhZ2UxX29mZmVy.webp?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvYUpOTEhCMmIwV2ZhM240aUV3ZTJudi9zYW5kYm94L1ZNcm9NVkZCQlVqUDV2cGEyTDM2b3ItaW1hZ2VzXzE3ODc0NDY5MzgxNzFfbmExZm5fTDJodmJXVXZkV0oxYm5SMUwyWjFibTVsYkY5emQybHdaVjl5WldabGNtVnVZMlV2WVhOelpYUnpMM0JoWjJVeFgyOW1abVZ5LndlYnAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3ODk0MzA0MDB9fX1dfQ__&Key-Pair-Id=K2QY5QTL8JSY6C&Signature=MEUCIHg7PI~H~euO62ERK-wTpHObVL7e1erm4Jqf1Lcb6OxpAiEA72rXYplbMjMMzyJr0LMxaKG5R9YVOdc3ChlXR8U2s94_)

*Page 1 offer: repeated CTA and “What’s Included” card.*

![Page 2 hero](https://private-us-east-1.manuscdn.com/sessionFile/aJNLHB2b0Wfa3n4iEwe2nv/sandbox/VMroMVFBBUjP5vpa2L36or-images_1787446938171_na1fn_L2hvbWUvdWJ1bnR1L2Z1bm5lbF9zd2lwZV9yZWZlcmVuY2UvYXNzZXRzL3BhZ2UyX2hlcm8.webp?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvYUpOTEhCMmIwV2ZhM240aUV3ZTJudi9zYW5kYm94L1ZNcm9NVkZCQlVqUDV2cGEyTDM2b3ItaW1hZ2VzXzE3ODc0NDY5MzgxNzFfbmExZm5fTDJodmJXVXZkV0oxYm5SMUwyWjFibTVsYkY5emQybHdaVjl5WldabGNtVnVZMlV2WVhOelpYUnpMM0JoWjJVeVgyaGxjbTgud2VicCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc4OTQzMDQwMH19fV19&Key-Pair-Id=K2QY5QTL8JSY6C&Signature=MEUCIQCEnof1jxZHV2waqrcK18ZLwdujG07yOKNYSVBpwwWsUAIgWT-Vk2~AdaUCqy6kwEZbomo5pxClH5WAocXRVujeyiY_)

*Page 2 hero: eight-product visual catalog and $8 CTA.*

![Page 2 authority](https://private-us-east-1.manuscdn.com/sessionFile/aJNLHB2b0Wfa3n4iEwe2nv/sandbox/VMroMVFBBUjP5vpa2L36or-images_1787446938171_na1fn_L2hvbWUvdWJ1bnR1L2Z1bm5lbF9zd2lwZV9yZWZlcmVuY2UvYXNzZXRzL3BhZ2UyX2F1dGhvcml0eQ.webp?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvYUpOTEhCMmIwV2ZhM240aUV3ZTJudi9zYW5kYm94L1ZNcm9NVkZCQlVqUDV2cGEyTDM2b3ItaW1hZ2VzXzE3ODc0NDY5MzgxNzFfbmExZm5fTDJodmJXVXZkV0oxYm5SMUwyWjFibTVsYkY5emQybHdaVjl5WldabGNtVnVZMlV2WVhOelpYUnpMM0JoWjJVeVgyRjFkR2h2Y21sMGVRLndlYnAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3ODk0MzA0MDB9fX1dfQ__&Key-Pair-Id=K2QY5QTL8JSY6C&Signature=MEUCIQD57xNv006uwXc3TUhtX1hLlWdyRmGtej2s4VxgfdHbWwIgKSaWRXBPSgKcgdyHhG6tvdvcFu2ST23RZ1IwuaWva54_)

*Page 2 authority: Instagram profile, revenue proof, and benefit stack.*

![Page 2 sales route](https://private-us-east-1.manuscdn.com/sessionFile/aJNLHB2b0Wfa3n4iEwe2nv/sandbox/VMroMVFBBUjP5vpa2L36or-images_1787446938171_na1fn_L2hvbWUvdWJ1bnR1L2Z1bm5lbF9zd2lwZV9yZWZlcmVuY2UvYXNzZXRzL3BhZ2UyX3NhbGVzX3JvdXRl.webp?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvYUpOTEhCMmIwV2ZhM240aUV3ZTJudi9zYW5kYm94L1ZNcm9NVkZCQlVqUDV2cGEyTDM2b3ItaW1hZ2VzXzE3ODc0NDY5MzgxNzFfbmExZm5fTDJodmJXVXZkV0oxYm5SMUwyWjFibTVsYkY5emQybHdaVjl5WldabGNtVnVZMlV2WVhOelpYUnpMM0JoWjJVeVgzTmhiR1Z6WDNKdmRYUmwud2VicCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc4OTQzMDQwMH19fV19&Key-Pair-Id=K2QY5QTL8JSY6C&Signature=MEUCIFbi1HMX~80dwL7KlFak83EtSgJvGAGIeJwNehJdUgl1AiEAqeRW7ukKTof5JcoOKptjpdrG2CNEM01akiBUUJ-bUPc_)

*Page 2 sales route: sales-focused course grouping.*

![Page 2 followers route](https://private-us-east-1.manuscdn.com/sessionFile/aJNLHB2b0Wfa3n4iEwe2nv/sandbox/VMroMVFBBUjP5vpa2L36or-images_1787446938171_na1fn_L2hvbWUvdWJ1bnR1L2Z1bm5lbF9zd2lwZV9yZWZlcmVuY2UvYXNzZXRzL3BhZ2UyX2ZvbGxvd2Vyc19yb3V0ZQ.webp?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvYUpOTEhCMmIwV2ZhM240aUV3ZTJudi9zYW5kYm94L1ZNcm9NVkZCQlVqUDV2cGEyTDM2b3ItaW1hZ2VzXzE3ODc0NDY5MzgxNzFfbmExZm5fTDJodmJXVXZkV0oxYm5SMUwyWjFibTVsYkY5emQybHdaVjl5WldabGNtVnVZMlV2WVhOelpYUnpMM0JoWjJVeVgyWnZiR3h2ZDJWeWMxOXliM1YwWlEud2VicCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc4OTQzMDQwMH19fV19&Key-Pair-Id=K2QY5QTL8JSY6C&Signature=MEUCIQD3DVgRhUSBe9JQowysoWVYyUHbDUazbkETa7pr8d~6ywIgBQCBh54I-cqI0Sq5-DaGCfpPZFgJv3~JhZcvZfSwj20_)

*Page 2 follower-growth route: five visual product tiles and CTA.*

![Meta Ad Library](https://private-us-east-1.manuscdn.com/sessionFile/aJNLHB2b0Wfa3n4iEwe2nv/sandbox/VMroMVFBBUjP5vpa2L36or-images_1787446938171_na1fn_L2hvbWUvdWJ1bnR1L2Z1bm5lbF9zd2lwZV9yZWZlcmVuY2UvYXNzZXRzL21ldGFfYWRfbGlicmFyeQ.webp?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvYUpOTEhCMmIwV2ZhM240aUV3ZTJudi9zYW5kYm94L1ZNcm9NVkZCQlVqUDV2cGEyTDM2b3ItaW1hZ2VzXzE3ODc0NDY5MzgxNzFfbmExZm5fTDJodmJXVXZkV0oxYm5SMUwyWjFibTVsYkY5emQybHdaVjl5WldabGNtVnVZMlV2WVhOelpYUnpMMjFsZEdGZllXUmZiR2xpY21GeWVRLndlYnAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3ODk0MzA0MDB9fX1dfQ__&Key-Pair-Id=K2QY5QTL8JSY6C&Signature=MEYCIQDljVK2~TxJ9G9SzglWQEJqevpa7wdfmKGYzgoJLOpnZgIhAOefOoA6AFuBYWfR~TLEak2U4hAPweDPCdFWdPO-SgLy)

*Public Meta Ad Library view showing active Maria Wendt Official ads and the $8 Instagram-bundle messaging.*

## 12. Bottom line

The core lesson is not simply “use bright buttons” or “show a large revenue number.” The repeatable system is **one clear low-ticket promise, one obvious checkout destination, tangible product visuals, a short list of concrete mechanisms, outcome-based routing where the offer is broad, and proof that is repeated in the same language as the ad**. The Instagram page is the stronger model for a bundle because it turns a potentially confusing catalog into two simple journeys. The digital-products page is the stronger model for a single transformation because it concentrates attention on one broad beginner outcome.

For a new funnel, the safest swipe is the **structure and decision logic**, not the unsupported claims. Build the page so a visitor can answer five questions immediately: What do I get, who is it for, why should I believe you, how much is it, and what do I click now? Then make every proof element and offer term precise enough to survive skeptical inspection.

## References

[1]: https://learn.coachmariawendt.com/make-money-selling-digital-products/ "Make Money Selling Digital Products — Coach Maria Wendt"

[2]: https://learn.coachmariawendt.com/instagram-bundle-8/ "Get Paid With Instagram: Maria Wendt’s Ultimate Instagram Course Bundle"

[3]: https://www.facebook.com/ads/library/?id=1383505966215744 "Meta Ad Library — Maria Wendt Official"
