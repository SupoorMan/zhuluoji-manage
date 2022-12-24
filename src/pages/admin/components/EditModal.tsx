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
const handleUserData = async (fields: API.ManageUser, backFn: (arg: any) => void) => {
  const hide = message.loading('正在添加');
  try {
    await backFn({ ...fields });
    hide();
    message.success(fields?.id ? '更新成功' : '添加成功');
    return true;
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
  const { title, current, onOpenChange, columns, ...otherConfig } = props;
  const formRef = useRef<ProFormInstance>();
  //   const columns: ProFormColumnsType<T>[] = [
  //     {
  //       title: '名称',
  //       dataIndex: 'phone',
  //       formItemProps: {
  //         rules: [{ required: true, message: '单位名称为必填项' }],
  //       },
  //     },
  //     {
  //       title: '团队类型',
  //       dataIndex: 'typeName',
  //       valueType: 'select',
  //       fieldProps: {
  //         options: props.typeNames.map((i) => {
  //           return {
  //             value: i,
  //             label: i,
  //           };
  //         }),
  //       },
  //       formItemProps: {
  //         rules: [{ required: true, message: '类型为必填项' }],
  //       },
  //     },
  //     {
  //       title: '团队代码',
  //       dataIndex: 'code',
  //       formItemProps: {
  //         rules: [{ required: true, message: '团队代码为必填项' }],
  //       },
  //     },
  //     {
  //       title: '团队简称',
  //       dataIndex: 'name',
  //       formItemProps: {
  //         rules: [{ required: true, message: '团队简称为必填项' }],
  //       },
  //     },
  //     {
  //       title: '团队标识',
  //       dataIndex: 'teamCode',
  //       formItemProps: {
  //         rules: [{ required: true, message: '团队标识为必填项' }],
  //       },
  //     },
  //     {
  //       title: '团队信息备注',
  //       dataIndex: 'teamRemark',
  //       valueType: 'textarea',
  //       colProps: { span: 24 },
  //     },
  //   ];
  return (
    <SchemaForm<T>
      autoComplete={false}
      formRef={formRef}
      title={title}
      width={'70%'}
      colProps={{ span: 24 }}
      onOpenChange={(open: boolean) => {
        onOpenChange(open);
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
        debugger;
        if (current) {
          return await handleUserData({ ...current, ...values }, updateUser);
        } else {
          return await handleUserData({ ...values, state: 1 }, addUser);
        }
      }}
      columns={columns.map((n) => ({
        ...n,
        formItemProps: { requiredMark: false },
        fieldProps: { autoComplete: `off` },
      }))}
      {...otherConfig}
    />
  );
};

export default CreateTeamModal;
