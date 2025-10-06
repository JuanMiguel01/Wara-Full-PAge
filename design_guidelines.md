# Design Guidelines: Chispa Cubana Dating App

## Design Approach

**Reference-Based with Brand Consistency**: Drawing inspiration from Tinder's swipe mechanics, Bumble's profile depth, and Hinge's conversation starters, while maintaining the established dark, vibrant Cuban brand identity from the landing page.

## Core Design Elements

### A. Color Palette

**Dark Mode Foundation** (primary interface)
- Background: 10 0% 4% (deep charcoal)
- Card surfaces: 0 0% 7% (elevated dark)
- Borders: white at 7% opacity

**Brand Colors**
- Primary (Chispa Red): 0 79% 70%
- Secondary (Cuban Gold): 44 100% 70%
- Gradient combination: Linear from Primary to Secondary

**Semantic Colors**
- Success/Match: 142 71% 45% (vibrant green for matches)
- Like action: Primary red
- Nope action: 240 5% 34% (muted gray)
- Verified badge: 199 89% 48% (trust blue)

**Text Hierarchy**
- Primary text: white
- Secondary text: 215 16% 65% (muted slate)
- Disabled: white at 30% opacity

### B. Typography

**Font Family**: Inter (already loaded from landing page)
- Display (H1): 800 weight, 2.5rem-4rem, tight leading
- Headings (H2-H3): 600 weight, 1.5rem-2rem
- Body: 400 weight, 1rem, relaxed leading
- Labels/UI: 600 weight, 0.875rem

**Special Treatment**
- User names: 600 weight for emphasis
- Match notifications: Gradient text effect (Primary to Secondary)

### C. Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, and 8 consistently
- Component padding: p-4 to p-6
- Section spacing: py-8 to py-12
- Card gaps: gap-4
- Icon margins: m-2

**Container Strategy**
- Max width: max-w-md (448px) for mobile-first dating experience
- Swipe cards: Full viewport minus safe areas
- Chat interface: max-w-2xl (672px) on larger screens
- Profile grids: Grid with 2-3 columns on desktop

### D. Component Library

**Navigation**
- Bottom tab bar (mobile primary): Glassmorphism effect, 5 icons (Discover, Matches, Chat, Profile, Settings)
- Icons from Heroicons (outline style for inactive, solid for active)
- Active state: Primary red with subtle glow

**Swipe Cards**
- Glassmorphism card: backdrop-blur-xl, border with white/10 opacity
- Photo: Full card background with gradient overlay (bottom to top, black at 60% to transparent)
- User info overlay: Positioned bottom-left, white text with drop shadow
- Action buttons: Circular, floating 80px from bottom (Nope left, Like right, Super Chispa center)
- Button sizes: 64px diameter (nope/like), 72px (super chispa)
- Button styling: Glassmorphism background, colored borders (red for like, gray for nope, gradient for super)

**Profile Cards** (in Match/Discovery grids)
- Aspect ratio: 3:4 portrait
- Hover effect: Subtle scale (1.02) and shadow increase
- Verified badge: Top-right corner, 24px, blue checkmark
- Quick info: Name, age, distance shown on gradient overlay

**Chat Interface**
- Message bubbles: Sent (Primary gradient), Received (card dark with border)
- Bubble padding: px-4 py-3
- Timestamp: Small, muted, below bubble
- Input bar: Fixed bottom, glassmorphism, with emoji picker and send button
- Match header: Photo, name, last seen status

**Profile View** (Full screen)
- Hero image section: 60vh with gradient overlay
- Photo gallery: Horizontal scroll snap, indicator dots
- Bio section: Card with glassmorphism, p-6
- Info chips: Rounded-full pills (interests, location, job)
- Action buttons: Fixed bottom bar with Like/Nope/Super Chispa

**Match Modal**
- Centered overlay: Glassmorphism backdrop
- Animation: Scale up from 0.8 with fade in
- Content: "¡Es un Match!" with gradient text, both user photos side by side
- CTA: "Enviar Mensaje" button with primary gradient

**Forms & Inputs**
- Text inputs: Dark background (0 0% 7%), white text, border on focus (Primary)
- Labels: Above input, muted color, 600 weight
- Photo upload: Dashed border card, centered upload icon
- Toggle switches: Primary color when active
- Range sliders: Primary gradient track for active portion

**Empty States**
- Centered icon (96px) in muted color
- Message: "No hay chispas aquí todavía"
- Secondary text with action suggestion

### E. Interactions & Animations

**Swipe Gestures**
- Card drag: translateX with rotation (-15° to 15°)
- Like preview: Red border glow appears when dragging right
- Nope preview: Gray opacity overlay when dragging left
- Exit animation: Card flies off screen in swipe direction

**Micro-interactions** (use sparingly)
- Button press: scale(0.95) on active
- Match detection: Confetti or sparkle effect (single burst)
- New message: Subtle badge pulse on chat icon
- Loading: Spinning gradient ring

**Transitions**
- Page changes: Slide from right (forward), slide from left (back)
- Modal appearance: Fade with scale
- Duration: 200-300ms with ease-out

## Special Components

**Verification Badge**: 
- Small blue circle with white checkmark
- 20px size for thumbnails, 28px for full profiles
- Positioned top-right with -translate offset

**Distance Indicator**:
- Small text with location pin icon
- Format: "2.5 km de distancia"
- Always shown in muted color

**Interest Tags**:
- Rounded-full chips with glassmorphism
- Text size: 0.875rem
- Padding: px-3 py-1
- Max 5 visible, "+X más" for overflow

**Rompehielos (Ice Breaker Cards)**:
- Accent card with slight border
- Cuban flag emoji or chili pepper as prefix
- Tap to auto-fill in message

## Images

**Profile Photos**: User-uploaded, stored in S3
- Minimum 1 photo required, maximum 6
- Aspect ratio enforced: 3:4 portrait
- Compression applied, max 1MB per photo

**Placeholder Images**: When no photos available
- Gradient circle with user initials (from name)
- Uses Primary to Secondary gradient

**Hero Images**: Not applicable for main app (card-based UI)

## Platform Considerations

**Mobile-First**: All interactions optimized for touch
- Touch targets: Minimum 44x44px
- Swipe gestures as primary interaction
- Bottom navigation for thumb-friendly access

**Responsive Breakpoints**:
- Mobile: Default (< 768px)
- Tablet: md: (768px+) - Show side navigation, larger cards
- Desktop: lg: (1024px+) - Split view (list + detail), multi-column match grids

This design creates a modern, culturally authentic dating experience that feels both familiar (to dating app users) and distinctly Cuban, with the vibrant energy of "Chispa Cubana."