# Thy & Vy Nails Design System

## Direction

A calm, image-led local salon website inspired by the tactile order of a modern reception space: slate-eucalyptus upholstery, champagne metal details, clean white work surfaces, and restrained botanical softness. The composition is asymmetric and editorial in pacing, but never resembles a magazine template.

## Color

- Primary: `oklch(0.62 0.045 184)` / `#6F8F8B`
- Primary dark: `oklch(0.45 0.05 184)` / `#3F625E`
- Primary pale: `oklch(0.90 0.025 184)` / `#DCE7E5`
- Canvas: `oklch(0.975 0.004 95)` / `#F8F7F3`
- Ink: `oklch(0.27 0.008 80)` / `#252525`
- Champagne accent: `oklch(0.73 0.09 79)` / `#C8A96B`
- White: `oklch(0.995 0 0)`

Primary dark must be used for normal-size text on light backgrounds. Pale green is a surface color, not a body-text color.

## Typography

Use “Libre Baskerville” for display headlines and “Manrope” for interface and body text. Libre Baskerville has sturdier strokes and a calmer reading rhythm than a fashion-display serif, while Manrope keeps German service and pricing copy highly legible. Display emphasis uses weight and color rather than italic styling. Load both with `font-display: swap` and sensible local fallbacks.

Fluid scale:

- Hero: `clamp(3rem, 7vw, 6rem)`
- Section heading: `clamp(2.2rem, 4.5vw, 4.4rem)`
- Subheading: `clamp(1.35rem, 2vw, 1.8rem)`
- Body: `clamp(1rem, 0.3vw + 0.92rem, 1.08rem)`

## Layout

Mobile-first, with a content width of 1240 px and fluid side padding. Alternate full-bleed colored moments with generous light sections. Use asymmetric two-column compositions for hero, introduction, booking, and contact. Pricing is functional and dense, with three clearly separated groups rather than decorative cards.

## Components

- Sticky header with the supplied crest shown intact beside a crisp HTML wordmark, compact desktop navigation, and an accessible mobile drawer.
- Buttons use pill geometry only for direct actions; primary actions are dark eucalyptus, secondary actions are restrained outlines.
- Service groups use typography, thin dividers, and one shared image composition rather than repeated icon cards.
- Gallery uses an irregular masonry-like grid and native dialog lightbox.
- Booking band uses a committed primary-dark surface with champagne details.
- Floating WhatsApp action remains visible without obscuring content.
- A champagne trust rail, low-opacity logo watermark, precise section rules, and subtle circular atelier motifs create a recognizable boutique identity without introducing new colors.

## Motion

Motion intensity is restrained. The hero image settles on load; section content uses small directional reveals driven by IntersectionObserver; gallery images scale subtly on hover. All non-essential transitions are removed under `prefers-reduced-motion: reduce`.

## Imagery

Prioritize authentic salon interior, finished nails, and treatment process images from the supplied material. Crops should feel close, tactile, and clean. Avoid clichéd spa stones, flowers on towels, or anonymous pink stock imagery.

### Custom campaign set

The production site uses a custom “quiet couture” image family: believable boutique interiors, tactile close-ups, precise treatment moments, and graphic product still lifes. Every image shares eucalyptus, off-white, oxblood, and restrained champagne accents. Avoid spa stones, towels, orchids, pink-heavy decoration, and anonymous stock imagery.
