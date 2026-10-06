# ASN Media --- DESIGN.md

## 1. Design Intent

ASN Media should look like a **premium creative studio / media company
with an editorial and cinematic character**.

The visual language is inspired by the supplied Squarespace Design DNA
audit, but it must remain an original ASN Media identity.

The audit describes Squarespace as professional, balanced and
trustworthy, with a restrained palette, moderately rounded geometry,
compact 4px spacing, a 4-step type scale, and hero/navbar/CTA patterns.
Those principles are adopted selectively as structural references rather
than copied literally.

Reference: supplied `Design DNA Report - squarespace.pdf`, especially
pages 2--5.

------------------------------------------------------------------------

# 2. Brand Character

### Primary attributes

-   Premium
-   Editorial
-   Cinematic
-   Minimal
-   Confident
-   Precise
-   Human
-   Modern

### Avoid

-   Loud agency aesthetics
-   Excessive gradients
-   Excessive glassmorphism
-   Heavy shadows
-   Generic SaaS cards
-   Excessive rounded containers
-   Neon colors
-   Decorative 3D
-   Overuse of gold
-   Animation for animation's sake

------------------------------------------------------------------------

# 3. Color System

ASN Media's logo establishes a gold/white/black identity.

The website should use gold sparingly.

``` css
:root {
  --color-ivory: #F7F5EF;
  --color-white: #FFFFFF;
  --color-black: #0A0A0A;

  --color-gold: #C8A13A;
  --color-gold-dark: #8E722A;

  --color-text: #111111;
  --color-text-muted: #66615A;

  --color-border: rgba(10, 10, 10, 0.14);
  --color-border-dark: rgba(255, 255, 255, 0.16);
}
```

## Usage ratio

Approximate visual distribution:

``` text
Ivory / White     70%
Black             20%
Imagery            8%
Gold               2%
```

These are design-direction ratios, not hard technical constraints.

### Gold rule

Gold is an **accent**.

Use it for:

-   CTA emphasis
-   eyebrow details
-   active states
-   tiny rules
-   selected metadata
-   subtle hover states
-   signature CTA section

Do not use gold for:

-   large body-text blocks
-   every button
-   every heading
-   every border
-   entire page backgrounds except one intentional CTA moment

------------------------------------------------------------------------

# 4. Typography

## Primary recommendation

### Display

``` text
Instrument Serif
```

### Body / UI

``` text
Manrope
```

The supplied audit identifies a separate display/body typographic system
and a restrained type scale. The exact Squarespace typefaces are not
required; ASN Media should use an original, accessible implementation.

------------------------------------------------------------------------

## Type scale

``` css
:root {
  --fs-display: clamp(3.5rem, 8vw, 7rem);
  --fs-h1: clamp(2.75rem, 5vw, 5rem);
  --fs-h2: clamp(2rem, 3.5vw, 3.5rem);
  --fs-h3: clamp(1.25rem, 2vw, 1.75rem);

  --fs-body-lg: 1.125rem;
  --fs-body: 1rem;
  --fs-small: 0.875rem;
  --fs-micro: 0.6875rem;
}
```

### Display typography

Use large display type for:

-   hero
-   major section statements
-   CTA
-   selected editorial moments

Do not use giant typography in every section.

### Body typography

Body copy should be:

-   short
-   readable
-   approximately 16--18px
-   generous line-height
-   muted where secondary

------------------------------------------------------------------------

# 5. Typography Rules

## Headings

Use sentence case where possible.

Preferred:

``` text
Your idea.
Our growth.
```

Avoid:

``` text
YOUR IDEA.
OUR GROWTH.
```

unless used intentionally as a small editorial label.

## Eyebrows

Use uppercase:

``` text
SELECTED WORK
OUR APPROACH
WHAT WE DO
```

Letter spacing:

``` css
letter-spacing: 0.12em;
```

## Body

``` css
line-height: 1.6;
```

Maximum paragraph width:

``` text
55–70ch
```

------------------------------------------------------------------------

# 6. Spacing System

The supplied Squarespace audit identifies a 4px base spacing rhythm. ASN
Media should retain this as a structural principle.

``` css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;
--space-32: 128px;
--space-40: 160px;
```

------------------------------------------------------------------------

# 7. Section Spacing

Desktop:

``` text
Small section:     80–120px
Standard section:  120–160px
Hero:              140–220px
Major transition:  160–220px
```

Mobile:

``` text
Small section:     56–72px
Standard section:  72–96px
Hero:              88–120px
```

Do not mechanically apply identical spacing to every section.

------------------------------------------------------------------------

# 8. Container

Recommended:

``` css
--container-max: 1280px;
--container-padding: clamp(20px, 4vw, 64px);
```

Example:

``` css
.container {
  width: min(
    calc(100% - (var(--container-padding) * 2)),
    var(--container-max)
  );
  margin-inline: auto;
}
```

------------------------------------------------------------------------

# 9. Grid

Primary desktop grid:

``` text
12 columns
```

Suggested gap:

``` text
24px
```

Mobile:

``` text
4 columns
```

The grid should be invisible in the final interface.

------------------------------------------------------------------------

# 10. Radius

The supplied audit describes moderately rounded geometry.

ASN Media should be restrained:

``` css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 16px;
```

Default:

``` text
8px
```

Do not make every component a pill.

Pill radius should be reserved for:

-   compact tags
-   status labels
-   selected filters
-   optional CTA variants

------------------------------------------------------------------------

# 11. Borders

Borders should be subtle.

Light background:

``` css
border-color: rgba(10, 10, 10, 0.12);
```

Dark background:

``` css
border-color: rgba(255, 255, 255, 0.16);
```

Gold borders are rare.

------------------------------------------------------------------------

# 12. Shadows

Use very little shadow.

Preferred:

``` css
box-shadow: 0 12px 40px rgba(0,0,0,0.06);
```

Only when needed to separate floating UI.

Avoid: - dramatic black shadows - colored shadows - glow everywhere

------------------------------------------------------------------------

# 13. Navbar

Desktop:

``` text
┌──────────────────────────────────────────────────────────────┐
│ ASN MEDIA      Work   Services   About   Insights   LET'S TALK│
└──────────────────────────────────────────────────────────────┘
```

Height:

``` text
72–88px
```

Logo should be visually restrained.

### Scroll behavior

Initial:

``` text
transparent / ivory
```

Scrolled:

``` text
solid background
subtle bottom border
```

Do not use a huge glassmorphism navbar.

------------------------------------------------------------------------

# 14. Hero

The hero is the strongest visual section.

Structure:

``` text
EYEBROW

Your idea.
Our growth.

Short supporting paragraph.

[ Explore our work → ]

                    [ LARGE CINEMATIC MEDIA ]
```

Desktop ratio:

``` text
5 columns text
7 columns media
```

Alternative:

``` text
6 / 6
```

The hero media should have enough visual weight to compete with the
headline without making the page feel crowded.

------------------------------------------------------------------------

# 15. Media Direction

Imagery should feel:

-   cinematic
-   authentic
-   high contrast where appropriate
-   professionally composed
-   human
-   brand-focused

Avoid:

-   obvious generic stock photography
-   repetitive mockups
-   low-resolution images
-   overly edited AI-looking visuals

Use real ASN Media work whenever available.

------------------------------------------------------------------------

# 16. Image Treatment

Default:

``` css
img {
  display: block;
  width: 100%;
  height: auto;
}
```

Optional media crop:

``` text
object-fit: cover;
```

Use fixed aspect ratios intentionally.

Recommended:

``` text
16:10
16:9
4:5
3:2
```

Do not force every project image into the same ratio.

------------------------------------------------------------------------

# 17. Services Pattern

Use a large editorial list.

``` text
01
SOCIAL MEDIA MANAGEMENT
Strategy, content & community.                         →

────────────────────────────────────────────

02
CONTENT CREATION
Visual stories built for attention.                   →

────────────────────────────────────────────
```

Hover can reveal:

-   image
-   category
-   subtle gold accent
-   arrow movement

No card explosion.

------------------------------------------------------------------------

# 18. Work Pattern

Projects should feel like editorial spreads.

Example:

``` text
01

┌─────────────────────────────────────┐
│                                     │
│             PROJECT MEDIA            │
│                                     │
└─────────────────────────────────────┘

CLIENT NAME
Social Campaign
2026

View project →
```

For subsequent projects, alternate composition:

``` text
TEXT       MEDIA
MEDIA      TEXT
TEXT       MEDIA
```

This creates visual rhythm without adding effects.

------------------------------------------------------------------------

# 19. Dark Section

Use black to create a strong emotional transition.

``` text
#0A0A0A
```

Typography:

``` text
#FFFFFF
```

Accent:

``` text
#C8A13A
```

Example:

``` text
OUR APPROACH

We don't just create content.
We create perception.

01 STRATEGY
02 STORY
03 IMPACT
```

Keep this section sparse.

------------------------------------------------------------------------

# 20. Gold CTA

Only one major gold section should exist on the homepage.

``` text
BACKGROUND: GOLD

Your idea.
Our growth.

Start a project →
```

Text should remain dark/black.

Avoid putting the full gold logo on a gold background.

------------------------------------------------------------------------

# 21. Footer

Background:

``` text
#0A0A0A
```

Layout:

``` text
ASN MEDIA

Let's create something
worth remembering.

hello@asnmedia.in

-------------------------

Work
Services
About
Contact

Instagram
LinkedIn
YouTube

© ASN Media 2026
```

The large circular logo can appear subtly as a background/secondary
element if it remains readable and doesn't compete with the footer
content.

------------------------------------------------------------------------

# 22. Buttons

## Primary

``` text
LET'S TALK →
```

Characteristics:

-   black on ivory
-   or ivory on black
-   subtle radius
-   medium weight
-   12--16px horizontal padding
-   10--14px vertical padding

## Accent

``` text
START A PROJECT →
```

Gold background.

## Text CTA

``` text
View project →
```

No container required.

------------------------------------------------------------------------

# 23. Interaction Rules

Interaction should communicate responsiveness, not spectacle.

### Button

``` text
default → hover
```

Possible: - 2--4px movement - subtle background transition - arrow
translation

### Project

``` text
image scale: 1 → 1.03
```

Duration:

``` text
400–700ms
```

### Service

``` text
arrow: x 0 → x 6px
gold accent appears
```

------------------------------------------------------------------------

# 24. Motion System

GSAP can be used for:

-   hero reveal
-   section reveal
-   image reveal
-   page transition
-   service interactions
-   project transitions

Lenis can be used for smooth scrolling.

### Default easing

Prefer restrained easing.

``` text
power2.out
power3.out
expo.out
```

Do not animate every element independently.

------------------------------------------------------------------------

# 25. Reveal Pattern

Preferred:

``` text
opacity: 0 → 1
y: 24px → 0
```

Duration:

``` text
0.6–0.9s
```

Stagger:

``` text
0.05–0.12s
```

Keep stagger subtle.

------------------------------------------------------------------------

# 26. Reduced Motion

Always implement:

``` css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
```

GSAP timelines should also respect the user's reduced-motion preference.

------------------------------------------------------------------------

# 27. Cursor

Desktop cursor enhancement is optional.

If implemented:

-   very small
-   subtle
-   only on interactive media
-   no giant trailing circle
-   no constant text following cursor

Mobile gets no custom cursor.

------------------------------------------------------------------------

# 28. Forms

Input design:

``` text
transparent / ivory background
thin border
8px radius
```

Focus:

``` text
border-color: #C8A13A;
```

Labels remain visible.

Do not rely on placeholders as labels.

------------------------------------------------------------------------

# 29. Responsive Design

## Desktop

Use: - asymmetrical layouts - large typography - large media - generous
whitespace

## Tablet

Reduce: - heading size - section spacing - media scale

Maintain: - editorial composition

## Mobile

Use: - one-column layouts - strong hierarchy - compact navigation -
large touch targets

Do not simply scale desktop down.

------------------------------------------------------------------------

# 30. Mobile Hero

Recommended:

``` text
ASN MEDIA
SOCIAL • CONTENT • GROWTH

Your idea.
Our growth.

Short supporting copy.

[ Explore our work → ]

[ MEDIA ]
```

Headline should remain the first visual priority.

------------------------------------------------------------------------

# 31. Accessibility

Minimum requirements:

-   semantic HTML
-   proper heading hierarchy
-   keyboard navigation
-   visible focus states
-   accessible menu
-   form labels
-   alt text
-   reduced motion
-   sufficient contrast

Never communicate meaning through gold color alone.

------------------------------------------------------------------------

# 32. Design Tokens --- Implementation

Recommended global token layer:

``` css
:root {
  /* Colors */
  --color-bg: #F7F5EF;
  --color-surface: #FFFFFF;
  --color-dark: #0A0A0A;
  --color-gold: #C8A13A;
  --color-gold-dark: #8E722A;

  --color-text: #111111;
  --color-text-muted: #66615A;

  /* Typography */
  --font-display: "Instrument Serif", serif;
  --font-body: "Manrope", sans-serif;

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;

  /* Layout */
  --container-max: 1280px;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;
  --space-32: 128px;
}
```

------------------------------------------------------------------------

# 33. Tailwind Mapping

Suggested conceptual mapping:

``` text
bg-brand       → #F7F5EF
bg-dark        → #0A0A0A
text-brand     → #111111
text-muted     → #66615A
gold           → #C8A13A
gold-dark      → #8E722A
display        → Instrument Serif
body           → Manrope
```

Do not create dozens of one-off colors.

------------------------------------------------------------------------

# 34. Component Design Rules

Components must:

1.  consume design tokens
2.  avoid arbitrary magic values where possible
3.  support responsive layouts
4.  support keyboard interaction
5.  support reduced motion
6.  remain composable
7.  avoid unnecessary abstraction

Recommended component set:

``` text
Navbar
MobileMenu
Button
SectionLabel
Hero
MediaBlock
ServiceList
ServiceItem
ProjectCard
ProjectGrid
ProjectHero
CTASection
Footer
ContactForm
Reveal
PageTransition
```

------------------------------------------------------------------------

# 35. Page Templates

## Marketing page

``` text
Navbar
Hero
Content
Media
CTA
Footer
```

## Service page

``` text
Navbar
ServiceHero
ServiceIntro
Capabilities
Process
SelectedWork
CTA
Footer
```

## Project page

``` text
Navbar
ProjectHero
ProjectOverview
ProjectMedia
ProjectStory
ProjectGallery
NextProject
CTA
Footer
```

------------------------------------------------------------------------

# 36. Visual Hierarchy Rules

Each viewport should have one primary visual priority.

Homepage:

``` text
1. Hero headline
2. Hero media
3. Showreel
4. Services
5. Selected work
6. CTA
```

Do not give every section equal visual weight.

------------------------------------------------------------------------

# 37. Content Density

Prefer:

``` text
short headline
short paragraph
large media
```

over:

``` text
large headline
large paragraph
large paragraph
large paragraph
five cards
three badges
four buttons
```

Whitespace is part of the design.

------------------------------------------------------------------------

# 38. Logo Usage

The supplied ASN Media logo contains:

-   ASN wordmark
-   MEDIA
-   SOCIAL / CONTENT / GROWTH
-   four service icons
-   tagline
-   circular gold border

Because the supplied logo is information-heavy, it should be used at
controlled sizes.

### Navbar

Use a simplified logo lockup if an official simplified version is
approved.

If only the supplied full logo exists: - keep it small - preserve clear
space - do not crop it

### Footer

Full logo is appropriate.

### Hero

Do not use the full circular logo as the hero background unless it is
part of a deliberate campaign/art direction.

------------------------------------------------------------------------

# 39. Do / Don't

## DO

-   use large editorial typography
-   use real work
-   use whitespace
-   use restrained gold
-   use black sections strategically
-   use cinematic imagery
-   use subtle animation
-   use strong alignment
-   use consistent spacing
-   use reusable components

## DON'T

-   overuse gold
-   animate everything
-   use 3D for no reason
-   create excessive glass effects
-   use generic AI imagery
-   use giant logo everywhere
-   use 10 CTA styles
-   use inconsistent radii
-   use arbitrary colors
-   sacrifice performance for visual effects

------------------------------------------------------------------------

# 40. Core Design Principle

> **Make the content feel expensive, not the effects.**

The premium feeling should come from:

``` text
Typography
+
Whitespace
+
Photography
+
Composition
+
Consistency
+
Motion restraint
```

not:

``` text
More animations
+
More gradients
+
More 3D
+
More effects
```

------------------------------------------------------------------------

# 41. Final Design Statement

ASN Media's final experience should feel like:

> **A premium editorial magazine crossed with a modern film studio and a
> sophisticated creative agency.**

Quiet confidence.

Strong typography.

Beautiful media.

Minimal interface.

A controlled amount of gold.

And just enough motion to make the interface feel alive.
