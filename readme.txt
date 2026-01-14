=== AI Experiments Extended ===
Contributors: dkotter
Tags:         ai, artificial intelligence, experiments, abilities
Tested up to: 6.9
Stable tag:   0.1.0
License:      GPL-2.0-or-later
License URI:  https://spdx.org/licenses/GPL-2.0-or-later.html

Extended AI experiments for WordPress that demonstrate how easy it is to extend the experiments registered in the base AI Experiments plugin.

== Description ==

AI Experiments Extended is a demonstration plugin that extends the [AI Experiments](https://github.com/WordPress/ai) plugin by adding new UI entry points for existing experiments. This plugin shows how third-party developers can leverage the base plugin's experiment registry and abilities to create custom integrations.

**What This Plugin Does:**

This plugin demonstrates how to extend the AI Experiments plugin without duplicating any core functionality. It adds a "Generate excerpt" row action link to the WordPress post list page, allowing users to generate excerpts directly from the post list without opening the editor.

**Key Features:**

* **Post List Excerpt Generation** - Adds a "Generate excerpt" row action to the post list page (`edit.php`)
* **Modal Interface** - Opens a modal dialog when clicked, automatically generating an excerpt
* **Review and Edit** - Allows users to review and edit the generated excerpt before saving
* **Direct Integration** - Uses the base plugin's `ai/excerpt-generation` ability via REST API
* **No Code Duplication** - Leverages existing abilities without reimplementing functionality

**How It Works:**

1. Hooks into the base plugin's experiment registry using the `ai_experiments_register_experiments` action
2. Checks if the `excerpt-generation` experiment is enabled before showing UI
3. Adds row action links to post list pages using WordPress filters
4. Calls the base plugin's ability via REST API when the action is clicked
5. Updates the post excerpt using WordPress REST API

This plugin serves as a reference implementation for developers who want to extend the AI Experiments plugin with custom UI integrations.

== Installation ==

1. Install and activate the base [AI Experiments](https://github.com/WordPress/ai) plugin first
2. Upload the plugin files to the `/wp-content/plugins/ai-experiments-extended` directory, or install the plugin through the WordPress plugins screen directly
3. Install dependencies:
   * Run `composer install` to install PHP dependencies
   * Run `npm install` to install JavaScript dependencies
4. Build the JavaScript assets:
   * Run `npm run build` to compile the React components
5. Activate the plugin through the 'Plugins' screen in WordPress
6. Ensure the base plugin's `excerpt-generation` experiment is enabled in `Settings -> AI Experiments`
7. Visit any post list page (`Posts -> All Posts` or `Pages -> All Pages`) and you should see a "Generate excerpt" link in the row actions

== Frequently Asked Questions ==

= Do I need the base AI Experiments plugin? =

Yes, this plugin requires the AI Experiments plugin to be installed and activated. It extends the base plugin's functionality rather than replacing it.

= What experiments does this extend? =

Currently, this plugin extends the `excerpt-generation` experiment by adding a post list row action. More extensions can be added following the same pattern.

= Do I need to configure AI credentials? =

Yes, you need to configure AI credentials in the base AI Experiments plugin settings (`Settings -> AI Credentials`). This plugin uses the same credentials through the base plugin's abilities.

= Can I extend this plugin further? =

Absolutely! This plugin is designed as a demonstration and reference implementation. You can add more extensions by:
* Creating new classes in the `includes/` directory
* Adding React components in `src/`
* Following the same pattern of hooking into `ai_experiments_register_experiments`

== Changelog ==

= 0.1.0 =
* Initial release
* Added post list excerpt generation row action
* Modal interface for generating and editing excerpts
* Integration with base AI Experiments plugin's excerpt generation ability

== Upgrade Notice ==

= 0.1.0 =
Initial release of the plugin.

== For Developers ==

This plugin demonstrates how to extend the AI Experiments plugin. Key integration points:

**WordPress Hooks:**
* `ai_experiments_register_experiments` - Access the experiment registry
* `post_row_actions` - Add row actions for posts
* `page_row_actions` - Add row actions for pages
* `admin_enqueue_scripts` - Enqueue JavaScript on post list pages

**REST API Endpoints:**
* `POST /wp-json/wp-abilities/v1/abilities/ai/excerpt-generation/run` - Generate excerpt (from base plugin)
* `PATCH /wp-json/wp/v2/{rest_base}/{id}` - Update post excerpt (WordPress core)

**File Structure:**
* `includes/bootstrap.php` - Plugin initialization
* `includes/Post_List_Extensions.php` - Main extension class
* `src/post-list-extensions/` - React components and hooks
* `build/` - Compiled JavaScript assets

**Development:**
* Run `composer lint` for PHP code quality checks
* Run `npm run lint:js` for JavaScript linting
* Run `composer phpstan` for static analysis
* Run `npm run build` to compile assets for production

== Screenshots ==

1. Post list page showing "Generate excerpt" row action
2. Modal dialog with generated excerpt ready for review and editing
