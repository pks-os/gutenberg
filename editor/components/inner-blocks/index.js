/**
 * External dependencies
 */
import classnames from 'classnames';
import { pick } from 'lodash';

/**
 * WordPress dependencies
 */
import { withContext } from '@wordpress/components';
import isShallowEqual from '@wordpress/is-shallow-equal';
import { withViewportMatch } from '@wordpress/viewport';
import { Component, compose } from '@wordpress/element';
import { withSelect, withDispatch } from '@wordpress/data';
import { synchronizeBlocksWithTemplate } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import './style.scss';
import BlockList from '../block-list';
import { withBlockEditContext } from '../block-edit/context';

class InnerBlocks extends Component {
	componentDidUpdate() {
		this.updateNestedSettings();
	}

	componentDidMount() {
		this.updateNestedSettings();
		this.insertTemplateBlocks( this.props.template );
	}

	insertTemplateBlocks( template ) {
		const { block, insertBlocks } = this.props;
		if ( template && ! block.innerBlocks.length ) {
			// synchronizeBlocksWithTemplate( [], template ) parses the template structure,
			// and returns/creates the necessary blocks to represent it.
			insertBlocks( synchronizeBlocksWithTemplate( [], template ) );
		}
	}

	updateNestedSettings() {
		const { allowedBlocks, lock, parentLock, blockListSettings, updateNestedSettings } = this.props;
		const newSettings = {
			allowedBlocks,
			lock: lock === undefined ? parentLock : lock,
		};
		if ( ! isShallowEqual( blockListSettings, newSettings ) ) {
			updateNestedSettings( newSettings );
		}
	}

	render() {
		const {
			uid,
			layouts,
			allowedBlocks,
			lock,
			template,
			isSmallScreen,
			isSelectedBlockInRoot,
		} = this.props;

		const classes = classnames( 'editor-inner-blocks', {
			'has-overlay': isSmallScreen && ! isSelectedBlockInRoot,
		} );

		return (
			<div className={ classes }>
				<BlockList
					rootUID={ uid }
					{ ...{ layouts, allowedBlocks, lock, template } }
				/>
			</div>
		);
	}
}

InnerBlocks = compose( [
	withBlockEditContext( ( context ) => pick( context, [ 'uid' ] ) ),
	withViewportMatch( { isSmallScreen: '< medium' } ),
	withSelect( ( select, ownProps ) => {
		const {
			isBlockSelected,
			hasSelectedInnerBlock,
			getBlock,
			getBlockListSettings,
		} = select( 'core/editor' );
		const { uid } = ownProps;

		return {
			isSelectedBlockInRoot: isBlockSelected( uid ) || hasSelectedInnerBlock( uid ),
			block: getBlock( uid ),
			blockListSettings: getBlockListSettings( uid ),
		};
	} ),
	withDispatch( ( dispatch, ownProps ) => {
		const { insertBlocks, updateBlockListSettings } = dispatch( 'core/editor' );
		const { uid } = ownProps;

		return {
			insertBlocks( blocks ) {
				dispatch( insertBlocks( blocks, undefined, uid ) );
			},
			updateNestedSettings( settings ) {
				dispatch( updateBlockListSettings( uid, settings ) );
			},
		};
	} ),
] )( InnerBlocks );

InnerBlocks.Content = ( { BlockContent } ) => {
	return <BlockContent />;
};

InnerBlocks.Content = withContext( 'BlockContent' )()( InnerBlocks.Content );

export default InnerBlocks;
