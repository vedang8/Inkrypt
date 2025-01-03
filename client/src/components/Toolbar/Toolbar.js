import React from 'react';
import './Toolbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAlignLeft, faAlignCenter, faAlignRight, faBold, faItalic, faUnderline, faTimes, faEdit } from '@fortawesome/free-solid-svg-icons';

const Toolbar = ({
    toggleBold,
    toggleItalic,
    toggleUnderline,
    increaseFontSize,
    decreaseFontSize,
    setTextAlignment,
    onCloseNote,
    onEdit,
    isEditing,
    isBold,
    isItalic,
    isUnderline,
    alignment
}) => {
    return (
        <div className="toolbar">
            <button onClick={onEdit} title="Edit" className={isEditing ? 'active' : ''}>
                <FontAwesomeIcon icon={faEdit} />
            </button>
            <button onClick={toggleBold} title="Bold" className={isBold ? 'active' : ''}>
                <FontAwesomeIcon icon={faBold} />
            </button>
            <button onClick={toggleItalic} title="Italic" className={isItalic ? 'active' : ''}>
                <FontAwesomeIcon icon={faItalic} />
            </button>
            <button onClick={toggleUnderline} title="Underline" className={isUnderline ? 'active' : ''}>
                <FontAwesomeIcon icon={faUnderline} />
            </button>
            <button onClick={increaseFontSize} title="Increase Font Size">A+</button>
            <button onClick={decreaseFontSize} title="Decrease Font Size">A-</button>
            <button onClick={() => setTextAlignment("left")} title="Align Left" className={alignment === 'left' ? 'active' : ''}>
                <FontAwesomeIcon icon={faAlignLeft} />
            </button>
            <button onClick={() => setTextAlignment("center")} title="Align Center" className={alignment === 'center' ? 'active' : ''}>
                <FontAwesomeIcon icon={faAlignCenter} />
            </button>
            <button onClick={() => setTextAlignment("right")} title="Align Right" className={alignment === 'right' ? 'active' : ''}>
                <FontAwesomeIcon icon={faAlignRight} />
            </button>
            <button onClick={onCloseNote} title="Close Note" className="close-button">
                <FontAwesomeIcon icon={faTimes} />
            </button>
        </div>
    );
};

export default Toolbar;