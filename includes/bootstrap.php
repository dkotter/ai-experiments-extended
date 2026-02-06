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
	// Check if the base AI Experiments plugin is active.
	if ( ! class_exists( 'WordPress\AI\Experiment_Registry' ) ) {
		return;
	}

	// Hook into the experiment registration to access the registry.
	add_action(
		'ai_experiments_register_experiments',
		static function ( $registry ) {
			$extensions = new Post_List_Extensions( $registry );
			$extensions->init();
		},
		20 // Run after base experiments are registered.
	);
}

add_action( 'plugins_loaded', __NAMESPACE__ . '\\init', 20 );
