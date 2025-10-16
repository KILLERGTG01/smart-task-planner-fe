# Contributing to Smart Task Planner

Thank you for your interest in contributing to Smart Task Planner! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Issues

1. **Search existing issues** to avoid duplicates
2. **Use the issue template** when creating new issues
3. **Provide detailed information** including:
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)
   - Browser and OS information

### Suggesting Features

1. **Check the roadmap** to see if it's already planned
2. **Create a feature request** with:
   - Clear description of the feature
   - Use cases and benefits
   - Possible implementation approach

### Code Contributions

#### Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/yourusername/smart-task-planner-fe.git
   ```
3. **Install dependencies**
   ```bash
   npm install
   ```
4. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

#### Development Guidelines

##### Code Style
- Use **TypeScript** for all new code
- Follow **ESLint** rules (run `npm run lint`)
- Use **Prettier** for formatting (run `npm run format`)
- Write **meaningful commit messages** using conventional commits

##### Component Guidelines
- Use **functional components** with hooks
- Implement **proper TypeScript types**
- Follow **React best practices**
- Add **JSDoc comments** for complex functions

##### Testing
- Write **unit tests** for new components
- Add **integration tests** for new features
- Ensure **100% test coverage** for critical paths
- Run tests before submitting: `npm test`

##### Performance
- Optimize **bundle size** (check with `npm run analyze`)
- Use **React.memo** for expensive components
- Implement **proper loading states**
- Follow **accessibility guidelines**

#### Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new functionality
3. **Run the full test suite**
   ```bash
   npm run test
   npm run lint
   npm run type-check
   ```
4. **Update the README** if you've added features
5. **Create a pull request** with:
   - Clear title and description
   - Link to related issues
   - Screenshots of UI changes
   - Testing instructions

#### Commit Message Format

Use conventional commits:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(timeline): add task dependency visualization
fix(form): resolve validation error handling
docs(readme): update installation instructions
```

## 🏗️ Project Structure

```
src/
├── app/
│   ├── components/     # Reusable UI components
│   ├── lib/           # Utilities and configurations
│   ├── types/         # TypeScript type definitions
│   └── globals.css    # Global styles
├── public/            # Static assets
└── tests/            # Test files
```

## 🧪 Testing Guidelines

### Unit Tests
- Test **component behavior**, not implementation
- Use **React Testing Library** for component tests
- Mock **external dependencies**
- Test **error scenarios**

### Integration Tests
- Test **user workflows**
- Test **API integrations**
- Use **MSW** for API mocking

### E2E Tests
- Test **critical user paths**
- Use **Playwright** for browser testing
- Test on **multiple browsers**

## 📋 Code Review Checklist

Before submitting a PR, ensure:

- [ ] Code follows project conventions
- [ ] All tests pass
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Documentation is updated
- [ ] Performance impact is considered
- [ ] Accessibility is maintained
- [ ] Mobile responsiveness is preserved

## 🚀 Release Process

1. **Version bump** following semantic versioning
2. **Update CHANGELOG.md**
3. **Create release notes**
4. **Tag the release**
5. **Deploy to production**

## 💡 Development Tips

### Local Development
```bash
# Start development server
npm run dev

# Run tests in watch mode
npm run test:watch

# Check types
npm run type-check

# Lint and fix
npm run lint:fix
```

### Debugging
- Use **React Developer Tools**
- Enable **TypeScript strict mode**
- Use **console.log** sparingly (prefer debugger)
- Test in **multiple browsers**

### Performance Monitoring
- Use **Lighthouse** for performance audits
- Monitor **bundle size** with webpack-bundle-analyzer
- Check **Core Web Vitals**

## 🎯 Areas for Contribution

We especially welcome contributions in:

- **UI/UX improvements**
- **Performance optimizations**
- **Accessibility enhancements**
- **Test coverage improvements**
- **Documentation updates**
- **Bug fixes**
- **Feature implementations**

## 📞 Getting Help

If you need help:

1. **Check the documentation**
2. **Search existing issues**
3. **Ask in discussions**
4. **Contact maintainers**

## 🙏 Recognition

Contributors will be:
- **Listed in README.md**
- **Mentioned in release notes**
- **Given credit in commit messages**

Thank you for contributing to Smart Task Planner! 🚀