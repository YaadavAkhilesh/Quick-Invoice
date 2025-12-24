import React from 'react';
import Engine from "./Main/Engine";
import './editor.css';

const Editor = ({ templateId }) => {
    return (
        <Engine templateId={templateId} />
    );
};

export default Editor;