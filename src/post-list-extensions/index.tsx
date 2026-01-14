/**
 * Post List Extensions entry point.
 *
 * Handles row action clicks and opens modals for excerpt and title generation.
 */

/**
 * WordPress dependencies
 */
import { createRoot } from '@wordpress/element';

/**
 * Internal dependencies
 */
import ExcerptGenerationModal from './components/ExcerptGenerationModal';
import TitleGenerationModal from './components/TitleGenerationModal';

/**
 * Mapping of CSS class names to modal event names.
 */
const MODAL_EVENTS: Record< string, string > = {
	'ai-generate-excerpt-generation': 'aiExperimentsExtended:openExcerptModal',
	'ai-generate-title-generation': 'aiExperimentsExtended:openTitleModal',
};

/**
 * Handles row action clicks and dispatches modal events.
 *
 * @param event The click event.
 */
function handleRowActionClick( event: Event ): void {
	const target = event.target as HTMLElement;

	// Find matching class name.
	const matchingClass = Object.keys( MODAL_EVENTS ).find( ( className ) =>
		target.classList.contains( className )
	);

	if ( ! matchingClass ) {
		return;
	}

	event.preventDefault();

	const postId = parseInt( target.getAttribute( 'data-post-id' ) || '0', 10 );
	const restBase = target.getAttribute( 'data-rest-base' ) || 'posts';

	if ( ! postId ) {
		return;
	}

	// Dispatch custom event to open the appropriate modal.
	const eventName = MODAL_EVENTS[ matchingClass ]!;

	window.dispatchEvent(
		new CustomEvent( eventName, {
			detail: { postId, restBase },
		} )
	);
}

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
	root.render(
		<>
			<ExcerptGenerationModal />
			<TitleGenerationModal />
		</>
	);

	// Handle row action clicks.
	document.addEventListener( 'click', handleRowActionClick );
}

// Initialize when DOM is ready.
if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', initPostListExtensions );
} else {
	initPostListExtensions();
}
