/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import './editor.scss';
import { PlainText } from '@wordpress/editor';

export default function ParagraphEdit( { attributes, setAttributes, className } ) {
	return (
		<div className={ className }>
			<PlainText
				value={ attributes.content }
				onChange={ ( content ) => setAttributes( { content } ) }
				placeholder={ __( 'Write code…' ) }
				aria-label={ __( 'Code' ) }
			/>
		</div>
	);
}

/** 
compose(
		withColors( ( getColor, setColor, { attributes, setAttributes } ) => {
			return {
				backgroundColor: getColor( attributes.backgroundColor, attributes.customBackgroundColor, 'background-color' ),
				setBackgroundColor: setColor( 'backgroundColor', 'customBackgroundColor', setAttributes ),
				textColor: getColor( attributes.textColor, attributes.customTextColor, 'color' ),
				setTextColor: setColor( 'textColor', 'customTextColor', setAttributes ),
			};
		} ),
		FallbackStyles,
	)( ParagraphBlock )
*/
