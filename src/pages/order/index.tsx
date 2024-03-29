import {
  cancelOrder,
  getOrders,
  updateStatus,
  updateOrderAddr,
} from '@/services/miniprogram/orders';
import {
  ActionType,
  ProColumns,
  ProDescriptionsItemProps,
  TableDropdown,
} from '@ant-design/pro-components';
import { PageContainer, ProDescriptions, ProTable } from '@ant-design/pro-components';
import { Drawer, Input, message, Modal } from 'antd';
import React, { useRef, useState } from 'react';

/**@description 发货
 * @fields 订单信息
 */
const handleUpdate = async (fields: API.Order) => {
  const hide = message.loading('更新中');
  try {
    await updateStatus({ ...fields, status: 2 });
    hide();
    message.success('更新发货进度成功');
    return true;
  } catch (error) {
    hide();
    message.success('更新发货进度失败，请稍后重试');
    return false;
  }
};
/**@description 更新发货地址
 * @fields 新订单信息
 */
const handleUpdateAddr = async (fields: API.Order) => {
  const hide = message.loading('更新中');
  try {
    await updateOrderAddr({ ...fields });
    hide();
    message.success('更新收货地址成功');
    return true;
  } catch (error) {
    hide();
    message.success('更新收货地址失败，请稍后重试');
    return false;
  }
};

/**
 * @description 取消订单
 * @record 订单信息
 */
const handleCancel = async (record: API.Order) => {
  const hide = message.loading('正在取消');
  try {
    await cancelOrder(record);
    hide();
    message.success('取消成功');
    return true;
  } catch (error) {
    hide();
    message.error('取消失败, 请稍后重试');
    return false;
  }
};

const OrderList: React.FC = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);
  // const [sendCode, setSendCode] = useState<string>('');
  const [currentRow, setCurrentRow] = useState<API.Order>();
  const actionRef = useRef<ActionType>();
  const newAddressText = useRef<any>();
  const sendCode = useRef<any>();
  const columns: ProColumns<API.Order>[] = [
    {
      title: '关键字',
      dataIndex: 'context',
      hideInDescriptions: true,
      hideInTable: true,
      fieldProps: {
        placeholder: '请输入订单号、商品名称或收货地址',
      },
    },
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
      title: '商品',
      dataIndex: 'productName',
      hideInSearch: true,
    },
    {
      title: '规格',
      dataIndex: 'sizes',
      hideInSearch: true,
      render: (_, record) => {
        return (record?.colors || '') + record?.sizes;
      },
    },
    {
      title: '数量',
      dataIndex: 'amount',
      valueType: 'digit',
      hideInSearch: true,
    },
    {
      title: '价值',
      dataIndex: 'integral',
      valueType: 'digit',
      hideInSearch: true,
      sorter: true,
      render: (dom) => <>{dom}积分</>,
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
      title: '运单号',
      dataIndex: 'transferNo',
      hideInSearch: true,
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
          text: '用户取消',
          status: 'Default',
        },
        2: {
          text: '系统取消',
          status: 'Warning',
        },
      },
    },

    {
      title: '购买用户',
      dataIndex: 'nickname',
      hideInSearch: true,
    },
    {
      title: '收货地址',
      dataIndex: 'receiveAddress',
      valueType: 'textarea',
      fieldProps: {
        style: {
          width: 300,
        },
      },
      hideInSearch: true,
    },
    {
      title: '下单时间',
      sorter: true,
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      hideInDescriptions: true,
      render: (_, record) => [
        record.status === 1 ? (
          <a
            key="config"
            onClick={() => {
              Modal.confirm({
                title: '是否确认发货',
                content: (
                  <Input
                    ref={sendCode}
                    style={{ marginTop: 8, marginBottom: 16 }}
                    placeholder="请输入运单号"
                  />
                ),
                onOk: async () => {
                  if (sendCode && sendCode.current.input.value) {
                    await handleUpdate({ ...record, transferNo: sendCode.current.input.value });
                    actionRef.current?.reload();
                  }
                },
              });
            }}
          >
            发货
          </a>
        ) : (
          ''
        ),
        <TableDropdown
          key="actionGroup"
          menus={[
            {
              key: 'change',
              name: '修改收货地址',
              onClick: () => {
                Modal.confirm({
                  title: '更新收货地址',
                  content: (
                    <Input.TextArea
                      ref={newAddressText}
                      style={{ marginTop: 8, marginBottom: 16 }}
                      defaultValue={record?.receiveAddress}
                      placeholder="请输入新收货地址"
                    />
                  ),
                  onOk: async () => {
                    if (newAddressText && newAddressText.current.resizableTextArea.textArea.value) {
                      await handleUpdateAddr({
                        ...record,
                        receiveAddress: newAddressText.current.resizableTextArea.textArea.value,
                      });
                      actionRef.current?.reload();
                    }
                  },
                });
              },
            },
            { key: 'delete', name: '取消订单', onClick: () => handleCancel(record) },
          ]}
        />,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.Order, API.PageParams>
        headerTitle=""
        actionRef={actionRef}
        rowKey="id"
        request={async (params) => {
          const { data } = await getOrders(params);
          return { data: data?.records || 0, success: true, total: data?.total || 0 };
        }}
        columns={columns}
        pagination={{ defaultPageSize: 10 }}
      />

      <Drawer
        width={500}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.id && (
          <ProDescriptions<API.Order>
            column={1}
            editable={{
              onSave: async (_, newInfo) => {
                return await handleUpdateAddr(newInfo);
              },
            }}
            title={'订单详情'}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={
              columns.map((n) => {
                if (n.dataIndex !== 'receiveAddress') {
                  n.editable = false;
                }
                return n;
              }) as ProDescriptionsItemProps<API.Order>[]
            }
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default OrderList;
