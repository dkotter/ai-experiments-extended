# AI Experiments Extended

> Extended AI experiments for WordPress that demonstrate how easy it is to extend the experiments registered in the base AI Experiments plugin.

## Overview

AI Experiments Extended is a demonstration plugin that extends the [AI Experiments](https://github.com/WordPress/ai) plugin by adding new UI entry points for existing experiments. This plugin shows how third-party developers can leverage the base plugin's experiment registry and abilities to create custom integrations.

## Features

### Post List Excerpt Generation

Adds a "Generate excerpt" row action link to the WordPress post list page (`edit.php`). When clicked, it:

- Opens a modal dialog
- Automatically generates an excerpt using the base plugin's `ai/excerpt-generation` ability
- Allows users to review and edit the generated excerpt
- Saves the excerpt directly to the post via the WordPress REST API

This demonstrates how to extend existing experiments with new UI entry points without duplicating any core functionality.

## Requirements

- WordPress 6.9 or higher
- PHP 7.4 or higher
- [AI Experiments](https://github.com/WordPress/ai) plugin (must be installed and activated)
- Valid AI credentials configured in the base plugin

## Installation

1. Install and activate the base [AI Experiments](https://github.com/WordPress/ai) plugin
2. Clone or download this plugin to your `wp-content/plugins/` directory
3. Install dependencies:

   ```bash
   composer install
   npm install
   ```

4. Build the JavaScript assets:

   ```bash
   npm run build
   ```

5. Activate the plugin through the WordPress admin

## Development

### Setup

1. Install dependencies:

   ```bash
   composer install
   npm install
   ```

2. Build for development (with watch mode):

   ```bash
   npm start
   ```

3. Build for production:

   ```bash
   npm run build
   ```

### Code Quality

- **PHP Linting**: `composer lint`
- **PHP Formatting**: `composer format`
- **PHP Static Analysis**: `composer phpstan`
- **JavaScript Linting**: `npm run lint:js`
- **TypeScript Type Checking**: `npm run typecheck`
