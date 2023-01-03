import React, { useEffect, useRef, useState } from 'react';
import {
  nanoid,
  ProFormColumnsType,
  ProFormInstance,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import { message, UploadFile, Image } from 'antd';
import { addProd, updateProd } from '@/services/miniprogram/product';
import { uploadFile, deleteFile } from '@/services/miniprogram/file';
import { UploadRequestOption } from 'rc-upload/lib/interface';

interface Iprops<T extends API.IntegralProduct> {
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  current?: T;
  columns: ProFormColumnsType<T>[];
  [key: string]: any;
}
/** 更新或新增商品
 * @param fields 商品信息
 */
const handleSubmit = async (
  fields: API.IntegralProduct,
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
const CreateTeamModal = <T extends API.IntegralProduct>(props: Iprops<T>) => {
  const { title, current, onOpenChange, columns, onFinish, ...otherConfig } = props;
  const formRef = useRef<ProFormInstance>();
  const [visible, setVisible] = useState<boolean>(false);
  const [priviewSrc, setPriviewSrc] = useState<string>('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  useEffect(() => {
    const list = current?.productImage ? current?.productImage.split(',') : [];
    setFileList(
      list.map((n) => ({
        uid: nanoid(),
        name: n.split('_')[1],
        status: 'done',
        url: n,
      })),
    );
  }, [current]);
  const handleUploadFile = async (options: UploadRequestOption<any>) => {
    const file = options.file as File;
    if (file) {
      const result = await uploadFile({ area: '积分商品' }, {}, file);
      if (result && result.data) {
        const file: UploadFile = {
          uid: nanoid(),
          name: nanoid(),
          status: 'done',
          url: result.data as string,
        };
        formRef.current?.setFieldValue('productImage', result.data);
        setFileList([...fileList, file]);
      }
    }
  };
  return (
    <SchemaForm<T>
      formRef={formRef}
      title={title}
      onOpenChange={(open: boolean) => {
        if (open) {
          if (current) {
            const keys = Object.keys(current);
            let editValues = current;
            for (let index = 0; index < keys.length; index++) {
              const n = keys[index];
              if (n === 'productType' || n === 'tagType' || n === 'shopping') {
                editValues[n] = `${current[n]}`;
              }
            }
            formRef.current?.setFieldsValue(editValues);
          }
        } else {
          formRef.current?.resetFields();
        }
        onOpenChange(open);
      }}
      layoutType="ModalForm"
      onFinish={async (values) => {
        const productImage = fileList.map((n) => n.url);
        if (current) {
          onFinish(
            await handleSubmit(
              {
                ...current,
                ...values,
                productImage: productImage.join(','),
                recommend: values.recommend ? 1 : 0,
              },
              updateProd,
            ),
          );
        } else {
          onFinish(
            await handleSubmit(
              {
                ...values,
                state: 0,
                productImage: productImage.join(','),
                recommend: values.recommend ? 1 : 0,
              },
              addProd,
            ),
          );
        }
      }}
      columns={
        columns.map((n) => {
          if (n.dataIndex === 'productImage') {
            return {
              ...n,
              // width: 'md',
              colProps: { span: 24 },
              renderFormItem: () => {
                return (
                  <>
                    <ProFormUploadButton
                      title="上传图片"
                      listType="picture-card"
                      colProps={{ span: 24 }}
                      max={5}
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
                          if (file?.url) {
                            const files = fileList.filter((n) => n.url !== file.url);
                            if (!files || files.length === 0) {
                              formRef.current?.setFieldValue('productImage', '');
                            }
                            return await handleRemove(file.url);
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
          } else if (n.dataIndex === 'introduction') {
            return { ...n, colProps: 24 };
          } else if (n.dataIndex === 'recommend' || n.dataIndex === 'purchaseLimit') {
            return {
              ...n,
              width: 'md',
              colProps: {
                xs: 24,
                md: 6,
              },
            };
          }
          return n;
        }) as ProFormColumnsType<T>[]
      }
      {...otherConfig}
    />
  );
};

export default CreateTeamModal;
