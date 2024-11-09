<!--
Replace the following placeholders with the actual values:
- `<% LIBRARY_BRAND_NAME %>`: Library brand name (e.g., `Waffle`)
- `<% LIBRARY_DESCRIPTION %>`: Library description (e.g., `A library for making waffles`)
- `<% JSR_NAME %>`: JSR name (e.g., `@erictaylor/waffle`)

Make sure to also update the following files as well:
- `CONTRIBUTING.md`
- `LICENSE.md`
-->

# <% LIBRARY_BRAND_NAME %>

<% LIBRARY_DESCRIPTION %>

## Getting Started

### Supported Runtime

This library is designed to be runtime agnostic and work in browsers (Chrome,
Safari, Firefox, Edge), [Deno](https://deno.com/),
[Node.js](https://nodejs.org/), [Bun](https://bun.sh), and
[Cloudflare Workers](https://workers.cloudflare.com/).

### Installation

```bash
# Deno
deno add jsr:<% JSR_NAME %>
# NPM
npx jsr add <% JSR_NAME %>
# PNPM
pnpx jsr add <% JSR_NAME %>
# Yarn
yarn dlx jsr add <% JSR_NAME %>
# Bun
bunx jsr add <% JSR_NAME %>
```

<!-- ### Usage

Please refer to the [documentation](https://jsr.io/<% JSR_NAME %>/doc)
for more information on how to use this library. -->

## Contributing

Code contributions are welcome! Please refer to the
[CONTRIBUTING.md](./CONTRIBUTING.md) file for more information.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE)
file for details.
