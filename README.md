# toolkit

> 📖 **New to this template?** Check out the [comprehensive setup guide](http://hyperoot.dev/python-template/setup) for detailed instructions on getting started.

---

A starter template for Astro projects with `mise`, Biome, pre-commit hooks, and GitHub Actions.

## Features

- Astro 5 setup with TypeScript support
- Biome for formatting and linting
- `mise` for toolchain and task management
- Pre-commit hooks for local quality checks
- GitHub Actions workflow with Biome CI linting

## Installation

```bash
# Clone your repository
git clone https://github.com/HYP3R00T/toolkit.git
cd toolkit

# Install dependencies
pnpm install
```

## Development

```bash
# Start local dev server
mise run dev
```

## Linting and Formatting

```bash
# Check with Biome
mise run lint

# Apply safe fixes
mise run lint-fix

# Format files
mise run format
```

## Pre-commit

This repository uses pre-commit and includes Biome hooks.

```bash
# Install git hooks locally
pre-commit install

# Run all hooks manually
pre-commit run --all-files
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
