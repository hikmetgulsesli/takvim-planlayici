# Design System Document: The Chronos Editorial

## 1. Overview & Creative North Star: "The Digital Curator"
This design system moves away from the rigid, spreadsheet-like nature of traditional calendars. Our Creative North Star is **The Digital Curator**. We treat time not as a series of boxes to be filled, but as a high-end editorial layout. 

By leveraging intentional asymmetry, varying tonal depths, and sophisticated typography, we transform a productivity tool into a premium experience. We break the "template" look by prioritizing breathing room (negative space) and utilizing "soft-brutalism"—where sharp information is housed in soft, organic containers.

## 2. Color Theory & Tonal Depth
We utilize a sophisticated "Midnight" palette. The goal is to create a sense of infinite depth, where elements don't just sit "on" the screen, but emerge "from" it.

### Core Palette (Material Design Mapping)
- **Surface (Background):** `#0b1326` (Deep Midnight)
- **Surface Container Low:** `#131b2e` (The Workspace)
- **Surface Container High:** `#222a3d` (Active Cards/Modals)
- **Primary:** `#c0c1ff` (Soft Indigo Glow)
- **Primary Container:** `#8083ff` (Active State Accent)
- **Tertiary:** `#ffb783` (Warm Attention/Alert)

### The "No-Line" Rule
**Strict Mandate:** Designers are prohibited from using 1px solid borders for sectioning. 
Structure must be achieved through:
1.  **Background Shifts:** Place a `surface-container-high` event card inside a `surface-container-low` day column.
2.  **Tonal Transitions:** Use the `surface-container` tiers to define hierarchy. An inner container should always be one tier "brighter" or "darker" than its parent to denote nesting.

### The Glass & Gradient Rule
To achieve a "Signature" feel, floating elements (like Quick Add buttons or Hover Tooltips) must use **Glassmorphism**:
- **Background:** `surface-variant` at 60% opacity.
- **Blur:** `backdrop-filter: blur(12px)`.
- **CTA Soul:** Main buttons should never be flat. Use a subtle linear gradient from `primary` to `primary-container` at a 135-degree angle.

## 3. Typography: Editorial Authority
We pair **Manrope** (Display/Headlines) with **Inter** (UI/Body) to balance character with extreme legibility.

| Level | Token | Font | Size | Character |
| :--- | :--- | :--- | :--- | :--- |
| **Display** | `display-lg` | Manrope | 3.5rem | Bold, tight tracking. For "Ay" (Month) views. |
| **Headline** | `headline-sm` | Manrope | 1.5rem | Semi-bold. For "Etkinlikler" (Events) headers. |
| **Title** | `title-md` | Inter | 1.125rem | Medium. For "Toplantı Başlığı" (Meeting Titles). |
| **Body** | `body-md` | Inter | 0.875rem | Regular. For descriptions and notes. |
| **Label** | `label-sm` | Inter | 0.6875rem | Uppercase, +0.05em tracking. For "SAAT" (Time) markers. |

**Turkish Language Note:** Ensure `line-height` for Manrope is increased by 10% to accommodate Turkish ascenders and descenders (ğ, ş, İ) without visual crowding.

## 4. Elevation & Depth: The Layering Principle
Hierarchy is achieved through **Tonal Layering** rather than structural lines.

- **Stacking:** Place `surface-container-lowest` cards on a `surface-container-low` section to create a soft, natural lift. 
- **Ambient Shadows:** For floating Modals, use a "Tinted Shadow." Instead of black, use a 64px blur shadow at 8% opacity using the `primary` color hex. This mimics the glow of a dark mode screen.
- **The Ghost Border:** If a border is required for accessibility (e.g., Input Fields), use `outline-variant` at **15% opacity**. This creates a "suggestion" of a boundary that doesn't clutter the minimalist aesthetic.

## 5. Components

### Cards & Lists (The Calendar Grid)
- **Guideline:** Forbid the use of divider lines.
- **Implementation:** Separate hours in the day view using the **Spacing Scale `8` (2rem)**. Use `surface-container-low` for the weekend columns to differentiate from weekdays without drawing a single line.

### Buttons (Aksiyon Butonları)
- **Primary:** Gradient (`primary` to `primary-container`), `xl` (1.5rem) roundedness. Label in `on-primary-fixed-variant`.
- **Tertiary:** No background. `label-md` typography. Use `primary` color for text.

### Event Presets (Etkinlik Renkleri)
Events must not be fully saturated "neon" colors. Use the "Muted Glow" approach:
- **Red/Pink:** Use `error_container` for the background and `error` for the left-accent strip.
- **Yellow/Orange:** Use `tertiary_container` for the background and `tertiary` for the text.

### Input Fields (Giriş Alanları)
- **Style:** `surface-container-highest` background, `md` roundedness.
- **State:** On focus, the "Ghost Border" transitions to 100% opacity `primary` color.

### Floating Action Button (Yeni Etkinlik)
- **Style:** Glassmorphic container with a `primary` glow shadow. Positioned asymmetrically (e.g., Bottom Right with `spacing-10` padding) to break the grid.

## 6. Do’s and Don’ts

### Do
- **Do** use `spacing-6` (1.5rem) as your default "breathing room" between major UI modules.
- **Do** use `Manrope` for all numerical data (dates, times) to give it a modern, geometric feel.
- **Do** use Turkish terminology correctly: "Kaydet" instead of "Save", "Vazgeç" instead of "Cancel".

### Don’t
- **Don't** use `#000000` for shadows. It kills the "Midnight" depth.
- **Don't** use 1px dividers to separate the sidebar from the main content; use a shift from `surface-dim` to `surface-container-low`.
- **Don't** crowd the interface. If an element isn't functional, it shouldn't be visible until hover.