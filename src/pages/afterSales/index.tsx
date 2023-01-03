import { pageAfterSales, updateSales } from '@/services/miniprogram/salesAfter';
import { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import { PageContainer, ProDescriptions, ProTable } from '@ant-design/pro-components';
import { Drawer, Input, message, Modal } from 'antd';
import React, { useRef, useState } from 'react';

/**@description 更新售后单状态
 * @fields 售后单信息
 */
const handleUpdate = async (fields: API.AfterSales) => {
  const hide = message.loading('更新中');
  try {
    await updateSales({ ...fields });
    hide();
    message.success('更新售后处理进度成功');
    return true;
  } catch (error) {
    hide();
    message.success('更新售后处理进度失败，请稍后重试');
    return false;
  }
};

const AfterSalesList: React.FC = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [solveDetail, setSolveDetail] = useState<string>('');
  const [currentRow, setCurrentRow] = useState<API.AfterSales>();
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<API.AfterSales>[] = [
    {
      title: '订单id',
      dataIndex: 'ordersId',
      hideInSearch: true,
    },
    {
      title: '当前进度',
      dataIndex: 'status',
      valueEnum: {
        0: {
          text: '待处理',
          status: 'Success',
        },
        1: {
          text: '处理中',
          status: 'Processing',
        },
        2: {
          text: '处理完成',
          status: 'Default',
        },
      },
    },
    {
      title: '申请用户',
      dataIndex: 'appletUserId',
      hideInSearch: true,
    },
    {
      title: '申请信息',
      dataIndex: 'message',
      valueType: 'textarea',
      fieldProps: {
        style: {
          width: 300,
        },
      },
      hideInSearch: true,
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
        record.status === 1 ? (
          <a
            key="config"
            onClick={() => {
              Modal.confirm({
                title: '是否确认处理完成',
                content: (
                  <Input.TextArea
                    style={{ marginTop: 8, marginBottom: 16 }}
                    placeholder="请输入处理信息"
                    onChange={(e) => {
                      const { value } = e.target;
                      setSolveDetail(value);
                    }}
                  />
                ),
                onOk: () => {
                  if (solveDetail === '') {
                    message.error('请输入');
                  }
                  handleUpdate({ ...record, status: 2, solveDetail });
                },
              });
            }}
          >
            完成
          </a>
        ) : record.status === 0 ? (
          <a onClick={() => handleUpdate({ ...record, status: 1 })}>开始处理</a>
        ) : (
          ''
        ),
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.AfterSales, API.PageParams>
        headerTitle=""
        actionRef={actionRef}
        rowKey="id"
        request={async (params) => {
          const { data } = await pageAfterSales(params);
          return { data: data?.records || 0, success: true, total: data?.totle || 0 };
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
          <ProDescriptions<API.AfterSales>
            column={1}
            title={currentRow?.id}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<API.AfterSales>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default AfterSalesList;
