# space-snake-ai

Space Snake played by AI - A game built with Phaser3, TypeScript, and React, featuring AI-driven gameplay using neural networks and genetic algorithms.

## Project Structure

This project uses multiple TypeScript configuration files to handle different build contexts and requirements. Here's an explanation of each configuration file:

## TypeScript Configuration Files

### 1. `tsconfig.json` (Root/Project References)
```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

**Purpose**: This is the root TypeScript configuration that uses TypeScript's Project References feature. It doesn't compile any files directly but orchestrates the compilation of multiple sub-projects.

**Usage**: 
- Enables building multiple related TypeScript projects together
- Allows for incremental builds across project boundaries
- Used by IDEs for better intellisense and type checking across the entire workspace

### 2. `tsconfig.app.json` (Main Application)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "jsx": "react-jsx",
    "moduleResolution": "bundler",
    "noEmit": true,
    // ... strict type checking options
  },
  "include": ["src"]
}
```

**Purpose**: Configuration for the main React/Phaser application code in the `src/` directory.

**Key Features**:
- **Target**: ES2020 for modern JavaScript features
- **Libraries**: Includes DOM types for browser APIs
- **Module System**: ESNext with bundler resolution for Vite
- **JSX**: Configured for React JSX transformation
- **No Emit**: Files are processed by Vite, not TypeScript compiler
- **Strict Mode**: Full strict type checking enabled

**Usage**: Used by Vite during development and build processes for the main application.

### 3. `tsconfig.node.json` (Build Tools)
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    // ... build tool specific options
  },
  "include": ["vite.config.ts"]
}
```

**Purpose**: Configuration for Node.js-based build tools and configuration files.

**Key Features**:
- **Target**: ES2022 for Node.js compatibility
- **Libraries**: ES2023 for latest Node.js features
- **Scope**: Only includes build configuration files like `vite.config.ts`

**Usage**: Used by Vite and other build tools when processing configuration files.

### 4. `tsconfig-node.json` (CLI Applications)
```json
{
  "ts-node": {
    "compilerOptions": {
      "module": "commonjs",
      "target": "es2020",
      "lib": ["es2020"],
      "strict": false,
      "esModuleInterop": true
    }
  }
}
```

**Purpose**: Specialized configuration for Node.js CLI applications that need to be executed directly with `ts-node`.

**Key Features**:
- **Module System**: CommonJS for Node.js compatibility
- **Target**: ES2020 for modern Node.js versions
- **Strict Mode**: Disabled for simpler CLI development
- **ES Module Interop**: Enabled for mixing CommonJS and ES modules

**Usage**: Used specifically for running TypeScript CLI files like `hello-world.ts` with `ts-node`.

## Why Multiple Configurations?

### Separation of Concerns
- **Browser Code** (`tsconfig.app.json`): Optimized for modern browsers with DOM APIs
- **Node.js Tools** (`tsconfig.node.json`): Optimized for build tools and server-side execution
- **CLI Scripts** (`tsconfig-node.json`): Optimized for direct execution with minimal configuration

### Different Module Systems
- **ESNext Modules**: Used for the main app (handled by Vite bundler)
- **CommonJS**: Used for CLI tools (direct Node.js execution)

### Build Performance
- **Project References**: Enable incremental compilation
- **Targeted Compilation**: Only compile what's needed for each context
- **Parallel Processing**: Different parts can be built simultaneously

### Development Experience
- **Better IDE Support**: Each context gets appropriate type checking
- **Isolated Environments**: Browser code doesn't see Node.js types and vice versa
- **Flexible Tooling**: Each configuration can use different compiler options

## Commands

- `npm run dev` - Start development server (uses `tsconfig.app.json`)
- `npm run build` - Build for production (uses `tsconfig.app.json`)
- `npm run hello` - Run CLI application (uses `tsconfig-node.json`)

This multi-configuration setup provides a robust, scalable TypeScript development environment that can handle different runtime environments and build requirements efficiently.