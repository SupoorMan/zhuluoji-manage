import React, { useEffect, useRef, useState } from 'react';
import {
  nanoid,
  ProFormColumnsType,
  ProFormInstance,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import { message, Image, UploadFile } from 'antd';
import { addBanner, updateBanner } from '@/services/miniprogram/banner';
import { deleteFile, uploadFile } from '@/services/miniprogram/file';
import { UploadRequestOption } from 'rc-upload/lib/interface';

interface Iprops<T> {
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  current?: T;
  columns: ProFormColumnsType<T>[];
  [key: string]: any;
}
/**
 * @param fields 轮播信息
 */
const handleSubmit = async (
  fields: API.Banner,
  backFn: (arg: any) => Promise<API.CommonResult>,
) => {
  const hide = message.loading('正在' + (fields?.id ? '添加' : '更新'));
  try {
    const { code } = await backFn({ ...fields });
    hide();
    if (code === 200) {
      message.success(fields?.id ? '更新成功' : '添加成功');
      return true;
    } else {
      throw Error('失败');
    }
  } catch (error) {
    hide();
    message.error((fields?.id ? '添加' : '更新') + '失败, 请稍后重试!');
    return false;
  }
};
/**删除文件
 * @filePath 文件地址
 */
const handleRemove = async (filePath: string) => {
  try {
    await deleteFile({ file: filePath });
    return true;
  } catch (error) {
    return false;
  }
};
/*
  编辑
*/
const CreateTeamModal = <T extends { [key: string]: any }>(props: Iprops<T>) => {
  const { title, current, onOpenChange, columns, onFinish, ...otherConfig } = props;
  const formRef = useRef<ProFormInstance>();
  const [visible, setVisible] = useState<boolean>(false);
  const [priviewSrc, setPriviewSrc] = useState<string>('');
  const [fileList, setFileList] = useState<UploadFile[]>();
  useEffect(() => {
    if (current?.url) {
      setFileList([
        {
          uid: nanoid(),
          name: current?.url.split('_')[1],
          status: 'done',
          url: current?.url,
        },
      ]);
    }
  }, [current]);
  const handleUploadFile = async (options: UploadRequestOption<any>) => {
    const file = options.file as File;
    if (file) {
      const result = await uploadFile({ area: '首页轮播' }, {}, file);
      if (result && result.data) {
        const file: UploadFile = {
          uid: nanoid(),
          name: nanoid(),
          status: 'done',
          url: result.data as string,
        };
        formRef.current?.setFieldValue('url', result.data);
        setFileList([file]);
      }
    }
  };
  return (
    <SchemaForm<T>
      formRef={formRef}
      title={title}
      modalProps={{
        onCancel: () => onOpenChange(false),
      }}
      colProps={{ span: 24 }}
      onOpenChange={(open: boolean) => {
        if (open) {
          if (current) {
            formRef.current?.setFieldsValue({
              ...current,
              type: `${current.type}`,
            });
          }
        } else {
          formRef.current?.resetFields();
          setFileList(undefined);
        }
      }}
      layoutType="ModalForm"
      onFinish={async (values) => {
        if (current) {
          onFinish(await handleSubmit({ ...current, ...values }, updateBanner));
        } else {
          onFinish(await handleSubmit({ ...values }, addBanner));
        }
      }}
      columns={
        columns
          .map((n) => {
            if (n.dataIndex === 'url') {
              return {
                ...n,
                colProps: 24,
                renderFormItem: () => {
                  return (
                    <>
                      <ProFormUploadButton
                        title="上传图片"
                        listType="picture-card"
                        max={1}
                        fileList={fileList}
                        fieldProps={{
                          onPreview: (file) => {
                            if (file && file?.url) {
                              setPriviewSrc(file?.url);
                              setVisible(true);
                            }
                          },
                          customRequest: (options) => handleUploadFile(options),
                          onRemove: async (file: UploadFile<any>) => {
                            if (file?.url && (await handleRemove(file.url))) {
                              formRef.current?.setFieldValue('url', '');
                            }
                            return true;
                          },
                        }}
                        onChange={({ fileList: newFileList }) => setFileList(newFileList)}
                      />
                      <Image
                        src={priviewSrc}
                        style={{ display: 'none' }}
                        preview={{
                          visible,
                          src: priviewSrc,
                          onVisibleChange: (value) => {
                            setVisible(value);
                          },
                        }}
                      />
                    </>
                  );
                },
              };
            }
            return n;
          })
          .reverse() as any
      }
      {...otherConfig}
    />
  );
};

export default CreateTeamModal;
