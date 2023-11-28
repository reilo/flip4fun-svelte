# TailwindCSS

## Install Tailwind

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## svelte.config.js

import { vitePreprocess } from '@sveltejs/kit/vite';
preprocess: vitePreprocess()

## tailwind.config.js

content: ['./src/**/*.{html,js,svelte,ts}'],

## app.css

```bash
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## +layout.svelte

```bash
import "../app.css";
```