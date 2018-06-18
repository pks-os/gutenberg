/**
 * External dependencies
 */
import classnames from 'classnames';
import { noop } from 'lodash';

/**
 * WordPress dependencies
 */
import { Component, createPortal } from '@wordpress/element';

/**
 * Internal dependencies
 */
import ModalFrame from './frame';
import ModalHeader from './header';
import * as ariaHelper from './aria-helper';
import './style.scss';

// Used to count the number of open modals.
let parentElement,
	openModalCount = 0;

class Modal extends Component {
	constructor() {
		super( ...arguments );

		this.node = document.createElement( 'div' );
	}

	/**
	 * Opens the modal if the initial isOpen prop is true.
	 */
	componentDidMount() {
		const { isOpen } = this.props;
		if ( isOpen ) {
			this.openModal();
		}
	}

	/**
	 * Opens or closes the modal based on whether the isOpen prop changed.
	 *
	 * @param {Object} prevProps The previous props.
	 */
	componentDidUpdate( prevProps ) {
		const openStateChanged = this.props.isOpen !== prevProps.isOpen;
		if ( openStateChanged && ! prevProps.isOpen ) {
			this.openModal();
		} else if ( openStateChanged && prevProps.isOpen ) {
			this.closeModal();
		}
	}

	/**
	 * Closes the modal if it is open before unmount.
	 */
	componentWillUnmount() {
		const { isOpen } = this.props;
		if ( isOpen ) {
			this.closeModal();
		}
	}

	/**
	 * Appends the modal's node to the DOM, so the portal can render the
	 * modal in it. Also calls the openFirstModal when this is the first modal to be
	 * opened.
	 */
	openModal() {
		openModalCount++;

		if ( openModalCount === 1 ) {
			this.openFirstModal();
		}
		parentElement.appendChild( this.node );
	}

	/**
	 * Prepares the DOM for this modal and any additional modal to be mounted.
	 *
	 * It appends an additional div to the body for the modals to be rendered in,
	 * it hides any other elements from screen-readers and adds an additional class
	 * to the body to prevent scrolling while the modal is open.
	 */
	openFirstModal() {
		parentElement = document.createElement( 'div' );
		document.body.appendChild( parentElement );
		ariaHelper.hideApp( parentElement );
		document.body.classList.add( this.props.bodyOpenClassName );
	}

	/**
	 * Removes the modal's node from the DOM. Also calls closeLastModal when this is
	 * the last modal to be closed.
	 */
	closeModal() {
		openModalCount--;

		parentElement.removeChild( this.node );
		if ( openModalCount === 0 ) {
			this.closeLastModal();
		}
	}

	/**
	 * Cleans up the DOM after the last modal is closed and makes the app available
	 * for screen-readers again.
	 */
	closeLastModal() {
		document.body.classList.remove( this.props.bodyOpenClassName );
		ariaHelper.showApp();
		document.body.removeChild( parentElement );
		parentElement = null;
	}

	/**
	 * Renders the modal.
	 *
	 * @return {WPElement} The modal element.
	 */
	render() {
		const {
			isOpen,
			overlayClassName,
			className,
			onRequestClose,
			style: {
				content,
				overlay,
			},
			title,
			icon,
			closeButtonLabel,
			children,
			...otherProps
		} = this.props;

		if ( ! isOpen ) {
			return null;
		}

		return createPortal(
			<div
				className={ classnames(
					'components-modal__screen-overlay',
					overlayClassName
				) }
				style={ overlay }>
				<ModalFrame
					style={ content }
					className={ classnames(
						'components-modal__frame',
						className
					) }
					onRequestClose={ onRequestClose }
					{ ...otherProps } >
					<ModalHeader
						closeLabel={ closeButtonLabel }
						onClose={ onRequestClose }
						title={ title }
						icon={ icon } />
					<div
						className={ 'components-modal__content' }>
						{ children }
					</div>
				</ModalFrame>
			</div>,
			this.node
		);
	}
}

Modal.defaultProps = {
	bodyOpenClassName: 'modal-open',
	role: 'dialog',
	title: null,
	onRequestClose: noop,
	focusOnMount: true,
	shouldCloseOnEsc: true,
	shouldCloseOnClickOutside: true,
	style: {
		content: null,
		overlay: null,
	},
	/* accessibility */
	aria: {
		labelledby: 'modal-heading',
		describedby: null,
	},
};

export default Modal;