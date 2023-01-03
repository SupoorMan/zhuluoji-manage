import React, { useEffect, useRef, useState } from 'react';
import {
  nanoid,
  ProFormColumnsType,
  ProFormInstance,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import { message, Image, UploadFile } from 'antd';
import { addLivePreview, updateLivePreview } from '@/services/miniprogram/livePreview';
import { deleteFile, uploadFile } from '@/services/miniprogram/file';
import { UploadRequestOption } from 'rc-upload/lib/interface';
import { getProds } from '@/services/miniprogram/product';

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
    await deleteFile({ file: [filePath] });
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
  const [prods, setProds] = useState<API.IntegralProduct[]>();
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
      const result = await uploadFile({ area: '直播预告' }, {}, file);
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
      console.log(result.data);
    }
  };
  /**
   * @name proColumns 商品信息Columns
   *
   */
  const proColumns: ProFormColumnsType<{ name: string; price: number; count: number }> = {
    title: '直播商品',
    valueType: 'formList',
    dataIndex: 'products',
    colProps: { md: 24 },
    initialValue: [{ name: '', price: '', count: '' }],
    fieldProps: {
      copyIconProps: false,
      creatorButtonProps: {},
    },
    columns: [
      {
        dataIndex: 'sourceBase',
        valueType: 'group',
        width: 'md',
        colProps: { md: 24 },
        rowProps: { gutter: [24, 24] },
        columns: [
          {
            title: '商品名称',
            dataIndex: 'name',
            valueType: 'select',
            fieldProps: {
              showSearch: true,
              labelInValue: true,
              placeholder: '请输入商品名称搜索积分商品库',
              fieldNames: {
                label: 'productName',
                value: 'productName',
              },
              onSearch: async (value?: string) => {
                const result = await getProds({ name: value, pageSize: 30, current: 1 });
                setProds(result.data?.records);
                return result.data?.records;
              },
              options: prods,
            },
            colProps: { span: 12 },
          },
          {
            title: '商品数量',
            colProps: { span: 6 },
            width: 'md',
            dataIndex: 'count',
            valueType: 'digit',
          },
          {
            valueType: 'dependency',
            name: ['name'],
            columns: ({ name }) => {
              if (name) {
                return [
                  {
                    title: '商品价格',
                    colProps: { span: 6 },
                    width: 'md',
                    dataIndex: 'price',
                    fieldProps: {
                      addonAfter: '积分',
                    },
                    initialValue: name?.integral,
                  },
                ];
              }
              return [];
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
              stamps: current.stamps.split('-'),
              type: `${current.type}`,
              products: current.products
                ? JSON.parse(current.products)
                : { name: '', price: '', count: '' },
            });
          }
        } else {
          formRef.current?.resetFields();
        }
      }}
      layoutType="DrawerForm"
      onFinish={async (values) => {
        const newProds = values.products.map((n: any) =>
          typeof n.name === 'object' ? { ...n, name: n.name.productName } : { ...n },
        );
        if (current) {
          onFinish(
            await handleSubmit(
              {
                ...current,
                ...values,
                stamps: values.stamps.join('-'),
                products: JSON.stringify(newProds),
              },
              updateLivePreview,
            ),
          );
        } else {
          onFinish(
            await handleSubmit(
              {
                ...values,
                stamps: values.stamps.join('-'),
                products: JSON.stringify(newProds),
              },
              addLivePreview,
            ),
          );
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
                        title="上传封面"
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
                          onRemove: async (file: UploadFile<any>) =>
                            file?.url ? await handleRemove(file.url) : true,
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
            } else if (n.dataIndex === 'links' || n.dataIndex === 'products') {
              return {
                ...n,
                colProps: 24,
              };
            }
            return n;
          }),
          proColumns,
        ] as any
      }
      {...otherConfig}
    />
  );
};

export default CreateTeamModal;
