import React, { useEffect, useRef, useState } from 'react';
import {
  nanoid,
  ProFormColumnsType,
  ProFormInstance,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import { message, Image, UploadFile } from 'antd';
import { deleteFile, uploadFile } from '@/services/miniprogram/file';
import { UploadRequestOption } from 'rc-upload/lib/interface';
import { addActProd, updateActProd } from '@/services/miniprogram/activityProduct';

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
  fields: API.LivePreview,
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
  }, [current]);

  const handleUploadFile = async (options: UploadRequestOption<any>) => {
    const file = options.file as File;
    if (file) {
      const result = await uploadFile({ area: '直播商品' }, {}, file);
      if (result && result.data) {
        const file: UploadFile = {
          uid: nanoid(),
          name: nanoid(),
          status: 'done',
          url: result.data as string,
        };
        formRef.current?.setFieldValue('images', result.data);
        setFileList([file]);
      }
    }
  };
  /**
   * @name proColumns 规格Columns
   *
   */
  const amoutColumns: ProFormColumnsType<{
    sizes: string;
    colors: string;
    price: number;
    id: number;
  }> = {
    title: '赠品规格',
    valueType: 'formList',
    dataIndex: 'list',
    colProps: { md: 24 },
    initialValue: [{ sizes: '', colors: '', price: '', id: '' }],
    fieldProps: {
      copyIconProps: false,
      creatorButtonProps: {},
    },
    formItemProps: {
      rules: [{ required: true, message: '至少有一个商品规格' }],
      style: {
        marginBottom: 10,
      },
    },
    rowProps: { gutter: 0 },
    columns: [
      {
        valueType: 'group',
        width: 'md',
        colProps: { md: 24 },
        rowProps: { gutter: [20, 0] },
        columns: [
          {
            dataIndex: 'sizes',
            colProps: { span: 8 },
            fieldProps: {
              placeholder: '名称',
            },
          },
          // {
          //   dataIndex: 'colors',
          //   colProps: { span: 8 },
          //   fieldProps: {
          //     placeholder: '优惠',
          //   },
          // },
          {
            colProps: { span: 8 },
            width: 'md',
            dataIndex: 'price',
            valueType: 'money',
            formItemProps: {
              rules: [{ required: true, message: '请输入原价' }],
            },
            fieldProps: {
              addonBefore: '原价',
              placeholder: '原价',
            },
          },
        ],
      },
    ],
  };
  return (
    <SchemaForm<T>
      formRef={formRef}
      title={title}
      colProps={{ span: 12 }}
      onOpenChange={(open: boolean) => {
        onOpenChange(open);
        if (open) {
          if (current) {
            formRef.current?.setFieldsValue({
              ...current,
              type: `${current.type}`,
              topType: `${current.topType}`,
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
          onFinish(await handleSubmit({ ...current, ...values }, updateActProd));
        } else {
          onFinish(await handleSubmit({ ...values, type: 0 }, addActProd));
        }
      }}
      columns={
        [
          ...columns.map((n) => {
            if (n.dataIndex === 'images') {
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
            } else if (n.dataIndex === 'details') {
              return {
                ...n,
                colProps: 24,
              };
            }
            return n;
          }),
          amoutColumns,
        ] as any
      }
      {...otherConfig}
    />
  );
};

export default CreateTeamModal;
