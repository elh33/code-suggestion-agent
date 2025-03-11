import React, { useEffect, useRef } from 'react';
import { MonacoEditor } from '@monaco-editor/react';
import { useSocket } from '../lib/socket';

const CodeEditor = () => {
    const editorRef = useRef(null);
    const socket = useSocket();

    useEffect(() => {
        if (socket) {
            socket.on('codeChange', (newCode) => {
                if (editorRef.current) {
                    editorRef.current.setValue(newCode);
                }
            });
        }

        return () => {
            if (socket) {
                socket.off('codeChange');
            }
        };
    }, [socket]);

    const handleEditorChange = (value) => {
        if (socket) {
            socket.emit('codeChange', value);
        }
    };

    return (
        <MonacoEditor
            height="90vh"
            language="javascript"
            theme="vs-dark"
            onChange={handleEditorChange}
            editorDidMount={(editor) => {
                editorRef.current = editor;
            }}
        />
    );
};

export default CodeEditor;