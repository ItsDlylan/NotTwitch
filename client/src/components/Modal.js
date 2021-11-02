import React from 'react';
import ReactDOM from 'react-dom';

const Modal = (props) => {
	// Create a Portal with the Modal and connect it with the Element with the Id of #modal
	return ReactDOM.createPortal(
		<div
			className={`ui dimmer modals ${props.classes}`}
			// When calling the prop onDismiss needs to be passed.
			onClick={props.onDismiss}
		>
			<div
				// with the event from the first OnClick, stop the Propagation so the event doesnt bubble down the children.
				onClick={(e) => e.stopPropagation()}
				className='ui standard modal visible active'
			>
				<div className='header'>{props.title}</div>
				<div className='content'>{props.content}</div>
			</div>
		</div>,
		document.querySelector('#modal'),
	);
};

export default Modal;
