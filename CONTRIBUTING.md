# Contributing to Bean Haven Café

First off, thank you for considering contributing to Bean Haven Café! It's people like you that make this project better for everyone.

## Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title** and description
- **Steps to reproduce** the behavior
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Environment details**:
  - OS and version
  - Node.js version
  - Browser and version
  - npm/yarn version

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear title** describing the enhancement
- **Provide detailed description** of the suggested enhancement
- **Explain why** this enhancement would be useful
- **List alternatives** you've considered

### Pull Requests

1. **Fork** the repository
2. **Create branch** from `main`:
   ```bash
   git checkout -b feature/amazing-feature
   # or
   git checkout -b fix/bug-fix
   ```
3. **Make changes** following our coding standards
4. **Commit** with meaningful messages:
   ```bash
   git commit -m "feat: add user wishlist feature"
   git commit -m "fix: resolve cart quantity bug"
   git commit -m "docs: update API documentation"
   ```
5. **Push** to your fork
6. **Open Pull Request** with:
   - Clear title and description
   - Reference to related issues
   - Screenshots/GIFs for UI changes
   - Test results

## Development Setup

### Quick Start

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/bean-haven-cafe.git
cd bean-haven-cafe

# Install dependencies
npm install --legacy-peer-deps

# Start in demo mode (no database needed)
npm run dev
```

### With MongoDB

```bash
# Set up environment
cp .env.example .env.local
# Edit .env.local with your MongoDB URI

# Seed database
npm run seed

# Start development server
DEMO_MODE=false npm run dev
```

## Coding Standards

### TypeScript

- **Use explicit types** - avoid `any` unless absolutely necessary
- **Interface over type** for object shapes
- **Functional components** with TypeScript
- **Props typing** for all components

```typescript
// Good
interface ButtonProps {
  text: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ text, onClick, variant = 'primary' }) => {
  // ...
}

// Avoid
export const Button = (props: any) => {
  // ...
}
```

### React Best Practices

- **Use hooks** instead of class components
- **Extract logic** into custom hooks when reusable
- **Memoize expensive calculations** with `useMemo`
- **Optimize re-renders** with `useCallback`
- **Keep components small** (< 200 lines ideally)

### Naming Conventions

- **Components**: PascalCase (`ProductCard.tsx`)
- **Utilities**: camelCase (`formatPrice.ts`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_ITEMS`)
- **Files**: Match the export (`Button.tsx` exports `Button`)

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add wishlist functionality
fix: resolve cart persistence issue
docs: update API documentation
style: format code with prettier
refactor: optimize product query logic
test: add cart component tests
chore: update dependencies
```

### Code Style

We use ESLint and Prettier:

```bash
# Lint code
npm run lint

# Auto-fix linting issues
npm run lint -- --fix

# Format with Prettier (if configured)
npx prettier --write .
```

## Testing Guidelines

### Writing Tests

- Place tests next to the file: `Component.tsx` → `Component.test.tsx`
- Cover **happy path** and **edge cases**
- **Mock external dependencies** (API calls, database)
- Aim for **80%+ coverage** for new features

```typescript
// Example test structure
describe('CartStore', () => {
  it('should add item to cart', () => {
    // Arrange
    const store = useCartStore.getState();
    
    // Act
    store.addItem({ id: '1', name: 'Coffee', price: 4.99 });
    
    // Assert
    expect(store.items).toHaveLength(1);
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

## Project-Specific Guidelines

### Adding New Features

1. **Plan first** - discuss in an issue before large changes
2. **Update types** - add TypeScript interfaces/types
3. **Update docs** - README, API docs, comments
4. **Add tests** - unit tests for new functionality
5. **Check accessibility** - ARIA labels, keyboard nav

### API Route Development

- **Validate input** - never trust client data
- **Handle errors** - use try-catch and return appropriate status codes
- **Authenticate** - check session for protected routes
- **Document** - add JSDoc comments for complex logic

### Component Development

- **Accessibility first** - ARIA labels, semantic HTML, keyboard navigation
- **Mobile responsive** - test on different screen sizes
- **Performance** - avoid unnecessary re-renders
- **Reusability** - create generic components when possible

## File Organization

- **Components** → `/components` directory
- **Pages** → `/app` directory (App Router)
- **API Routes** → `/app/api` directory
- **Utils** → `/lib/utils` directory
- **Types** → `/types` directory or inline with file
- **Models** → `/lib/models` directory

## Documentation

- Update README when adding major features
- Add JSDoc comments for exported functions
- Update CHANGELOG for each release
- Keep API documentation current

## Questions?

Feel free to:
- Open an issue for discussion
- Ask in pull request comments
- Check existing documentation

---

**Thank you for contributing!** Every contribution, no matter how small, helps make this project better. ☕

