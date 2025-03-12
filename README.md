# Night City Mission Board

A cyberpunk-themed mission board application built with React, TypeScript, and styled-components. This interactive web application presents available missions in a dystopian cyberpunk aesthetic inspired by games like Cyberpunk 2077.

![Night City Mission Board](https://placeholder-for-screenshot.com)

## Features

- 🌃 Immersive cyberpunk visual design with neon elements and futuristic UI
- 💾 Interactive mission cards with difficulty indicators and reward displays
- 🖥️ Detailed mission information modal with animations
- 🔍 Filter missions by difficulty level
- 📱 Responsive layout for various screen sizes
- ✨ Animated elements using Framer Motion
- 🎨 Custom cyberpunk styling with CSS-in-JS via styled-components

## Tech Stack

- React 19
- TypeScript
- styled-components
- Framer Motion for animations
- Modern ES6+ JavaScript

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/cyberpunk-mission-board.git
cd cyberpunk-mission-board
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm start
# or
yarn start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

```
cyberpunk-mission-board/
├── public/               # Static files
├── src/                  # Source files
│   ├── components/       # React components
│   │   ├── MissionDetailModal.tsx
│   │   ├── NavHeader.tsx
│   │   └── CyberFooter.tsx
│   ├── App.tsx           # Main application component
│   ├── index.tsx         # Entry point
│   └── index.css         # Global styles
├── package.json          # Dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

## Usage

- Browse available missions on the main board
- Filter missions by difficulty using the filter buttons
- Click on any mission card to see detailed information
- Use the navigation menu to explore different sections (for demonstration purposes only)

## Customization

### Adding More Missions

To add more missions, modify the `SAMPLE_MISSIONS` array in the `App.tsx` file:

```typescript
const SAMPLE_MISSIONS: Mission[] = [
  {
    id: "005",
    title: "Your New Mission",
    description: "Description of the mission",
    reward: "¥1,000",
    difficulty: "medium",
    fixer: "Fixer Name",
    location: "Location",
    deadline: "Time Limit"
  },
  // ...other missions
];
```

### Changing the Color Scheme

The app uses CSS variables for the main color scheme. You can modify these in the `index.css` file:

```css 
:root {
  --neon-blue: #00f6ff;
  --neon-pink: #ff3e88;
  --neon-yellow: #faff00;
  --dark-bg: #0a0a12;
  --panel-bg: rgba(18, 18, 33, 0.8);
  --text-color: #e4f3ff;
  --text-secondary: #b8c0c2;
}
```

## Sound Effects

The application includes a sound toggle option in the splash screen. To enable sound, you need to add the following audio files to the `public/sounds` directory:

- `ambient.mp3` - Background ambient music (loop) for the cyberpunk atmosphere
- `glitch.mp3` - Glitchy digital sound effect that plays occasionally
- `access_granted.mp3` - Sound that plays when you press Enter to access the mission board
- `button_hover.mp3` - Sound that plays when hovering over buttons

You can find suitable free sound effects on sites like:
- [Freesound.org](https://freesound.org/)
- [Zapsplat](https://www.zapsplat.com/)
- [Mixkit](https://mixkit.co/free-sound-effects/)

Look for cyberpunk, sci-fi, or digital sound effects that match the theme.

## Boot Sequence Animation

The application now features a boot sequence animation that simulates a system startup before displaying the "Hello Psycho" splash screen. This creates a more immersive cyberpunk experience.

If you want to customize the boot sequence:
1. Open `src/components/BootSequence.tsx`
2. Modify the text, timing, and appearance of the boot messages
3. Adjust the `totalDuration` variable to control how long the boot sequence lasts

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by the cyberpunk genre and games like Cyberpunk 2077
- Fonts: Rajdhani and Share Tech Mono from Google Fonts
- All mission content is fictional and created for demonstration purposes

---

*"Find a job. Get paid. Stay alive."* - Night City Mission Board
