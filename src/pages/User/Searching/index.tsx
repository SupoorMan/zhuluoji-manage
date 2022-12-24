import { addUser } from '@/services/miniprogram/manageUser';
import { pageUserInfo } from '@/services/miniprogram/users';
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  ModalForm,
  ProColumns,
  ProDescriptionsItemProps,
  ProFormText,
  ProFormTextArea,
  TableDropdown,
} from '@ant-design/pro-components';
import { PageContainer, ProDescriptions, ProTable } from '@ant-design/pro-components';
import { Button, Drawer, Input, message } from 'antd';
import React, { useRef, useState } from 'react';

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.AppletUser) => {
  const hide = message.loading('正在添加');
  try {
    await addUser({ ...fields });
    hide();
    message.success('Added successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Adding failed, please try again!');
    return false;
  }
};

// /**
//  * @en-US Update node
//  * @zh-CN 更新节点
//  *
//  * @param fields
//  */
// const handleUpdate = async (fields: API.AppletUser) => {
//   const hide = message.loading('Configuring');
//   try {
//     await updateProd(fields);
//     hide();

//     message.success('Configuration is successful');
//     return true;
//   } catch (error) {
//     hide();
//     message.error('Configuration failed, please try again!');
//     return false;
//   }
// };

// /**
//  *  Delete node
//  * @zh-CN 删除节点
//  *
//  * @param selectedRows
//  */
// const handleRemove = async (selectedRows: API.AppletUser[]) => {
//   const hide = message.loading('正在删除');
//   if (!selectedRows) return true;
//   try {
//     await deleteProd(selectedRows);
//     hide();
//     message.success('删除成功');
//     return true;
//   } catch (error) {
//     hide();
//     message.error('删除失败, 请稍后重试');
//     return false;
//   }
// };

const MemberList: React.FC = () => {
  /**
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  // const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.AppletUser>();
  // const [selectedRowsState, setSelectedRows] = useState<API.AppletUser[]>([]);

  const columns: ProColumns<API.AppletUser>[] = [
    {
      title: '昵称',
      dataIndex: 'nickname',
      hideInSearch: true,
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '积分',
      dataIndex: 'integral',
      valueType: 'digit',
      hideInSearch: true,
      sorter: true,
      renderText: (val) => `${val} 积分`,
    },
    {
      title: '会员等级',
      dataIndex: 'level',
      valueType: 'digit',
      hideInSearch: true,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      valueEnum: {
        0: {
          text: '女',
          status: 'Default',
        },
        1: {
          text: '男',
          status: 'Processing',
        },
      },
    },
    {
      title: '状态',
      dataIndex: 'state',
      valueEnum: {
        0: {
          text: '禁用',
          status: 'Default',
        },
        1: {
          text: '有效',
          status: 'Processing',
        },
      },
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            // handleUpdateModalOpen(true);
            setCurrentRow(record);
          }}
        >
          修改收货地址
        </a>,
        <TableDropdown
          key="actionGroup"
          onSelect={() => actionRef?.current?.reload()}
          menus={[{ key: 'delete', name: '删除' }]}
        />,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.AppletUser, API.PageParams>
        headerTitle=""
        actionRef={actionRef}
        rowKey="key"
        // search={{
        //   labelWidth: 120,
        // }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              // handleModalOpen(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={async (params) => {
          const { data } = await pageUserInfo(params);
          console.log(data);
          return { data: data?.records || 0, success: true, total: data?.totle || 0 };
        }}
        columns={columns}
        // rowSelection={{
        //   onChange: (_, selectedRows) => {
        //     setSelectedRows(selectedRows);
        //   },
        // }}
      />

      {/* <ModalForm
        title="新建管理员"
        width="400px"
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.AppletUser);
          if (success) {
            handleModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: '手机号',
            },
          ]}
          width="md"
          name="phone"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '密码',
            },
          ]}
          width="md"
          name="pwd"
        />
        <ProFormTextArea width="md" name="remark" />
      </ModalForm> */}
      {/* <UpdateForm
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalOpen(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalOpen(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        updateModalOpen={updateModalOpen}
        values={currentRow || {}}
      /> */}

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.id && (
          <ProDescriptions<API.AppletUser>
            column={2}
            title={currentRow?.id}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<API.AppletUser>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default MemberList;
