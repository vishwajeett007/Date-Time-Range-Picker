# Quick Start Guide

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Storybook (Recommended)
This is the main way to view and test the component with all its stories:
```bash
npm run storybook
```
Then open http://localhost:6006 in your browser.

**Storybook includes:**
- All component variations
- Edge cases
- DST transition tests
- Accessibility testing
- Keyboard navigation demos

### 3. Run Development Server
To run the main Vite dev server:
```bash
npm run dev
```
Then open the URL shown in the terminal (usually http://localhost:5173)

### 4. Run Tests
```bash
# Run tests in watch mode
npm test

# Run tests with UI
npm run test:ui

# Run accessibility tests
npm run test:a11y
```

### 5. Build for Production
```bash
# Build the project
npm run build

# Build Storybook
npm run build-storybook
```

### 6. Code Quality
```bash
# Lint code
npm run lint

# Format code
npm run format
```

## 📖 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run storybook` | Start Storybook (port 6006) |
| `npm run build` | Build for production |
| `npm run build-storybook` | Build static Storybook |
| `npm test` | Run tests |
| `npm run test:ui` | Run tests with UI |
| `npm run lint` | Lint code |
| `npm run format` | Format code with Prettier |

## 🎯 Recommended Workflow

1. **Start Storybook first**: `npm run storybook`
   - This shows all component variations and edge cases
   - Test keyboard navigation
   - Check accessibility

2. **Make changes** to components in `src/components/`

3. **View changes** in Storybook (auto-reloads)

4. **Run tests** to verify: `npm test`

5. **Check accessibility**: Use Storybook's a11y addon

## 🔍 Key Features to Test in Storybook

- ✅ **Default**: Basic usage
- ✅ **With Constraints**: Min/max dates, blackout dates
- ✅ **DST Transition**: Test timezone transitions
- ✅ **Keyboard Navigation**: Full keyboard workflow
- ✅ **Multiple Timezones**: Eastern, Pacific, London, Tokyo
- ✅ **Presets**: Relative and absolute presets

## 📝 Notes

- Storybook is the primary way to interact with the component
- All accessibility testing should be done through Storybook
- Chromatic publishing can be done with: `npm run chromatic` (requires Chromatic account)
