import React, { useEffect, useState } from 'react';
import BraftEditor from 'braft-editor';
import type { EditorState } from 'braft-editor';
import 'braft-editor/dist/index.css';
import { uploadFile } from '@/services/miniprogram/file';
import { nanoid } from '@ant-design/pro-components';

const RichEditor = (props: { detail: string; onChange: (val: string) => void }) => {
  const [editorState, setEditorState] = useState<EditorState>();
  useEffect(() => {
    setEditorState(BraftEditor.createEditorState(props.detail));
  }, []);
  useEffect(() => {
    props.onChange(editorState?.toHTML());
  }, [editorState]);

  // const submitContent = async () => {
  //   const htmlContent = editorState?.toHTML();
  //   console.log(htmlContent);
  // };
  // 上传图片到服务器
  const myUploadFn = async (params: {
    file: File;
    progress: (progress: number) => void;
    libraryId: string;
    success: (res: {
      url: string;
      meta: {
        id: string;
        title: string;
        alt: string;
        loop: boolean;
        autoPlay: boolean;
        controls: boolean;
        poster: string;
      };
    }) => void;
    error: (err: { msg: string }) => void;
  }) => {
    if (params.file) {
      uploadFile({ area: '积分商品' }, {}, params.file, params.progress).then((result) => {
        if (result.code === 200 && result.data) {
          params.success({
            url: result.data,
            meta: {
              id: nanoid(),
              title: params.file.name,
              alt: params.file.name,
              loop: true, // 指定音视频是否循环播放
              autoPlay: true, // 指定音视频是否自动播放
              controls: true, // 指定音视频是否显示控制栏
              poster: result.data, // 指定视频播放器的封面
            },
          });
        }
      });
    }
  };
  return (
    <BraftEditor
      excludeControls={['code', 'blockquote', 'emoji', 'link']}
      value={editorState}
      media={{ uploadFn: myUploadFn }}
      onChange={setEditorState}
      // onSave={submitContent}
    />
  );
};

export default RichEditor;
