import React, { useRef, useState } from 'react';
import {
  nanoid,
  ProFormColumnsType,
  ProFormInstance,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import { message, Image, UploadFile } from 'antd';
import { UploadRequestOption } from 'rc-upload/lib/interface';
import { deleteFile, uploadFile } from '@/services/miniprogram/file';
import { addActivity, updateActivity } from '@/services/miniprogram/activity';

interface Iprops<T> {
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  current?: T;
  columns: ProFormColumnsType<T>[];
  [key: string]: any;
}
/**
 * @param fields 用户信息
 */
const handleSubmit = async (
  fields: API.Activity,
  backFn: (arg: any) => Promise<API.CommonResult>,
) => {
  const hide = message.loading('正在' + (fields?.id ? '更新' : '添加'));
  try {
    const { code } = await backFn({ ...fields, type: 1 });
    hide();
    if (code === 200) {
      message.success(fields?.id ? '更新成功' : '添加成功');
      return true;
    } else {
      throw Error('失败');
    }
  } catch (error) {
    hide();
    message.error((fields?.id ? '更新' : '添加') + '失败, 请稍后重试!');
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
const CreateTeamModal = (props: Iprops<API.Activity>) => {
  const { title, current, onOpenChange, columns, onFinish, ...otherConfig } = props;
  const [visible, setVisible] = useState<boolean>(false);
  const [priviewSrc, setPriviewSrc] = useState<string>('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const formRef = useRef<ProFormInstance>();
  const handleUploadFile = async (options: UploadRequestOption<any>) => {
    const file = options.file as File;
    if (file) {
      const result = await uploadFile({ area: '活动海报' }, {}, file);
      if (result && result.data) {
        const file: UploadFile = {
          uid: nanoid(),
          name: result.data.split('_')[1],
          status: 'done',
          url: result.data as string,
        };
        formRef.current?.setFieldValue('images', result.data);
        setFileList([...fileList, file]);
      }
    }
  };
  return (
    <>
      <SchemaForm<API.Activity>
        formRef={formRef}
        title={title}
        width={'70%'}
        modalProps={{
          onCancel: () => onOpenChange(false),
        }}
        colProps={{ span: 12 }}
        onOpenChange={(open: boolean) => {
          if (open) {
            if (current) {
              if (current?.images) {
                setFileList([
                  {
                    uid: nanoid(),
                    name: current?.images.split('_')[1],
                    status: 'done',
                    url: current?.images,
                  },
                ]);
              }
              formRef.current?.setFieldsValue({
                ...current,
                days: current.days?.split(','),
              });
            }
          } else {
            formRef.current?.resetFields();
          }
        }}
        layoutType="ModalForm"
        onFinish={async (values) => {
          const newValues = { ...values, days: values.days?.toString() };
          if (current) {
            onFinish(await handleSubmit({ ...current, ...newValues }, updateActivity));
          } else {
            onFinish(await handleSubmit({ ...newValues, status: 0 }, addActivity));
          }
        }}
        columns={[
          ...columns.map((m) => {
            console.log(m);
            if (m.dataIndex === 'images') {
              return {
                ...m,
                colProps: { span: 24 },
                formItemProps: {
                  style: {
                    marginBottom: 0,
                  },
                },
                renderFormItem: () => {
                  return (
                    <ProFormUploadButton
                      title="活动海报"
                      listType="picture-card"
                      colProps={{ span: 24 }}
                      max={1}
                      fileList={fileList}
                      formItemProps={{ style: { marginBottom: 0 } }}
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
                            formRef.current?.setFieldValue('images', '');
                          }
                          return true;
                        },
                      }}
                      onChange={({ fileList: newFileList }) => setFileList(newFileList)}
                    />
                  );
                },
              };
            }
            return m;
          }),
        ].reverse()}
        {...otherConfig}
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
};

export default CreateTeamModal;
