<?php
/**
 * Post List Extensions class.
 *
 * Adds row actions for excerpt generation to the post list page.
 *
 * @package AI_Experiments_Extended
 */

declare( strict_types=1 );

namespace AI_Experiments_Extended;

use WordPress\AI\Experiment_Registry;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Post List Extensions class.
 *
 * @since 0.1.0
 */
class Post_List_Extensions {

	/**
	 * Experiment registry instance.
	 *
	 * @since 0.1.0
	 * @var \WordPress\AI\Experiment_Registry
	 */
	private Experiment_Registry $registry;

	/**
	 * Constructor.
	 *
	 * @since 0.1.0
	 *
	 * @param \WordPress\AI\Experiment_Registry $registry Experiment registry instance.
	 */
	public function __construct( Experiment_Registry $registry ) {
		$this->registry = $registry;
	}

	/**
	 * Initialize the extensions.
	 *
	 * @since 0.1.0
	 */
	public function init(): void {
		// Register row actions.
		add_filter( 'post_row_actions', array( $this, 'add_row_actions' ), 10, 2 );
		add_filter( 'page_row_actions', array( $this, 'add_row_actions' ), 10, 2 );

		// Enqueue scripts on post list page.
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
	}

	/**
	 * Add row actions for excerpt generation.
	 *
	 * @since 0.1.0
	 *
	 * @param array<string, string> $actions Existing row actions.
	 * @param \WP_Post              $post    Post object.
	 * @return array<string, string> Modified row actions.
	 */
	public function add_row_actions( array $actions, \WP_Post $post ): array {
		// Only show on post list page.
		$screen = get_current_screen();
		if ( ! $screen || 'edit' !== $screen->base ) {
			return $actions;
		}

		// Check if user can edit this post.
		if ( ! current_user_can( 'edit_post', $post->ID ) ) {
			return $actions;
		}

		// Check if post type supports the REST API.
		$post_type_obj = get_post_type_object( $post->post_type );
		if ( ! $post_type_obj || empty( $post_type_obj->show_in_rest ) ) {
			return $actions;
		}

		// Get the REST base for the post type.
		// WordPress uses rest_base if set, otherwise defaults to post type name.
		// For built-in types, rest_base is explicitly set (e.g., 'post' -> 'posts').
		$rest_base = ! empty( $post_type_obj->rest_base )
			? $post_type_obj->rest_base
			: $post->post_type;

		$experiments = array(
			'excerpt-generation' => 'excerpt',
			'title-generation'   => 'title',
		);

		// Add action links for each active experiment.
		foreach ( $experiments as $experiment => $support ) {
			$experiment_obj = $this->registry->get_experiment( $experiment );

			if (
				! $experiment_obj ||
				! $experiment_obj->is_enabled() ||
				! post_type_supports( $post->post_type, $support )
			) {
				continue;
			}

			$actions[ $experiment ] = sprintf(
				'<a href="#" class="ai-generate-%s" data-post-id="%d" data-rest-base="%s">%s</a>',
				esc_attr( $experiment ),
				absint( $post->ID ),
				esc_attr( (string) $rest_base ),
				sprintf(
					/* translators: %s is the feature the post type supports. */
					esc_html__( 'Generate %s', 'ai-experiments-extended' ),
					$support
				)
			);
		}

		return $actions;
	}

	/**
	 * Enqueue scripts on the post list page.
	 *
	 * @since 0.1.0
	 *
	 * @param string $hook_suffix Current admin page hook suffix.
	 */
	public function enqueue_scripts( string $hook_suffix ): void {
		// Only enqueue on post list pages.
		if ( 'edit.php' !== $hook_suffix ) {
			return;
		}

		// Check if excerpt or title generation experiments are enabled.
		$excerpt_experiment  = $this->registry->get_experiment( 'excerpt-generation' );
		$title_experiment    = $this->registry->get_experiment( 'title-generation' );
		$has_excerpt_support = $excerpt_experiment && $excerpt_experiment->is_enabled();
		$has_title_support   = $title_experiment && $title_experiment->is_enabled();

		if ( ! $has_excerpt_support && ! $has_title_support ) {
			return;
		}

		// Enqueue the script.
		$script_path       = AI_EXPERIMENTS_EXTENDED_DIR . 'build/post-list-extensions.js';
		$script_url        = plugins_url( 'build/post-list-extensions.js', AI_EXPERIMENTS_EXTENDED_DIR . 'ai-experiments-extended.php' );
		$script_asset_path = AI_EXPERIMENTS_EXTENDED_DIR . 'build/post-list-extensions.asset.php';

		if ( ! file_exists( $script_path ) ) {
			return;
		}

		$asset_data = file_exists( $script_asset_path )
			? require $script_asset_path // phpcs:ignore WordPressVIPMinimum.Files.IncludingFile.UsingVariable
			: array(
				'dependencies' => array(),
				'version'      => filemtime( $script_path ),
			);

		wp_enqueue_script(
			'ai-experiments-extended-post-list',
			$script_url,
			$asset_data['dependencies'],
			$asset_data['version'],
			array( 'strategy' => 'defer' )
		);

		// Localize script with ability paths and enabled status.
		wp_localize_script(
			'ai-experiments-extended-post-list',
			'aiExperimentsExtendedData',
			array(
				'excerptGeneration' => array(
					'enabled' => $has_excerpt_support,
					'path'    => 'wp-abilities/v1/abilities/ai/excerpt-generation/run',
				),
				'titleGeneration'   => array(
					'enabled' => $has_title_support,
					'path'    => 'wp-abilities/v1/abilities/ai/title-generation/run',
				),
			)
		);
	}
}
