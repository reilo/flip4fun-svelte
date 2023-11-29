# TailwindCSS

## Install Tailwind

```bash
npm install -D tailwindcss postcss autoprefixer
```
```bash
npx tailwindcss init -p
```

## svelte.config.js

```bash
import { vitePreprocess } from '@sveltejs/kit/vite';
```
```bash
preprocess: vitePreprocess()
```

## tailwind.config.js

```bash
content: ['./src/**/*.{html,js,svelte,ts}'],
```

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