import { deleteFile, uploadFile } from '@/services/miniprogram/file';
import { updateHome, pageHome, getHomeDetail } from '@/services/miniprogram/home';
import { PlusOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProFormColumnsType } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, message, notification, Upload } from 'antd';
import { RcFile } from 'antd/es/upload/interface';
import { UploadRequestOption } from 'rc-upload/lib/interface';
import React, { useRef, useState } from 'react';
import EditModal from './components/EditHome';
import PhotoShareDrawer from './components/EditModal';
/**@description 更新家的状态
 * @fields 家的信息
 */
const handleUpdata = async (fields: API.Home) => {
  const hide = message.loading('更新中');
  try {
    await updateHome({ home: [{ ...fields }] });
    hide();
    message.success('更新状态成功');
    return true;
  } catch (error) {
    hide();
    message.success('更新状态失败，请稍后重试');
    return false;
  }
};
/**删除文件
 * @filePath 文件地址
 */
const handleRemove = async (filePath: string) => {
  try {
    await deleteFile({ file: filePath });
    return true;
  } catch (error) {
    return false;
  }
};

const HomeList: React.FC = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [createModalOpen, handleModalOpen] = useState<boolean>(false); // 新建窗口的弹窗
  const [currentRow, setCurrentRow] = useState<API.Home>();
  const [curPhotos, setCurPhotos] = useState<API.Home[]>();
  const actionRef = useRef<ActionType>();

  // 上传视频
  const handleUploadFile = async (options: UploadRequestOption<any>, record: API.Home) => {
    const file = options.file as RcFile;
    if (file) {
      const result = await uploadFile({ area: '侏罗纪的家' }, {}, file);
      if (result && result.data) {
        const { code } = await updateHome({ home: [{ ...record, images: result.data }] });
        if (code === 200) {
          return true;
        }
      }
      message.error(result.msg);
      return false;
    }
  };
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
      // hideInTable: true,
      hideInSearch: true,
      hideInForm: true,
      formItemProps: {
        rules: [{ required: true, message: '请上传roomtour视频文件' }],
      },
      render: (_, record) => {
        return record.images ? <video src={record.images} width="120" height="80"></video> : '-';
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
      width: 220,
      render: (_, record) => [
        <Upload
          key="upVideo"
          accept="video/*"
          maxCount={1}
          showUploadList={false}
          customRequest={async (options) => {
            if (record.images) {
              await handleRemove(record.images);
            }
            notification.open({
              message: '通知',
              description: options.filename + '正在上传中,请等待...',
            });
            if (await handleUploadFile(options, record)) {
              actionRef.current?.reload();
            }
          }}
        >
          <a>上传视频</a>
        </Upload>,
        <a
          key="photo"
          onClick={async () => {
            const { data = [] } = await getHomeDetail({ id: record?.id });
            setCurPhotos([...data]);
            setCurrentRow({ ...record });
            setShowDetail(true);
          }}
        >
          图片配置
        </a>,
        <a
          key="config"
          onClick={async () => {
            setCurrentRow(record);
            handleModalOpen(true);
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
          const { data } = await pageHome({ ...params, topId: -1 });
          return { data: data?.records || 0, success: true, total: data?.total || 0 };
        }}
        columns={columns}
      />
      <EditModal
        key="editM"
        title={`${currentRow ? `编辑` : `新建`} 侏罗纪的家`}
        width={400}
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
        columns={columns as ProFormColumnsType<API.Home>[]}
      />
      {showDetail && curPhotos && (
        <PhotoShareDrawer
          key="photoShareD"
          title={currentRow?.names + '图片配置'}
          open={showDetail}
          current={currentRow}
          photoList={curPhotos}
          onFinish={(success: boolean) => {
            if (success) {
              setShowDetail(false);
              setCurrentRow(undefined);
              setCurPhotos(undefined);
              actionRef.current?.reload();
            }
          }}
          onOpenChange={function (open: boolean): void {
            setShowDetail(open);
            if (!open) {
              setCurrentRow(undefined);
              setCurPhotos(undefined);
            }
          }}
        />
      )}
    </PageContainer>
  );
};

export default HomeList;
