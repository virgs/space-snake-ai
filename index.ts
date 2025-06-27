#!/usr/bin/env node

/**
 * Hello World CLI Application
 *
 * A simple command-line application that demonstrates basic TypeScript/Node.js functionality
 * without requiring a browser environment.
 */

interface GreetingOptions {
  name?: string;
  language?: "en" | "es" | "fr" | "pt";
  uppercase?: boolean;
}

class HelloWorldCLI {
  private greetings = {
    en: "Hello",
    es: "Hola",
    fr: "Bonjour",
    pt: "Olá",
  };

  greet(options: GreetingOptions = {}): string {
    const { name = "World", language = "en", uppercase = false } = options;

    const greeting = this.greetings[language];
    let message = `${greeting}, ${name}!`;

    if (uppercase) {
      message = message.toUpperCase();
    }

    return message;
  }

  displayInfo(): void {
    console.log("🚀 Space Snake AI - Hello World CLI");
    console.log("=====================================");
    console.log(`📅 Current Date: ${new Date().toLocaleDateString()}`);
    console.log(`⏰ Current Time: ${new Date().toLocaleTimeString()}`);
    console.log(`💻 Node.js Version: ${process.version}`);
    console.log(`📂 Working Directory: ${process.cwd()}`);
    console.log("=====================================\n");
  }

  parseArguments(): GreetingOptions {
    const args = process.argv.slice(2);
    const options: GreetingOptions = {};

    for (let i = 0; i < args.length; i++) {
      switch (args[i]) {
        case "--name":
        case "-n":
          options.name = args[i + 1];
          i++; // Skip next argument as it's the value
          break;
        case "--language":
        case "-l":
          const lang = args[i + 1];
          if (lang && ["en", "es", "fr", "pt"].includes(lang)) {
            options.language = lang as GreetingOptions["language"];
          }
          i++; // Skip next argument as it's the value
          break;
        case "--uppercase":
        case "-u":
          options.uppercase = true;
          break;
        case "--help":
        case "-h":
          this.showHelp();
          process.exit(0);
          break;
      }
    }

    return options;
  }

  showHelp(): void {
    console.log(`
🚀 Space Snake AI - Hello World CLI
=====================================

Usage: npm run hello [options]

Options:
  -n, --name <name>        Name to greet (default: "World")
  -l, --language <lang>    Language for greeting (en, es, fr, pt) (default: "en")
  -u, --uppercase          Display greeting in uppercase
  -h, --help              Show this help message

Examples:
  npm run hello
  npm run hello -- --name "Developer"
  npm run hello -- --name "João" --language pt
  npm run hello -- --name "Alice" --language fr --uppercase

Languages:
  en - English (Hello)
  es - Spanish (Hola)
  fr - French (Bonjour)
  pt - Portuguese (Olá)
    `);
  }

  run(): void {
    this.displayInfo();

    const options = this.parseArguments();
    const greeting = this.greet(options);

    console.log(`✨ ${greeting}`);
    console.log("\n🎮 Ready to play Space Snake with AI!\n");
  }
}

// Main execution
if (require.main === module) {
  const cli = new HelloWorldCLI();
  cli.run();
}

export default HelloWorldCLI;
