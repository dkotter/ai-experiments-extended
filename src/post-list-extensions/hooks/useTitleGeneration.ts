/**
 * Hook for title generation from post list.
 */

/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { useState } from '@wordpress/element';

declare const aiExperimentsExtendedData: {
	titleGeneration: {
		enabled: boolean;
		path: string;
	};
};

/**
 * Generates titles for the given post ID.
 *
 * @param postId The ID of the post to generate titles for.
 * @return A promise that resolves to the generated titles array.
 */
async function generateTitles( postId: number ): Promise< string[] > {
	const path = aiExperimentsExtendedData.titleGeneration.path;

	return apiFetch( {
		path,
		method: 'POST',
		data: {
			input: {
				context: postId.toString(),
			},
		},
	} )
		.then( ( response ) => {
			if (
				response &&
				typeof response === 'object' &&
				'titles' in response
			) {
				return response.titles as string[];
			}
			return [];
		} )
		.catch( ( error: any ) => {
			throw new Error( error.message || 'Failed to generate titles' );
		} );
}

/**
 * Hook for title generation functionality.
 *
 * @return Object with generation state and handler.
 */
export function useTitleGeneration(): {
	isGenerating: boolean;
	error: string | null;
	generate: ( postId: number ) => Promise< string[] >;
} {
	const [ isGenerating, setIsGenerating ] = useState< boolean >( false );
	const [ error, setError ] = useState< string | null >( null );

	const generate = async ( postId: number ): Promise< string[] > => {
		setIsGenerating( true );
		setError( null );

		try {
			const titles = await generateTitles( postId );
			return titles;
		} catch ( err: any ) {
			const errorMessage = err.message || 'Failed to generate titles';
			setError( errorMessage );
			throw err;
		} finally {
			setIsGenerating( false );
		}
	};

	return {
		isGenerating,
		error,
		generate,
	};
}
