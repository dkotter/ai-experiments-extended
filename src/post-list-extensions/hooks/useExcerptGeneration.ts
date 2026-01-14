/**
 * Hook for excerpt generation from post list.
 */

/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { useState } from '@wordpress/element';

declare const aiExperimentsExtendedData: {
	excerptGeneration: {
		enabled: boolean;
		path: string;
	};
};

/**
 * Generates an excerpt for the given post ID.
 *
 * @param postId The ID of the post to generate an excerpt for.
 * @return A promise that resolves to the generated excerpt.
 */
async function generateExcerpt( postId: number ): Promise< string > {
	const path = aiExperimentsExtendedData.excerptGeneration.path;

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
			if ( response && typeof response === 'string' ) {
				return response;
			}
			return '';
		} )
		.catch( ( error: any ) => {
			throw new Error( error.message || 'Failed to generate excerpt' );
		} );
}

/**
 * Hook for excerpt generation functionality.
 *
 * @return Object with generation state and handler.
 */
export function useExcerptGeneration(): {
	isGenerating: boolean;
	error: string | null;
	generate: ( postId: number ) => Promise< string >;
} {
	const [ isGenerating, setIsGenerating ] = useState< boolean >( false );
	const [ error, setError ] = useState< string | null >( null );

	const generate = async ( postId: number ): Promise< string > => {
		setIsGenerating( true );
		setError( null );

		try {
			const excerpt = await generateExcerpt( postId );
			return excerpt;
		} catch ( err: any ) {
			const errorMessage = err.message || 'Failed to generate excerpt';
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
