import React, { useRef, useState } from 'react';
import { message, Upload, UploadProps, Image, Button, Space, Avatar } from 'antd';
import { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import { BankOutlined } from '@ant-design/icons';
import { uploadFile } from '@/services/miniprogram/file';
import { addProd, updateProd } from '@/services/miniprogram/product';

interface Iprops {
  title: string;
  open: boolean;
  handleCancel: () => void;
  handleOk: (newItem: API.IntegralProduct | undefined) => void;
  current: API.IntegralProduct;
  typeNames: string[];
}
/*
  编辑
*/
const CreateTeamModal = (props: Iprops) => {
  const { open, title, handleOk, current, handleCancel } = props;
  const formRef = useRef<ProFormInstance>();
  const [avatar, setAvatar] = useState<any>();
  const uploadProps: UploadProps = {
    multiple: false,
    showUploadList: false,
    maxCount: 1,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image');
      if (!isImage) {
        message.error(`${file.name} 不是一个图片文件`);
      }
      return isImage;
    },
    async customRequest(options) {
      const file = options.file as File;
      if (file) {
        const { data } = await uploadFile({ area: '商品' }, file);
        if (data) {
          setAvatar(data.shareInfo());
        }
      }
    },
  };
  const columns: ProFormColumnsType<API.IntegralProduct>[] = [
    {
      title: '图标',
      dataIndex: 'avatar',
      colProps: { span: 24 },
      renderFormItem: () => {
        return (
          <Space>
            <Avatar
              size={64}
              style={{ background: '#f9f9f9', color: '#606060', fontSize: 10 }}
              src={
                avatar ? (
                  <Image src={avatar.thumbnail} preview={{ src: avatar.shareLink }} />
                ) : (
                  <BankOutlined style={{ fontSize: 16 }} />
                )
              }
            />
            <Upload {...uploadProps}>
              <Button type="link">上传图标</Button>
            </Upload>
            {avatar ? (
              <Button type="link" onClick={() => setAvatar(undefined)}>
                清除图标
              </Button>
            ) : (
              ''
            )}
          </Space>
        );
      },
    },
    {
      title: '名称',
      dataIndex: 'teamName',
      formItemProps: {
        rules: [{ required: true, message: '单位名称为必填项' }],
      },
    },
    {
      title: '团队类型',
      dataIndex: 'typeName',
      valueType: 'select',
      fieldProps: {
        options: props.typeNames.map((i) => {
          return {
            value: i,
            label: i,
          };
        }),
      },
      formItemProps: {
        rules: [{ required: true, message: '类型为必填项' }],
      },
    },
    {
      title: '团队代码',
      dataIndex: 'code',
      formItemProps: {
        rules: [{ required: true, message: '团队代码为必填项' }],
      },
    },
    {
      title: '团队简称',
      dataIndex: 'name',
      formItemProps: {
        rules: [{ required: true, message: '团队简称为必填项' }],
      },
    },
    {
      title: '团队标识',
      dataIndex: 'teamCode',
      formItemProps: {
        rules: [{ required: true, message: '团队标识为必填项' }],
      },
    },
    {
      title: '团队信息备注',
      dataIndex: 'teamRemark',
      valueType: 'textarea',
      colProps: { span: 24 },
    },
  ];
  return (
    <SchemaForm<API.IntegralProduct>
      formRef={formRef}
      title={title}
      open={open}
      width={'70%'}
      onOpenChange={(open: boolean) => {
        if (open) {
          formRef.current?.setFieldValue('typeName', props.typeNames[0]);
          if (title === '编辑') {
            // setAvatar(parseAvatar(current.avatar));
            formRef.current?.setFieldsValue({
              ...current,
            });
          }
        } else {
          formRef.current?.resetFields();
          setAvatar(undefined);
          handleCancel();
        }
      }}
      rowProps={{
        gutter: [24, 0],
      }}
      layoutType="DrawerForm"
      onFinish={async (values) => {
        // values.avatar = JSON.stringify(avatar);
        if (title === '编辑') {
          await updateProd(values);
          // handleOk();
        } else {
          await addProd(values);
          // handleOk();
        }
      }}
      columns={columns}
    ></SchemaForm>
  );
};

export default CreateTeamModal;
