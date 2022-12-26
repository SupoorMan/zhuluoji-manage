import React, { useEffect, useState } from 'react';
import BraftEditor from 'braft-editor';
import type { EditorState } from 'braft-editor';
import 'braft-editor/dist/index.css';

const RichEditor = (props: { detail: string; onChange: (val: string) => void }) => {
  const [editorState, setEditorState] = useState<EditorState>();
  useEffect(() => {
    setEditorState(BraftEditor.createEditorState(props.detail));
  }, []);
  useEffect(() => {
    props.onChange(editorState?.toHTML());
  }, [editorState]);

  const submitContent = async () => {
    const htmlContent = editorState?.toHTML();
    console.log(htmlContent);
  };

  return (
    <BraftEditor
      excludeControls={['code', 'blockquote', 'emoji', 'link']}
      value={editorState}
      onChange={setEditorState}
      onSave={submitContent}
    />
  );
};

export default RichEditor;
