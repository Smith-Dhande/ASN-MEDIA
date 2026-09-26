# ASN Media Website --- Product Requirements Document (PRD)

**Project:** ASN Media Corporate / Creative Agency Website\
**Document Version:** 1.0\
**Date:** 26 September 2026\
**Status:** Ready for Design & Development\
**Primary Goal:** Build a premium, minimal, editorial-style website for
ASN Media that communicates its social media, content, video production,
and brand strategy capabilities.

------------------------------------------------------------------------

## 1. Product Overview

ASN Media is a media and creative-growth company offering:

-   Social Media Management
-   Content Creation
-   Video Production
-   Brand Strategy

The website will function as ASN Media's primary digital presence and
sales-facing portfolio. It must communicate trust, creativity, premium
positioning, and capability without becoming visually noisy.

The visual direction is **inspired by the design principles observed in
the supplied Squarespace Design DNA audit**, not a direct reproduction
of Squarespace. The supplied audit identifies a professional, balanced,
trustworthy character; restrained visual language; moderately rounded
geometry; compact 4px spacing rhythm; strong display/body typography
separation; and recurring hero, navbar, and CTA patterns.

**Source basis:** Squarespace Design DNA audit, pages 1--5. The audit
reports a minimal two-token palette, a 4-step type scale, 4px spacing
grid, moderately rounded geometry, and hero/navbar/CTA patterns. It also
explicitly recommends adopting reusable design tokens and documenting
recurring patterns.

------------------------------------------------------------------------

## 2. Product Vision

### Vision statement

> Create a digital experience that makes ASN Media feel like a premium
> creative studio before a visitor reads a single paragraph.

The website should feel:

-   Premium
-   Editorial
-   Cinematic
-   Confident
-   Minimal
-   Human
-   Contemporary
-   Trustworthy

It should not feel:

-   Template-driven
-   Over-animated
-   Generic SaaS
-   Overly corporate
-   Visually crowded
-   "AI generated"
-   Dependent on decorative effects

------------------------------------------------------------------------

## 3. Business Objectives

### Primary objectives

1.  Establish a strong digital identity for ASN Media.
2.  Showcase services clearly.
3.  Showcase selected work and creative capabilities.
4.  Convert visitors into project inquiries.
5.  Communicate premium positioning through design quality.
6.  Provide a strong foundation for future content and portfolio
    expansion.

### Secondary objectives

-   Improve brand credibility when prospects search for ASN Media.
-   Give sales/outreach teams a destination to share.
-   Provide a reusable visual system for future ASN Media pages.
-   Establish a scalable component architecture.

------------------------------------------------------------------------

## 4. Success Criteria

The first release is successful when:

-   A first-time visitor understands what ASN Media does within
    approximately 5--10 seconds.
-   Services are understandable without reading large blocks of copy.
-   Selected work is visually prominent.
-   The primary CTA is always easy to discover.
-   The site feels premium without relying on heavy animation.
-   The site is responsive across desktop, tablet, and mobile.
-   Lighthouse/performance quality is treated as a first-class
    requirement.
-   The design system can be extended without introducing inconsistent
    colors, spacing, typography, buttons, or radii.
-   Contact/project inquiry flow works reliably.

------------------------------------------------------------------------

## 5. Target Audiences

### A. Business Owners / Founders

Need: - Brand growth - Social media management - Content - Campaign
execution - A trusted creative partner

Website requirement: - Quickly understand capabilities and credibility.

### B. Marketing Teams

Need: - External creative capacity - Video/content production - Social
campaigns - Brand strategy

Website requirement: - Quickly evaluate services and work quality.

### C. Local / Regional Businesses

Need: - Professional digital presence - Social content - Video - Brand
positioning

Website requirement: - Make ASN Media approachable while retaining
premium positioning.

### D. Creative / Partnership Prospects

Need: - Production capabilities - Portfolio - Collaboration information

Website requirement: - Strong visual storytelling and easy contact.

------------------------------------------------------------------------

# 6. Information Architecture

## Primary navigation

-   Home
-   Work
-   Services
-   About
-   Insights (optional for v1; architecture should support it)
-   Contact

Primary CTA:

**Let's Talk**

### Suggested routes

``` text
/
 /work
 /services
 /about
 /contact
 /insights              # optional v1.1
 /work/:slug
 /services/:slug
```

------------------------------------------------------------------------

# 7. Homepage Requirements

## 7.1 Navigation

### Requirements

-   Minimal desktop navigation.
-   ASN Media logo on the left.
-   Navigation links centered/right.
-   Primary CTA on the right.
-   Responsive mobile navigation.
-   Sticky/fixed behavior may be used, but must remain visually quiet.
-   No oversized navigation.
-   No excessive blur or glass effects.

### Desktop structure

``` text
[ ASN MEDIA ]     Work  Services  About  Insights     [ LET'S TALK ]
```

### Mobile

``` text
[ ASN ]                                      [ MENU ]
```

------------------------------------------------------------------------

## 7.2 Hero

### Objective

Immediately establish ASN Media as a premium creative/media company.

### Content hierarchy

Eyebrow:

``` text
ASN MEDIA
SOCIAL • CONTENT • GROWTH
```

Primary headline direction:

``` text
Your idea.
Our growth.
```

Alternative approved headline directions:

``` text
We make brands impossible to ignore.
```

or

``` text
Ideas that move culture forward.
```

Supporting copy should be concise and benefit-oriented.

Example:

> We build brands through social strategy, content and visual
> storytelling.

Primary CTA:

``` text
Explore our work →
```

Secondary CTA:

``` text
Let's talk
```

### Visual

Hero should use one strong image or short muted video.

Avoid: - multiple competing images - excessive floating elements - huge
logo treatment - decorative 3D scenes

------------------------------------------------------------------------

## 7.3 Showreel

Purpose: - Demonstrate creative capability immediately after the hero.

Requirements:

-   Large cinematic media block.
-   Play interaction.
-   Short supporting label.
-   Strong whitespace.
-   Video should not autoplay with sound.
-   Poster image must exist for performance and accessibility.

Suggested heading:

> Stories that move people.

------------------------------------------------------------------------

## 7.4 Services

Services must be derived from the existing ASN Media identity:

1.  Social Media Management
2.  Content Creation
3.  Video Production
4.  Brand Strategy

### Preferred layout

Editorial list rather than four conventional cards.

``` text
01  SOCIAL MEDIA MANAGEMENT                         →
    Strategy, content & community.

02  CONTENT CREATION                                →
    Visual stories built for attention.

03  VIDEO PRODUCTION                                →
    Films, reels & campaigns.

04  BRAND STRATEGY                                  →
    Positioning brands for growth.
```

### Interaction

Hover may: - reveal an image - slightly shift an arrow - change
text/accent treatment

Do not: - rotate cards - use 3D transforms - create large
cursor-following effects

------------------------------------------------------------------------

## 7.5 Philosophy / Approach

Dark section.

Suggested eyebrow:

``` text
OUR APPROACH
```

Headline:

> We don't just create content.\
> We create perception.

Three principles:

``` text
01 — STRATEGY
02 — STORY
03 — IMPACT
```

This section provides a visual transition from light to dark and
establishes brand philosophy.

------------------------------------------------------------------------

## 7.6 Selected Work

Purpose: - Make portfolio quality the central proof point.

Requirements:

-   Editorial project presentation.
-   Large media.
-   Project name.
-   Service/category.
-   Year.
-   Short result/description when available.
-   Link to case study/project page.

Avoid: - dense 12-card grids - excessive metadata - fake metrics -
unsupported claims

### Example

``` text
SELECTED WORK

01
[ LARGE IMAGE / VIDEO ]

Brand Name
Social Campaign
2026

View project →
```

Project presentation may alternate image/text alignment to create
rhythm.

------------------------------------------------------------------------

## 7.7 CTA

A focused gold section should appear near the end of the homepage.

Headline:

> Your idea.\
> Our growth.

CTA:

``` text
Start a project →
```

Gold is an accent and should not dominate the whole website.

------------------------------------------------------------------------

## 7.8 Footer

Dark footer.

Include:

-   ASN Media logo
-   Services
-   Navigation
-   Social links
-   Contact email
-   Copyright
-   Optional location

The existing circular ASN logo can be used here as a secondary brand
artifact rather than dominating the primary navigation.

------------------------------------------------------------------------

# 8. Services Page

Each service should have:

-   Hero statement
-   Service description
-   What is included
-   Process
-   Selected work
-   CTA

## Social Media Management

Potential areas:

-   Strategy
-   Content planning
-   Publishing
-   Community management
-   Reporting

## Content Creation

Potential areas:

-   Creative concepts
-   Photography
-   Social assets
-   Campaign content

## Video Production

Potential areas:

-   Reels
-   Brand films
-   Campaign videos
-   Product videos

## Brand Strategy

Potential areas:

-   Positioning
-   Messaging
-   Visual direction
-   Growth strategy

Final commercial scope should be confirmed by ASN Media.

------------------------------------------------------------------------

# 9. Work / Portfolio Requirements

Portfolio should be CMS/data driven even if the first release uses
static JSON.

Each project:

``` text
{
  id,
  slug,
  title,
  client,
  category,
  year,
  coverImage,
  media,
  description,
  services,
  featured,
  externalUrl
}
```

Project detail page should support:

-   Hero media
-   Overview
-   Services delivered
-   Project story
-   Gallery/video
-   CTA
-   Next project

------------------------------------------------------------------------

# 10. About Page

Purpose:

Humanize ASN Media and explain the company's approach.

Recommended structure:

1.  Intro statement
2.  Company story
3.  What ASN Media believes
4.  Capabilities
5.  Team (only if real team information is available)
6.  CTA

Do not invent: - clients - awards - statistics - years of experience -
team credentials - performance results

------------------------------------------------------------------------

# 11. Contact Page

The contact page is a conversion page.

Fields:

-   Name
-   Company
-   Email
-   Phone (optional)
-   Service interested in
-   Project description
-   Budget range (optional)
-   Timeline (optional)

CTA:

``` text
Start a conversation
```

### UX requirements

-   Clear validation
-   Accessible labels
-   Loading state
-   Success state
-   Error state
-   Spam protection
-   No double submission

------------------------------------------------------------------------

# 12. Content Requirements

Copy must be:

-   concise
-   confident
-   specific
-   human
-   free from generic AI phrasing

Avoid phrases such as:

-   "We take your brand to the next level"
-   "Unlock your potential"
-   "Revolutionize your digital presence"

unless they are intentionally rewritten into specific ASN Media
language.

------------------------------------------------------------------------

# 13. Motion Requirements

### Motion budget

Animation is supporting content, not the product.

Allowed:

-   200--700ms UI transitions
-   text reveal
-   image reveal
-   subtle scale
-   section reveal
-   smooth scrolling
-   hover transitions
-   understated page transitions

Avoid:

-   continuous background animation
-   excessive parallax
-   constant cursor effects
-   spinning elements
-   animated gradients
-   unnecessary 3D
-   animation on every element

### Accessibility

Respect:

``` css
@media (prefers-reduced-motion: reduce)
```

All non-essential motion must be reduced or removed.

------------------------------------------------------------------------

# 14. Responsive Requirements

Breakpoints should be designed around content rather than device names.

Minimum support:

-   1440px+
-   1280px
-   1024px
-   768px
-   390px
-   375px

Mobile must not be a compressed desktop.

Mobile requirements:

-   simplified navigation
-   reduced typography scale
-   stacked content
-   touch-friendly CTAs
-   reduced animation
-   optimized media
-   no horizontal overflow

------------------------------------------------------------------------

# 15. Accessibility Requirements

Target WCAG 2.2 AA where practical.

Requirements:

-   semantic HTML
-   keyboard navigation
-   visible focus states
-   accessible form labels
-   alt text
-   sufficient contrast
-   reduced-motion support
-   descriptive links
-   accessible mobile menu
-   video captions where applicable

------------------------------------------------------------------------

# 16. SEO Requirements

Every indexable page needs:

-   unique title
-   meta description
-   canonical URL
-   Open Graph metadata
-   Twitter/X metadata where appropriate
-   semantic headings
-   descriptive image alt text
-   sitemap
-   robots.txt
-   structured data where appropriate

Potential structured data:

-   Organization
-   WebSite
-   Service
-   BreadcrumbList

Do not create fake reviews or unsupported organization claims.

------------------------------------------------------------------------

# 17. Performance Requirements

Target:

-   LCP \< 2.5s
-   CLS \< 0.1
-   INP \< 200ms where achievable
-   optimized images
-   responsive image sizes
-   lazy loading below the fold
-   preloading only critical assets
-   no unnecessary JavaScript

### Media strategy

Use: - WebP/AVIF for images - optimized MP4/WebM for video where
appropriate - poster images - Cloudinary transformations if Cloudinary
is used

Do not ship unnecessarily large 4K assets to mobile devices.

------------------------------------------------------------------------

# 18. Technical Architecture

## Frontend

``` text
React
Vite
Tailwind CSS
GSAP
Lenis
Lucide React
```

## Initial data

Static JSON/content modules.

Example:

``` text
src/
  data/
    services.js
    projects.js
    site.js
```

## Suggested architecture

``` text
src/
├── assets/
├── components/
│   ├── layout/
│   ├── navigation/
│   ├── sections/
│   ├── ui/
│   └── media/
├── data/
├── pages/
├── hooks/
├── lib/
├── styles/
└── App.jsx
```

------------------------------------------------------------------------

# 19. Component Requirements

Core reusable components:

-   Navbar
-   MobileMenu
-   Button
-   SectionLabel
-   Container
-   Hero
-   MediaBlock
-   ServiceList
-   ServiceItem
-   ProjectCard
-   ProjectGrid
-   ProjectHero
-   CTASection
-   Footer
-   ContactForm
-   Reveal
-   PageTransition

Components must use design tokens rather than arbitrary values wherever
practical.

------------------------------------------------------------------------

# 20. Content / CMS Roadmap

### V1

Static content / JSON.

### V1.1

Headless CMS for:

-   Projects
-   Services
-   Insights
-   Testimonials

### V2

Admin dashboard if operationally required.

------------------------------------------------------------------------

# 21. Security

For the initial frontend:

-   no secrets in client code
-   no exposed API credentials
-   sanitize contact data
-   use server-side form processing
-   rate-limit contact endpoint
-   spam protection
-   secure external links where needed

------------------------------------------------------------------------

# 22. Analytics

Analytics should measure:

-   page views
-   CTA clicks
-   project views
-   contact form starts
-   contact form submissions
-   outbound social clicks

Avoid collecting unnecessary personal data.

------------------------------------------------------------------------

# 23. Development Phases

## Phase 1 --- Foundation

-   Vite/React setup
-   Tailwind
-   design tokens
-   fonts
-   routing
-   base components

## Phase 2 --- Homepage

-   navbar
-   hero
-   showreel
-   services
-   philosophy
-   selected work
-   CTA
-   footer

## Phase 3 --- Internal Pages

-   Work
-   Project detail
-   Services
-   About
-   Contact

## Phase 4 --- Motion

-   GSAP reveals
-   transitions
-   hover states
-   Lenis
-   reduced-motion support

## Phase 5 --- Optimization

-   responsive QA
-   accessibility
-   SEO
-   Lighthouse
-   image optimization
-   browser testing

## Phase 6 --- Launch

-   production build
-   domain
-   analytics
-   forms
-   sitemap
-   robots
-   final QA

------------------------------------------------------------------------

# 24. Definition of Done

A release is considered complete when:

-   [ ] All primary pages exist.
-   [ ] Navigation works on desktop and mobile.
-   [ ] All CTAs work.
-   [ ] Contact form works.
-   [ ] No horizontal overflow.
-   [ ] No console errors.
-   [ ] Images have appropriate dimensions.
-   [ ] Images have alt text.
-   [ ] Reduced motion works.
-   [ ] SEO metadata exists.
-   [ ] Sitemap and robots are configured.
-   [ ] Lighthouse has been reviewed.
-   [ ] Mobile QA completed.
-   [ ] Tablet QA completed.
-   [ ] Desktop QA completed.
-   [ ] All real company copy/assets have been verified.
-   [ ] No placeholder/fake claims remain.

------------------------------------------------------------------------

# 25. Non-Goals

The first version will NOT attempt to build:

-   a full CMS
-   a complex admin dashboard
-   a client portal
-   a social media scheduling platform
-   an analytics SaaS
-   excessive 3D/WebGL experiences
-   complex interactive storytelling requiring heavy JavaScript

The priority is a **premium, fast, focused marketing website**.

------------------------------------------------------------------------

# 26. Product Principle

> **Make the content feel expensive, not the effects.**

Whitespace, typography, photography, composition and restraint should
carry the experience.
