/* eslint-disable no-debugger */
import { getOrders } from '@/services/miniprogram/orders';
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  ProColumns,
  ProDescriptionsItemProps,
  TableDropdown,
} from '@ant-design/pro-components';
import { PageContainer, ProDescriptions, ProTable } from '@ant-design/pro-components';
import { Button, Drawer, Input, message } from 'antd';
import React, { useRef, useState } from 'react';

// /**
//  * @en-US Add node
//  * @zh-CN 添加节点
//  * @param fields
//  */
// const handleAdd = async (fields: API.Order) => {
//   const hide = message.loading('正在添加');
//   try {
//     await addProd({ ...fields });
//     hide();
//     message.success('Added successfully');
//     return true;
//   } catch (error) {
//     hide();
//     message.error('Adding failed, please try again!');
//     return false;
//   }
// };

// /**
//  * @en-US Update node
//  * @zh-CN 更新节点
//  *
//  * @param fields
//  */
// const handleUpdate = async (fields: API.Order) => {
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
// const handleRemove = async (selectedRows: API.Order[]) => {
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

const TableList: React.FC = () => {
  /**
   * @zh-CN 新建窗口的弹窗
   *  */
  // const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  // const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.Order>();
  // const [selectedRowsState, setSelectedRows] = useState<API.Order[]>([]);

  const columns: ProColumns<API.Order>[] = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
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
      title: '价值',
      dataIndex: 'integral',
      valueType: 'digit',
      hideInSearch: true,
      sorter: true,
      renderText: (val: string) => `${val} 积分`,
    },
    {
      title: '数量',
      dataIndex: 'amount',
      valueType: 'digit',
      hideInSearch: true,
    },
    {
      title: '运费',
      dataIndex: 'expressFee',
      valueType: 'money',
      hideInSearch: true,
    },

    {
      title: '当前进度',
      dataIndex: 'status',
      valueEnum: {
        '-1': {
          text: '取消',
          status: 'Default',
        },
        0: {
          text: '待付款',
          status: 'Error',
        },
        1: {
          text: '待发货',
          status: 'Processing',
        },
        2: {
          text: '待签收',
          status: 'Warning',
        },
        3: {
          text: '已签收',
          status: 'Success',
        },
      },
    },
    {
      title: '状态',
      dataIndex: 'state',
      valueEnum: {
        0: {
          text: '有效',
          status: 'Processing',
        },
        1: {
          text: '用户删除',
          status: 'Default',
        },
        2: {
          text: '系统删除',
          status: 'Warning',
        },
      },
    },
    {
      title: '下单时间',
      sorter: true,
      dataIndex: 'createTime',
      valueType: 'dateTime',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '购买用户',
      dataIndex: 'appletUserId',
      hideInSearch: true,
    },
    {
      title: '收货地址详情',
      dataIndex: 'receiveAddress',
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
      <ProTable<API.Order, API.PageParams>
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
          const { data } = await getOrders(params);
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
        title="创建商品"
        width="400px"
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.Order);
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
              message: '商品名称',
            },
          ]}
          width="md"
          name="name"
        />
        <ProFormTextArea width="md" name="desc" />
      </ModalForm>
      <UpdateForm
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
          <ProDescriptions<API.Order>
            column={2}
            title={currentRow?.id}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<API.Order>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
