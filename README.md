# Admin.github.io

A base repository for starting a webpage using GitHub Pages.

## 🚀 Quick Start

This repository contains a simple, ready-to-use template for creating a website with GitHub Pages.

### Files Included

- `index.html` - Main HTML file with semantic structure
- `styles.css` - CSS stylesheet with responsive design
- `script.js` - JavaScript file for interactivity
- `.gitignore` - Excludes common development artifacts

## 📝 How to Use

### 1. Enable GitHub Pages

1. Go to your repository settings on GitHub
2. Navigate to the "Pages" section
3. Under "Source", select the branch you want to deploy (usually `main` or `master`)
4. Click "Save"
5. Your site will be published at `https://dreamerend3008.github.io/Admin.github.io/`

### 2. Customize Your Site

- **Edit Content**: Modify `index.html` to add your own content
- **Style Your Site**: Update `styles.css` to change colors, fonts, and layout
- **Add Functionality**: Enhance `script.js` to add interactive features

### 3. Local Development

To preview your site locally:

1. Open `index.html` in your web browser
2. Or use a local server (e.g., with Python):
   ```bash
   python -m http.server 8000
   ```
   Then visit `http://localhost:8000`

## 🎨 Features

- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern HTML5**: Semantic HTML structure
- **Clean CSS**: Well-organized styles with comments
- **Smooth Scrolling**: Navigation with smooth scroll effects
- **Easy to Customize**: Simple structure for beginners
- **Study Summary Section**: Concise research synthesis.
- **Manager Context Section**: Background of founding and current leadership.
- **Interactive Situation Flow**: Clickable steps illustrating Mary Parker Follett's "ley de la situación".
- **Interactive Timeline**: Scrollable, accessible historical milestones.

## 🔍 New Interactive Modules

### Timeline (`#timeline`)
Data rendered desde el arreglo `timelineData` en `script.js`. Para añadir un hito:

```javascript
// Dentro de timelineData
{ year: '2026', title: 'Nueva Expansión', detail: 'Tercera sede y adopción de analítica ambiental avanzada.' }
```

### Flujo Ley de la Situación (`#flujo-situacion`)
Pasos gestionados en `flowStepsData`. Cada objeto contiene: `key`, `title`, `text`.

### Edición de Contenido
Puedes integrar modo edición agregando clases `.editable` y atributo `data-field` siguiendo el patrón existente.

Atajos:
- Ctrl + E: Activar/desactivar edición
- Ctrl + S: Guardar cambios
- Escape: Cancelar edición

## 📚 Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [HTML5 Reference](https://developer.mozilla.org/en-US/docs/Web/HTML)
- [CSS Reference](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

## 🤝 Contributing

Feel free to fork this repository and make it your own!

## 📄 License

This template is free to use for any purpose.