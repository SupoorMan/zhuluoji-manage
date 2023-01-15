import { pageConvert, updateConvert } from '@/services/miniprogram/orderConvert';
import { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import { PageContainer, ProDescriptions, ProTable } from '@ant-design/pro-components';
import { Drawer, InputNumber, message, Modal, Image } from 'antd';
import React, { useRef, useState } from 'react';

/**@description 更新订单
 * @fields 订单信息
 */
const handleUpdate = async (fields: API.OrderConvert) => {
  const hide = message.loading('更新中');
  try {
    await updateConvert({ ...fields });
    hide();
    message.success('更新订单成功');
    return true;
  } catch (error) {
    hide();
    message.success('更新订单失败，请稍后重试');
    return false;
  }
};

const OrderList: React.FC = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);
  // const [sendIntegral, setSendIntegral] = useState<number>(2);
  const [currentRow, setCurrentRow] = useState<API.OrderConvert>();
  const actionRef = useRef<ActionType>();
  const sendIntegral = useRef<any>();
  const columns: ProColumns<API.OrderConvert>[] = [
    {
      title: '订单图片',
      dataIndex: 'images',
      valueType: 'image',
      hideInSearch: true,

      render: (_, record) => <Image src={record.images} width={80} height={130} />,
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
      title: '消费价格',
      dataIndex: 'costs',
      valueType: 'money',
      hideInSearch: true,
    },
    {
      title: '订单备注',
      dataIndex: 'remark',
      hideInSearch: true,
    },
    {
      title: '奖励积分',
      dataIndex: 'integral',
      valueType: 'digit',
      hideInSearch: true,
      sorter: true,
      render: (dom, record) => (record.integral ? <>{dom}积分</> : '-'),
    },

    {
      title: '来源',
      dataIndex: 'type',
      valueEnum: {
        4: {
          text: '其他',
          status: 'Default',
        },
        0: {
          text: '微信',
          status: 'Success',
        },
        1: {
          text: '淘宝',
          status: 'Warning',
        },
        2: {
          text: '小红书',
          status: 'Error',
        },
        3: {
          text: '抖音',
          status: 'Processing',
        },
      },
    },
    {
      title: '审核状态',
      dataIndex: 'status',
      valueEnum: {
        0: {
          text: '待审核',
          status: 'Processing',
        },
        1: {
          text: '通过',
          status: 'success',
        },
        2: {
          text: '未通过',
          status: 'success',
        },
      },
    },
    {
      title: '申请时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '购买用户id',
      dataIndex: 'appletUserId',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => {
        return record.status === 0
          ? [
              <a
                key="config"
                onClick={() => {
                  Modal.confirm({
                    title: '请输入奖励积分',
                    content: (
                      <InputNumber
                        ref={sendIntegral}
                        style={{ marginTop: 8, marginBottom: 16, width: 200 }}
                        placeholder="奖励积分2~10积分"
                        min={2}
                        max={10}
                      />
                    ),
                    onOk: async () => {
                      if (sendIntegral && !sendIntegral.current.value) {
                        return false;
                      }
                      await handleUpdate({
                        ...record,
                        status: 1,
                        integral: sendIntegral.current.value,
                      });
                      actionRef.current?.reload();
                    },
                  });
                }}
              >
                通过
              </a>,
              <a key="nopass" onClick={() => handleUpdate({ ...record, status: 2 })}>
                {' '}
                不通过
              </a>,
            ]
          : '';
      },
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.OrderConvert>
        headerTitle="列表"
        actionRef={actionRef}
        rowKey="id"
        request={async (params) => {
          const { data } = await pageConvert(params);
          return { data: data?.records || 0, success: true, total: data?.total || 0 };
        }}
        columns={columns}
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
          <ProDescriptions<API.OrderConvert>
            column={1}
            title={currentRow?.id}
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
              }) as ProDescriptionsItemProps<API.OrderConvert>[]
            }
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default OrderList;
