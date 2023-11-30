# TailwindCSS

## Install Tailwind

```bash
npm install -D tailwindcss postcss autoprefixer
```
```bash
npx tailwindcss init -p
```

## Update configuration files

### svelte.config.js

Add the following statements to svelte.config.js:

```bash
import { vitePreprocess } from '@sveltejs/kit/vite';
```
```bash
const config = {
  ...
  preprocess: vitePreprocess()
};
```

### tailwind.config.js

Add the following statement to tailwind.config.js:

```bash
export default {
  content: [
    './src/**/*.{html,js,svelte,ts}',
    ...
  ],
  ...
}
```

## Update application files

### app.css

Add the following statements to app.css:

```bash
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### +layout.svelte

Add the following statement to your layout file:

```bash
import "../app.css";
```