import React, { useRef } from 'react';
import { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import { addUser } from '@/services/miniprogram/manageUser';
import { updateUser } from '@/services/miniprogram/users';
import { message } from 'antd';

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
const handleUserData = async (
  fields: API.ManageUser,
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
/*
  编辑
*/
const CreateTeamModal = <T extends { [key: string]: any }>(props: Iprops<T>) => {
  const { title, current, onOpenChange, columns, onFinish, ...otherConfig } = props;
  const formRef = useRef<ProFormInstance>();
  return (
    <SchemaForm<T>
      formRef={formRef}
      title={title}
      width={'70%'}
      modalProps={{
        onCancel: () => onOpenChange(false),
      }}
      colProps={{ span: 24 }}
      onOpenChange={(open: boolean) => {
        if (open) {
          if (current) {
            formRef.current?.setFieldsValue({
              ...current,
            });
          }
        } else {
          formRef.current?.resetFields();
        }
      }}
      layoutType="ModalForm"
      onFinish={async (values) => {
        if (current) {
          onFinish(await handleUserData({ ...current, ...values }, updateUser));
        } else {
          onFinish(await handleUserData({ ...values, state: 1 }, addUser));
        }
      }}
      columns={columns}
      {...otherConfig}
    />
  );
};

export default CreateTeamModal;
