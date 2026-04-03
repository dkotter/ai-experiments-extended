<?php
/**
 * Bootstrap file for the AI Experiments Extended plugin.
 *
 * @package ai-experiments-extended
 */

declare( strict_types=1 );

namespace AI_Experiments_Extended;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Initialize the extension plugin.
 *
 * @since 0.1.0
 */
function init(): void {
	// Check if the base AI plugin is active.
	if ( ! class_exists( 'WordPress\AI\Features\Registry' ) ) {
		return;
	}

	// Hook after built-in features are registered.
	add_action(
		'wpai_register_features',
		static function ( $registry ) {
			$extensions = new Post_List_Extensions( $registry );
			$extensions->init();
		},
		20
	);
}

add_action( 'plugins_loaded', __NAMESPACE__ . '\\init', 20 );
