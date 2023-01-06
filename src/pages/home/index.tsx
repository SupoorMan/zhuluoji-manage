import { updateHome, pageHome, getHomeDetail } from '@/services/miniprogram/home';
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  ProColumns,
  ProDescriptionsItemProps,
  ProFormColumnsType,
} from '@ant-design/pro-components';
import { PageContainer, ProDescriptions, ProTable } from '@ant-design/pro-components';
import { Button, Drawer, message, Tabs } from 'antd';
import React, { useRef, useState } from 'react';
import EditModal from './components/EditModal';
/**@description 更新家的状态
 * @fields 家的信息
 */
const handleUpdata = async (fields: API.Home) => {
  const hide = message.loading('更新中');
  try {
    await updateHome({ ...fields });
    hide();
    message.success('更新售后处理进度成功');
    return true;
  } catch (error) {
    hide();
    message.success('更新售后处理进度失败，请稍后重试');
    return false;
  }
};

const HomeList: React.FC = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [createModalOpen, handleModalOpen] = useState<boolean>(false); // 新建窗口的弹窗
  const [currentRow, setCurrentRow] = useState<API.Home>();
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<API.Home>[] = [
    {
      title: '名称',
      dataIndex: 'names',
      hideInSearch: true,
      width: 'md',
    },
    {
      title: '简介',
      dataIndex: 'introduction',
      valueType: 'textarea',
      width: 'md',
      hideInSearch: true,
    },
    {
      title: 'roomtour',
      dataIndex: 'images',
      hideInTable: true,
      hideInSearch: true,
      formItemProps: {
        rules: [{ required: true, message: '请上传roomtour视频文件' }],
      },
      render: (_, record) => {
        return record.images ? <video src={record.images}></video> : '-';
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: '关闭',
          status: 'Default',
        },
        1: {
          text: '开启',
          status: 'Processing',
        },
      },
    },
    {
      title: '更新时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={async () => {
            const { data } = await getHomeDetail({ topId: record?.id });
            setCurrentRow({ ...record, list: data });
            setShowDetail(true);
          }}
        >
          编辑
        </a>,
        <a
          key="show"
          onClick={async () => {
            const success = await handleUpdata({ ...record, status: record.status === 1 ? 0 : 1 });
            if (success) {
              actionRef.current?.reload();
            }
          }}
        >
          {record.status === 1 ? '关闭' : '开启'}
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.Home>
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={async (params) => {
          const { data } = await pageHome({ ...params, topId: '-1' });
          return { data: data?.records || 0, success: true, total: data?.total || 0 };
        }}
        columns={columns}
      />
      <EditModal<API.Banner>
        title={`${currentRow ? `编辑` : `新建`} 侏罗纪的家`}
        width={720}
        open={createModalOpen}
        onFinish={(success: boolean) => {
          if (success) {
            actionRef.current?.reload();
            handleModalOpen(false);
          }
        }}
        onOpenChange={(open) => {
          handleModalOpen(open);
          if (!open) {
            setCurrentRow(undefined);
          }
        }}
        current={currentRow}
        columns={columns as ProFormColumnsType<API.Banner>[]}
      />
      <Drawer
        width={700}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        <Tabs
          items={[
            { key: '0', label: 'roomtour' },
            { key: '1', label: '图纸分享' },
          ]}
        />
        {currentRow?.id && (
          <ProDescriptions<API.Home>
            column={1}
            title={currentRow?.id}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<API.Home>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default HomeList;
