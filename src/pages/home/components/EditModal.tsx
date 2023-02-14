import React, { useEffect, useRef, useState } from 'react';
import {
  nanoid,
  ProFormColumnsType,
  ProFormInstance,
  ProFormText,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import { message, Image, UploadFile, Card, Space } from 'antd';
import { updateHome } from '@/services/miniprogram/home';
import { deleteFile, uploadFile } from '@/services/miniprogram/file';
import { UploadRequestOption } from 'rc-upload/lib/interface';
import { RcFile } from 'antd/es/upload';
import './index.css';

interface Iprops<T> {
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  current?: T;
  photoList?: T[];
  [key: string]: any;
}
/**
 * @param fields 轮播信息
 */
const handleSubmit = async (
  fields: { deleteList?: string[]; home: API.Home[] },
  backFn: (arg: any) => Promise<API.CommonResult>,
) => {
  const hide = message.loading('正在更新');
  try {
    const { code } = await backFn({ ...fields });
    hide();
    if (code === 200) {
      message.success('更新成功');
      return true;
    } else {
      throw Error('失败');
    }
  } catch (error) {
    hide();
    message.error('更新失败, 请稍后重试!');
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

/*
  编辑
*/
const CreateTeamModal = <T extends { [key: string]: any }>(props: Iprops<T>) => {
  const { title, current, open, onFinish, photoList, ...otherConfig } = props;
  const formRef = useRef<ProFormInstance>();

  const [visible, setVisible] = useState<boolean>(false);
  const [priviewSrc, setPriviewSrc] = useState<string>('');
  const [delIds, setDelIds] = useState<string[]>([]);
  // 商品文件图片
  const [prodFiles, setProdFiles] = useState<Record<string, UploadFile[]>>({});

  // 类型图片文件
  const [photoFileList, setPhotoFileList] = useState<Record<string, UploadFile[]>>({});
  // const [lastPhotoIndex, setLastPhotoIndex] = useState<string>();

  useEffect(() => {
    if (open) {
      if (photoList && photoList?.length > 0) {
        photoList.reverse();
        photoList.forEach((m) => {
          if (m.images) {
            photoFileList[m.id] = m.images.split(',').map((i: string) => ({
              uid: nanoid(),
              name: i.split('_')[1],
              status: 'done',
              url: i,
            }));
          }
          if (m.list) {
            m.list.forEach((l: API.Home) => {
              prodFiles[m.id + '_' + l.id] = l.images
                ? l.images.split(',').map((i) => ({
                    uid: nanoid(),
                    name: i.split('_')[1],
                    status: 'done',
                    url: i,
                  }))
                : [];
            });
          }
        });
        setPhotoFileList({ ...photoFileList });
        setProdFiles({ ...prodFiles });
        formRef.current?.setFieldsValue({ photo: [...photoList] });
      }
    } else {
      // formRef.current?.resetFields();
      setPhotoFileList({});
      setProdFiles({});
      setDelIds([]);
      // setLastPhotoIndex(undefined);
    }
  }, [open, setPhotoFileList, setProdFiles, setDelIds]);
  if (!current) return <></>;
  const handleUploadFile = async (
    options: UploadRequestOption<any>,
    index: string,
    isProd: boolean,
  ) => {
    const file = options.file as RcFile;

    if (file) {
      const result = await uploadFile({ area: 'zhuluojiHome' }, {}, file);
      if (result && result.data) {
        const nFile: UploadFile = {
          uid: file?.uid,
          name: file?.name,
          status: 'done',
          url: result.data as string,
        };
        let photos = formRef.current?.getFieldValue('photo');

        if (!isProd) {
          if (!photoFileList[index]) photoFileList[index] = [];
          photoFileList[index] = [...photoFileList[index], nFile];
          setPhotoFileList({ ...photoFileList });
          const currentIndex = photos.findIndex(
            (n: { rowKey: string | number }) => `${n.rowKey}` === `${index}`,
          );
          photos[currentIndex].images = photoFileList[index].map((n) => n.url).toString();
          formRef.current?.setFieldValue('photo', photos);
        } else {
          if (!prodFiles[index]) prodFiles[index] = [];
          prodFiles[index] = [...prodFiles[index], nFile];
          setProdFiles({ ...prodFiles });
          const fAndC = index.split('_');
          const currentIndex = photos.findIndex(
            (n: { rowKey: string | number }) => `${n.rowKey}` === fAndC[0],
          );
          const cIndex = photos[currentIndex].list.findIndex((n: { id: string; sid: string }) =>
            n.id ? `${n.id}` === fAndC[1] : n.sid === fAndC[1],
          );
          photos[currentIndex].list[cIndex].images = result.data;
          formRef.current?.setFieldValue('photo', photos);
        }
      }
    }
  };
  /**
   * @name PhotoShare 图片分享Columns
   *
   */
  const PhotoShareColumns: ProFormColumnsType<API.Home> = {
    title: '图片分享',
    valueType: 'formList',
    dataIndex: 'photo',
    colProps: { md: 24 },
    fieldProps: {
      copyIconProps: false,
      deleteIconProps: {
        className: 'delete',
        tooltipText: '删除该类型配置',
      },
      creatorRecord: { topType: '', images: '', sid: nanoid(), topId: current?.id },
      creatorButtonProps: {
        creatorButtonText: '添加新类型',
      },

      onAfterAdd: (defaultValue: any) => {
        const _id = defaultValue.sid;
        // setLastPhotoIndex(_id);
        photoFileList[_id] = [];
        setPhotoFileList({ ...photoFileList });
      },
      itemRender: ({ listDom, action }: any, { record, index }: any) => {
        const _id = record.sid || record.id;

        return (
          <Card
            size="small"
            title={index + 1 + '.' + ' ' + (record.topType || '类型')}
            extra={
              <a
                onClick={() => {
                  if (record.id) {
                    setDelIds([...delIds, record.id]);
                  }
                }}
              >
                {action}
              </a>
            }
            style={{ marginBottom: 12 }}
          >
            <div style={{ display: 'none' }}>
              <ProFormText
                initialValue={_id}
                name="rowKey"
                fieldProps={{ style: { display: 'none' } }}
              />
            </div>
            {listDom}
          </Card>
        );
      },
    },
    formItemProps: {
      rules: [{ required: true, message: '至少有一个分享' }],
      style: {
        marginBottom: 10,
      },
    },
    rowProps: { gutter: 0 },
    columns: [
      {
        dataIndex: 'topType',
        fieldProps: {
          placeholder: '图片类型名称.eg: 客厅',
        },
      },
      {
        valueType: 'dependency',
        name: ['rowKey'],
        columns: ({ rowKey }) => {
          return rowKey
            ? [
                {
                  dataIndex: 'images',
                  title: '图片',
                  colProps: { md: 24 },
                  renderFormItem: () => {
                    return (
                      <>
                        <ProFormUploadButton
                          title="上传图片"
                          listType="picture-card"
                          name="images"
                          max={5}
                          colProps={{ span: 24 }}
                          fileList={photoFileList[rowKey] || []}
                          formItemProps={{ style: { marginBottom: 0 } }}
                          fieldProps={{
                            onPreview: (file) => {
                              if (file && file?.url) {
                                setPriviewSrc(file?.url);
                                setVisible(true);
                              }
                            },
                            customRequest: (options) =>
                              handleUploadFile(options, rowKey || 0, false),
                            onRemove: async (file: UploadFile<any>) => {
                              if (file?.url && (await handleRemove(file.url))) {
                                let photos = formRef.current?.getFieldValue('photo');
                                const currentIndex = photos.findIndex(
                                  (n: { rowKey: any }) => n.rowKey === rowKey,
                                );
                                const filters = photoFileList[rowKey].filter(
                                  (n) => n.url !== file?.url,
                                );
                                photos[currentIndex].images = filters
                                  ? filters.map((m) => m.url).toString()
                                  : '';
                                formRef.current?.setFieldValue('photo', photos);
                                photoFileList[rowKey] = filters || [];
                                setPhotoFileList({ ...photoFileList });
                              }
                              return true;
                            },
                          }}
                        />
                      </>
                    );
                  },
                },
                {
                  valueType: 'formList',
                  title: '相关商品',
                  dataIndex: 'list',
                  colProps: { md: 24 },
                  fieldProps: {
                    copyIconProps: false,
                    creatorRecord: { topIndex: rowKey, sid: nanoid() },
                    creatorButtonProps: {
                      creatorButtonText: '新商品',
                      block: false,
                      position: 'top',
                      type: 'link',
                      style: { right: 0, marginTop: -30, position: 'absolute' },
                    },
                    onAfterAdd: (defaultValue: any) => {
                      const _fid = defaultValue.topId || defaultValue.topIndex;
                      console.log(_fid);
                      const recordIndex = _fid + '_' + defaultValue.sid;
                      if (!prodFiles[recordIndex]) {
                        prodFiles[recordIndex] = [];
                        setProdFiles(prodFiles);
                      }
                    },
                    itemRender: ({ listDom, action }: any, { record, index }: any) => {
                      const _fid = record.topId || record.topIndex;
                      const _id = record.id || record.sid;
                      const recordIndex = _fid + '_' + _id;
                      return (
                        <Card
                          type="inner"
                          title={record.names || '商品' + (index + 1)}
                          size="small"
                          extra={
                            <a
                              onClick={() => {
                                if (record.id) {
                                  setDelIds([...delIds, record.id]);
                                }
                              }}
                            >
                              {action}
                            </a>
                          }
                          style={{ margin: 12 }}
                        >
                          <Space>
                            <ProFormUploadButton
                              title="上传图片"
                              listType="picture-card"
                              name="images"
                              max={1}
                              colProps={{ span: 24 }}
                              fileList={prodFiles[recordIndex] || []}
                              formItemProps={{ style: { marginBottom: 0 } }}
                              fieldProps={{
                                onPreview: (file) => {
                                  if (file && file?.url) {
                                    setPriviewSrc(file?.url);
                                    setVisible(true);
                                  }
                                },
                                customRequest: (options) =>
                                  handleUploadFile(options, recordIndex, true),
                                onRemove: async (file: UploadFile<any>) => {
                                  if (file?.url && (await handleRemove(file.url))) {
                                    let photos = formRef.current?.getFieldValue('photo');
                                    const currentIndex = photos.findIndex(
                                      (n: { rowKey: any }) => n.rowKey === _fid,
                                    );
                                    photos[currentIndex].list[_id].images = '';
                                    prodFiles[recordIndex] = [];
                                    setProdFiles({ ...prodFiles });
                                  }
                                  return true;
                                },
                              }}
                            />
                            {listDom}
                          </Space>
                        </Card>
                      );
                    },
                  },
                  columns: [
                    {
                      valueType: 'group',
                      colProps: { md: 24 },
                      columns: [
                        {
                          dataIndex: 'names',
                          colProps: { span: 12 },
                          fieldProps: {
                            placeholder: '商品名称',
                          },
                        },
                        {
                          dataIndex: 'introduction',
                          colProps: { span: 24 },
                          fieldProps: {
                            placeholder: '简介',
                          },
                        },
                        {
                          dataIndex: 'brands',
                          colProps: { span: 12 },
                          width: 'md',
                          fieldProps: {
                            placeholder: '品牌名称',
                          },
                        },

                        {
                          colProps: { span: 12 },
                          width: 'md',
                          dataIndex: 'values',
                          valueType: 'money',
                          fieldProps: {
                            placeholder: '参考价',
                          },
                        },
                      ],
                    },
                  ],
                },
              ]
            : [];
        },
      },
    ],
  };
  return (
    current && (
      <>
        <SchemaForm<T>
          id={current.id}
          formRef={formRef}
          title={title}
          layoutType="DrawerForm"
          colProps={{ span: 12 }}
          columns={current ? [PhotoShareColumns as any] : []}
          open={open}
          drawerProps={{
            destroyOnClose: true,
          }}
          onFinish={async (values) => {
            // console.log(values)
            if (current) {
              if (await handleSubmit({ deleteList: delIds, home: [...values.photo] }, updateHome)) {
                onFinish(true);
                return true;
              }
            }
          }}
          {...otherConfig}
        />
        <Image
          src={priviewSrc}
          style={{ display: 'none' }}
          preview={{
            visible,
            src: priviewSrc,
            onVisibleChange: (value) => {
              setVisible(value);
            },
          }}
        />
      </>
    )
  );
};

export default CreateTeamModal;
