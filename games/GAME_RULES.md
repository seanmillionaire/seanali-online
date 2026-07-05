# Sean Ali Games — Build Rules

These are the rules for every game in `/games/`.

## Core dream
Build a growing mobile game world that helps Angelique learn, play, focus, and feel progress.

Every game must:
1. Capture attention fast.
2. Engage the senses.
3. Teach or reinforce one useful idea.
4. Support school work when possible.
5. Feel fun enough to replay.

## Non-negotiable game rules

### 1. No tiny dinky games
A game cannot be a one-screen novelty. It must feel like progress is happening.

Every game needs at least one visible progress system:
- XP bar
- Stars
- Streak
- Level
- Hearts
- Map trail
- Badges
- Prize chest
- Unlockable car, animal, song, sound, color, or character

### 2. Big ending payoff
The ending must feel substantial.

Every game ending must show:
- Final score
- Grade or rank
- Celebration
- Prize, badge, trophy, or unlock
- Simple reason to replay

### 3. App view must stay at top
Every game must maintain the app view at the top, especially on mobile and in-app browsers.

Use:
- `/games/app-view.js`

Required behavior:
- Game starts at the top of the viewport.
- Game container is not vertically centered off-screen.
- After taps, answer feedback, language changes, resize, orientation changes, or replay, the view returns to the top of the active game.
- Use `align-items:flex-start` and `justify-content:flex-start` for mobile game bodies.
- Respect safe-area top padding for iPhone/in-app browsers.

### 4. Duolingo-style motivation
Use simple kid reward loops:
- Daily streak
- Hearts/lives
- XP
- Level up
- Gems/stars
- Treasure chest
- Progress trail
- Unlocks

Avoid complicated accounts or logins for now. Use localStorage when useful.

### 5. ES / EN language option
Every game must include an ES / EN option.

Current shared helper:
- `/games/lang.js`

Every current game should load it through:
- `/games/voice.js`
- `/games/sounds.js`

Future games should be bilingual natively, not only translated after render.

Required:
- Visible ES / EN toggle.
- Save choice in localStorage.
- Spanish first by default.
- English option for all main text, instructions, choices, feedback, reward screens, and footer navigation.
- Voice should use the selected language when possible.
- SEO can stay English-first unless there is a strong reason for Spanish-first.

### 6. Voice guidance
Every game should include voice help.

Voice priority:
1. Use the shared ElevenLabs helper when possible: `/games/voice.js`.
2. The helper calls the secure server route: `/api/tts`.
3. If ElevenLabs is not configured or fails, fall back to browser speech synthesis.

The API key must never be placed in browser JavaScript.
Use Vercel environment variables:
- `ELEVENLABS_API_KEY`
- `ELEVENLABS_VOICE_ID`
- Optional: `ELEVENLABS_MODEL_ID`

Voice should:
- Explain the game at the start
- Read questions or prompts
- Celebrate correct answers
- Gently explain wrong answers
- Use the selected ES / EN language when possible

Every game needs a voice/sound toggle.

### 7. Payoff sounds
Every educational game should use shared reward sounds from `/games/sounds.js`.

Required sound behavior:
- Correct answer: bright `ding` sound.
- Wrong answer / false answer: soft wrong sound, not scary.
- Final pass, prize, badge, chest, unlock, or level-up: money/coin payoff sound.

Do not overuse the money sound on every tap. Save it for the bigger payoff moments.

### 8. Instruction manual
Every game needs a simple `How to Play` button or panel.

Manual must be kid-simple and bilingual.

Example ES:
1. Mira la pregunta.
2. Toca la respuesta correcta.
3. Gana estrellas.
4. Mira tu premio al final.

Example EN:
1. Look at the question.
2. Tap the correct answer.
3. Earn stars.
4. See your prize at the end.

### 9. Mobile-first
Games are made for phone first.

Must include:
- Big tap targets
- Large text
- Bright contrast
- No tiny controls
- No long reading
- No required keyboard
- Works on 375px mobile screens

### 10. Sensory feedback
Every game should use:
- Motion
- Sound
- Confetti
- Emojis
- Color changes
- Button press animation
- Victory animation

### 11. Educational target
Every game should teach or reinforce one clear skill.

Good categories:
- Multiplication
- Addition/subtraction
- Reading
- Spanish comprehension
- Tongue twisters
- True/false logic
- Memory
- Pattern recognition
- Music/rhythm
- Animals/nature
- Simple science
- Natural food education
- Money principles

### 12. Keep it age 7 simple
Language must be short and easy.

Prefer Spanish first.

Use phrases like:
- `Toca la respuesta.`
- `¡Correcto!`
- `Intenta otra vez.`
- `Gana estrellas.`
- `Mira tu premio.`

### 13. SEO rules
Each game page needs:
- Title tag
- Meta description
- Canonical URL
- Open Graph title/description
- Social sharing image when available
- Theme color
- Robots index/follow
- JSON-LD Game schema when possible

Do not put private child details in public metadata.

### 14. Footer / breadcrumbs rule
Every game needs footer breadcrumbs and discovery links.

Use:
- `/games/breadcrumbs.js`

Footer should help users move:
- Home
- Games
- Current Game
- More games

### 15. Email rule
After each new game is uploaded, send a short Spanish email to Angelique with:
- New game name
- Link
- 3–5 simple instructions
- The prize/unlock she can earn

### 16. Collection wall rule
After every new game, update `/games/` with:
- New game card
- Short benefit line
- Tags
- Link
- SEO structured data updated

## Quality bar
A good game should feel like:
- Tiny Duolingo
- Tiny Mario Party
- Tiny Zelda discovery
- Tiny math arcade
- Tiny music toy

Not a worksheet.
Not a quiz page only.
Not a boring button demo.
