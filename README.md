# React Flow with Next.js

This project demonstrates how to use React Flow with Next.js, creating interactive node-based interfaces with a modern React framework.

## Prerequisites

- Node.js 18.x or higher
- npm (Node Package Manager)

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/kritikumarb/react-flow-next-js.git
cd react-flow-next-js
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```
> Note: We use `--legacy-peer-deps` due to peer dependency conflicts between React 19 RC and React Flow.

3. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/src` - Contains the source code
  - `/app` - Next.js app directory
  - `/components` - React components
- `/public` - Static assets
- `/styles` - CSS and styling files

## Technologies Used

- [Next.js](https://nextjs.org/) - React Framework
- [React Flow](https://reactflow.dev/) - Library for building node-based interfaces
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org/) - JavaScript with syntax for types

## Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint for code linting

## License

[MIT](https://choosealicense.com/licenses/mit/)
