/**
 * WordPress dependencies
 */
import {
	registerBlockType,
} from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import * as paragraph from './paragraph';
import * as code from './code';
import * as more from './more';

export const registerCoreBlocks = () => {
	[
		paragraph,
		code,
		more,
	].forEach( ( { name, settings } ) => {
		registerBlockType( name, settings );
	} );
};
