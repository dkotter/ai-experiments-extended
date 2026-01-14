/**
 * Title Generation Modal component for post list.
 */

/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import {
	Button,
	Flex,
	FlexItem,
	Modal,
	Spinner,
	TextareaControl,
} from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useTitleGeneration } from '../hooks/useTitleGeneration';

declare const aiExperimentsExtendedData: {
	titleGeneration: {
		enabled: boolean;
		path: string;
	};
};

interface ModalEventDetail {
	postId: number;
	restBase: string;
}

/**
 * Renders a single title option.
 *
 * @param {Object}   props          Component props.
 * @param {string}   props.title    The title value to display.
 * @param {number}   props.index    The index of this title in the array.
 * @param {Function} props.onChange Callback to update this title's value.
 * @param {Function} props.onSelect Callback when this title is selected.
 * @return {JSX.Element} The rendered title option.
 */
function TitleOption( {
	title,
	index,
	onChange,
	onSelect,
}: {
	title: string;
	index: number;
	onChange: ( value: string ) => void;
	onSelect: ( title: string, index: number ) => void;
} ): JSX.Element {
	return (
		<FlexItem className="ai-title">
			<TextareaControl
				rows={ 2 }
				label={ __( 'Generated title', 'ai-experiments-extended' ) }
				hideLabelFromVision
				value={ title }
				onChange={ onChange }
				__nextHasNoMarginBottom
			/>
			<Button
				variant="secondary"
				style={ { marginTop: '15px' } }
				onClick={ () => onSelect( title, index ) }
			>
				{ __( 'Select', 'ai-experiments-extended' ) }
			</Button>
		</FlexItem>
	);
}

/**
 * Renders the generated title data with editable textareas.
 *
 * @param {Object}   props               Component props.
 * @param {string[]} props.titles        The array of titles to render.
 * @param {Function} props.onTitleChange Callback to update the title array.
 * @param {Function} props.onSelect      Callback when a title is selected.
 * @return {JSX.Element | null} The rendered titles.
 */
function TitleOptionsList( {
	titles: titlesToRender,
	onTitleChange,
	onSelect,
}: {
	titles: string[];
	onTitleChange: ( newTitle: string[] ) => void;
	onSelect: ( title: string, index: number ) => void;
} ): JSX.Element | null {
	if ( ! titlesToRender || titlesToRender.length === 0 ) {
		return null;
	}

	return (
		<Flex gap="5" wrap direction="column">
			{ titlesToRender.map( ( title: string, i: number ) => (
				<TitleOption
					key={ `title-${ i }` }
					title={ title }
					index={ i }
					onChange={ ( value: string ) => {
						onTitleChange(
							titlesToRender.map( ( item, index ) =>
								index === i ? value : item
							)
						);
					} }
					onSelect={ onSelect }
				/>
			) ) }
		</Flex>
	);
}

/**
 * TitleGenerationModal component.
 *
 * @return {JSX.Element | null} The modal component.
 */
export default function TitleGenerationModal(): JSX.Element | null {
	const [ isOpen, setIsOpen ] = useState< boolean >( false );
	const [ postId, setPostId ] = useState< number | null >( null );
	const [ restBase, setRestBase ] = useState< string >( 'posts' );
	const [ generatedTitles, setGeneratedTitles ] = useState< string[] >( [] );
	const [ updateError, setUpdateError ] = useState< string | null >( null );

	const { isGenerating, error, generate } = useTitleGeneration();

	// Listen for open modal events.
	useEffect( () => {
		const handleOpen = ( event: CustomEvent< ModalEventDetail > ) => {
			const { postId: newPostId, restBase: newRestBase } = event.detail;
			setPostId( newPostId );
			setRestBase( newRestBase );
			setGeneratedTitles( [] );
			setUpdateError( null );
			setIsOpen( true );

			// Auto-generate titles when modal opens.
			generate( newPostId )
				.then( ( titles ) => {
					setGeneratedTitles( titles );
				} )
				.catch( () => {
					// Error is handled by the hook.
				} );
		};

		window.addEventListener(
			'aiExperimentsExtended:openTitleModal',
			handleOpen as EventListener
		);

		return () => {
			window.removeEventListener(
				'aiExperimentsExtended:openTitleModal',
				handleOpen as EventListener
			);
		};
	}, [ generate ] );

	const closeModal = () => {
		setIsOpen( false );
		setPostId( null );
		setGeneratedTitles( [] );
		setUpdateError( null );
	};

	const handleSelectTitle = async ( selectedTitle: string ) => {
		if ( ! postId || ! selectedTitle.trim() ) {
			return;
		}

		setUpdateError( null );

		try {
			// Update post via REST API.
			await apiFetch( {
				path: `wp/v2/${ restBase }/${ postId }`,
				method: 'PATCH',
				data: {
					title: selectedTitle,
				},
			} );

			// Update the title in the UI immediately.
			const postRow = document.querySelector( `#post-${ postId }` );
			if ( postRow ) {
				// Find the title link in the row (WordPress uses .row-title class).
				const titleLink = postRow.querySelector(
					'.row-title'
				) as HTMLAnchorElement | null;

				if ( titleLink ) {
					// Update the link text.
					titleLink.textContent = selectedTitle;
				}
			}

			// Close the modal after successful update.
			closeModal();
		} catch ( err: any ) {
			setUpdateError(
				err.message ||
					__( 'Failed to update title', 'ai-experiments-extended' )
			);
		}
	};

	if ( ! aiExperimentsExtendedData.titleGeneration.enabled ) {
		return null;
	}

	return (
		<>
			{ isOpen && (
				<Modal
					title={ __( 'Select a title', 'ai-experiments-extended' ) }
					onRequestClose={ closeModal }
					isFullScreen={ false }
					size="medium"
					className="ai-title-generation-modal"
				>
					{ isGenerating && (
						<div style={ { textAlign: 'center', padding: '20px' } }>
							<Spinner />
							<p>
								{ __(
									'Generating titles…',
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

					{ ! isGenerating &&
						! error &&
						generatedTitles.length > 0 &&
						! updateError && (
							<>
								<TitleOptionsList
									titles={ generatedTitles }
									onTitleChange={ setGeneratedTitles }
									onSelect={ handleSelectTitle }
								/>

								{ updateError && (
									<div
										className="notice notice-error"
										style={ { marginTop: '10px' } }
									>
										<p>{ updateError }</p>
									</div>
								) }
							</>
						) }
				</Modal>
			) }
		</>
	);
}
