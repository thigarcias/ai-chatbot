# AI Chatbot Development Guide

## Commands
- `npm run dev` - Start development server with Turbo
- `npm run build` - Build for production (runs prisma generate first)
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:unsafe` - Run ESLint and Biome with unsafe flag
- `npm run lint:fix` - Auto-fix ESLint issues
- `npm run format` - Format code using Biome

## Code Style
- **TypeScript**: No semicolons, use single quotes for strings
- **CSS**: Use double quotes for strings
- **Formatting**: 2-space indentation, 80 character line width
- **Components**: Follow React functional component patterns
- **Naming**: Use camelCase for variables/functions, PascalCase for components
- **Error Handling**: Use try/catch blocks for async operations
- **Types**: Avoid `any` when possible, use proper type definitions
- **Imports**: Group imports by external/internal, clean up unused imports

This project creates an intuitive UI for interacting with AI models, similar to ChatGPT but with model selection capabilities.