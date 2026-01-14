/**
 * Post List Extensions entry point.
 *
 * Handles row action clicks and opens modals for excerpt generation.
 */

/**
 * WordPress dependencies
 */
import { createRoot } from '@wordpress/element';

/**
 * Internal dependencies
 */
import ExcerptGenerationModal from './components/ExcerptGenerationModal';

/**
 * Initialize post list extensions.
 */
function initPostListExtensions(): void {
	// Create container for modals.
	const modalContainer = document.createElement( 'div' );
	modalContainer.id = 'ai-experiments-extended-modals';
	document.body.appendChild( modalContainer );

	// Render modals.
	const root = createRoot( modalContainer );
	root.render( <ExcerptGenerationModal /> );

	// Handle excerpt generation clicks.
	document.addEventListener( 'click', ( event ) => {
		const target = event.target as HTMLElement;
		if ( ! target.classList.contains( 'ai-generate-excerpt' ) ) {
			return;
		}

		event.preventDefault();

		const postId = parseInt(
			target.getAttribute( 'data-post-id' ) || '0',
			10
		);
		const restBase = target.getAttribute( 'data-rest-base' ) || 'posts';

		if ( ! postId ) {
			return;
		}

		// Dispatch custom event to open excerpt modal.
		window.dispatchEvent(
			new CustomEvent( 'aiExperimentsExtended:openExcerptModal', {
				detail: { postId, restBase },
			} )
		);
	} );
}

// Initialize when DOM is ready.
if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', initPostListExtensions );
} else {
	initPostListExtensions();
}
