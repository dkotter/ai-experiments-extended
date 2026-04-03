=== AI Experiments Extended ===
Contributors: dkotter
Tags:         ai, artificial intelligence, experiments, abilities
Tested up to: 6.9
Stable tag:   0.1.0
License:      GPL-2.0-or-later
License URI:  https://spdx.org/licenses/GPL-2.0-or-later.html

Extended AI experiments for WordPress that demonstrate how easy it is to extend the experiments registered in the base AI Experiments plugin.

== Description ==

AI Experiments Extended is a demonstration plugin that extends the [AI Experiments](https://github.com/WordPress/ai) plugin by adding new UI entry points for existing experiments. This plugin shows how third-party developers can leverage the base plugin's feature registry and abilities to create custom integrations.

**What This Plugin Does:**

This plugin demonstrates how to extend the AI Experiments plugin without duplicating any core functionality. It adds row action links to the WordPress post list page, allowing users to generate excerpts and titles directly from the post list without opening the editor.

**Key Features:**

* **Post List Excerpt Generation** - Adds a "Generate excerpt" row action to the post list page (`edit.php`)
* **Post List Title Generation** - Adds a "Generate title" row action to the post list page (`edit.php`)
* **Review and Edit** - Allows users to review and edit generated content before saving
* **Direct Integration** - Uses the base plugin's `ai/excerpt-generation` and `ai/title-generation` abilities via REST API
* **No Code Duplication** - Leverages existing abilities without reimplementing functionality

**How It Works:**

1. Hooks into the base plugin's feature registration using the `wpai_register_features` action (see AI plugin 0.6+ developer docs)
2. Checks if features (`excerpt-generation` and `title-generation`) are enabled before showing UI
3. Adds row action links to post list pages using WordPress filters
4. Calls the base plugin's abilities via REST API when actions are clicked
5. Updates post content (excerpt or title) using WordPress REST API
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
6. Ensure the base plugin's `excerpt-generation` and/or `title-generation` experiments are enabled in `Settings -> AI Experiments`
7. Visit any post list page (`Posts -> All Posts` or `Pages -> All Pages`) and you should see "Generate excerpt" and/or "Generate title" links in the row actions

== Frequently Asked Questions ==

= Do I need the base AI Experiments plugin? =

Yes, this plugin requires the AI Experiments plugin to be installed and activated. It extends the base plugin's functionality rather than replacing it.

= What experiments does this extend? =

Currently, this plugin extends the `excerpt-generation` and `title-generation` experiments by adding post list row actions. More extensions can be added following the same pattern.

= Do I need to configure AI credentials? =

Yes, you need to configure AI credentials in the base AI Experiments plugin settings (`Settings -> AI Credentials`). This plugin uses the same credentials through the base plugin's abilities.

== Changelog ==

= 0.1.0 =

* Initial release
* Added post list excerpt generation row action
* Added post list title generation row action
* Modal interface for generating and editing excerpts
* Modal interface for generating and selecting titles with multiple candidates
* Immediate UI updates for title changes
* Integration with base AI Experiments plugin's excerpt and title generation abilities

== Upgrade Notice ==

= 0.1.0 =

Initial release of the plugin.

== Screenshots ==

1. Post list page showing "Generate excerpt" and "Generate title" row actions
2. Modal dialog with generated excerpt ready for review and editing
3. Modal dialog with multiple title candidates ready for selection
