<?php
/**
 * Plugin Name:       AI Experiments Extended
 * Plugin URI:        https://github.com/dkotter/ai-experiments-extended
 * Description:       Extended AI experiments for WordPress.
 * Version:           0.1.0
 * Requires at least: 6.9
 * Requires PHP:      7.4
 * Author:            Darin Kotter
 * Author URI:        https://darinkotter.com/
 * License:           GPL-2.0-or-later
 * License URI:       https://spdx.org/licenses/GPL-2.0-or-later.html
 * Text Domain:       ai-experiments-extended
 *
 * @package ai-experiments-extended
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Shortcut constant to the path of this file.
 */
define( 'AI_EXPERIMENTS_EXTENDED_DIR', plugin_dir_path( __FILE__ ) );

require_once AI_EXPERIMENTS_EXTENDED_DIR . 'includes/bootstrap.php';
