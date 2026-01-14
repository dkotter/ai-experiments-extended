/**
 * Excerpt Generation Modal component for post list.
 */

/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { Button, Modal, Spinner, TextareaControl } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useExcerptGeneration } from '../hooks/useExcerptGeneration';

declare const aiExperimentsExtendedData: {
	excerptGeneration: {
		enabled: boolean;
		path: string;
	};
};

interface ModalEventDetail {
	postId: number;
	restBase: string;
}

/**
 * ExcerptGenerationModal component.
 *
 * @return {JSX.Element | null} The modal component.
 */
export default function ExcerptGenerationModal(): JSX.Element | null {
	const [ isOpen, setIsOpen ] = useState< boolean >( false );
	const [ postId, setPostId ] = useState< number | null >( null );
	const [ restBase, setRestBase ] = useState< string >( 'posts' );
	const [ generatedExcerpt, setGeneratedExcerpt ] = useState< string >( '' );
	const [ isUpdating, setIsUpdating ] = useState< boolean >( false );
	const [ updateError, setUpdateError ] = useState< string | null >( null );

	const { isGenerating, error, generate } = useExcerptGeneration();

	// Listen for open modal events.
	useEffect( () => {
		const handleOpen = ( event: CustomEvent< ModalEventDetail > ) => {
			const { postId: newPostId, restBase: newRestBase } = event.detail;
			setPostId( newPostId );
			setRestBase( newRestBase );
			setGeneratedExcerpt( '' );
			setUpdateError( null );
			setIsOpen( true );

			// Auto-generate excerpt when modal opens.
			generate( newPostId )
				.then( ( excerpt ) => {
					setGeneratedExcerpt( excerpt );
				} )
				.catch( () => {
					// Error is handled by the hook.
				} );
		};

		window.addEventListener(
			'aiExperimentsExtended:openExcerptModal',
			handleOpen as EventListener
		);

		return () => {
			window.removeEventListener(
				'aiExperimentsExtended:openExcerptModal',
				handleOpen as EventListener
			);
		};
	}, [ generate ] );

	const closeModal = () => {
		setIsOpen( false );
		setPostId( null );
		setGeneratedExcerpt( '' );
		setUpdateError( null );
	};

	const handleApply = async () => {
		if ( ! postId || ! generatedExcerpt.trim() ) {
			return;
		}

		setIsUpdating( true );
		setUpdateError( null );

		try {
			// Update post via REST API.
			await apiFetch( {
				path: `wp/v2/${ restBase }/${ postId }`,
				method: 'PATCH',
				data: {
					excerpt: generatedExcerpt,
				},
			} );

			// Close the modal after successful update.
			closeModal();
		} catch ( err: any ) {
			setUpdateError(
				err.message ||
					__( 'Failed to update excerpt', 'ai-experiments-extended' )
			);
		} finally {
			setIsUpdating( false );
		}
	};

	if ( ! aiExperimentsExtendedData.excerptGeneration.enabled ) {
		return null;
	}

	return (
		<>
			{ isOpen && (
				<Modal
					onRequestClose={ closeModal }
					isFullScreen={ false }
					size="medium"
					className="ai-excerpt-generation-modal"
				>
					{ isGenerating && (
						<div style={ { textAlign: 'center', padding: '20px' } }>
							<Spinner />
							<p>
								{ __(
									'Generating excerpt…',
									'ai-experiments-extended'
								) }
							</p>
						</div>
					) }

					{ ! isGenerating && error && (
						<div className="notice notice-error">
							<p>{ error }</p>
						</div>
					) }

					{ ! isGenerating && ! error && generatedExcerpt && (
						<>
							<TextareaControl
								label={ __(
									'Generated Excerpt',
									'ai-experiments-extended'
								) }
								value={ generatedExcerpt }
								onChange={ setGeneratedExcerpt }
								rows={ 5 }
								__nextHasNoMarginBottom
							/>

							{ updateError && (
								<div
									className="notice notice-error"
									style={ { marginTop: '10px' } }
								>
									<p>{ updateError }</p>
								</div>
							) }

							<div
								style={ {
									display: 'flex',
									justifyContent: 'flex-end',
									gap: '10px',
									marginTop: '20px',
								} }
							>
								<Button
									variant="tertiary"
									onClick={ closeModal }
								>
									{ __(
										'Cancel',
										'ai-experiments-extended'
									) }
								</Button>
								<Button
									variant="primary"
									onClick={ handleApply }
									disabled={ isUpdating }
									isBusy={ isUpdating }
								>
									{ __( 'Save', 'ai-experiments-extended' ) }
								</Button>
							</div>
						</>
					) }
				</Modal>
			) }
		</>
	);
}
