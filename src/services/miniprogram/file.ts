// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 文件删除 文件删除 POST /file/delete */
export async function deleteFile(
  body: {
    /** file */
    file: string[];
  },
  options?: { [key: string]: any },
) {
  const formData = new FormData();

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele];

    if (item !== undefined && item !== null) {
      formData.append(
        ele,
        typeof item === 'object' && !(item instanceof File) ? JSON.stringify(item) : item,
      );
    }
  });

  return request<API.CommonResult>('/file/delete', {
    method: 'POST',
    data: formData,
    requestType: 'form',
    ...(options || {}),
  });
}

/** 文件上传 文件上传 传项目名称 POST /file/upload */
export async function uploadFile(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.uploadModel,
  body: {},
  file?: File,
  onProgress?: (percent: number) => void,
  options?: { [key: string]: any },
) {
  const formData = new FormData();

  if (file) {
    formData.append('file', file);
  }

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele];

    if (item !== undefined && item !== null) {
      formData.append(
        ele,
        typeof item === 'object' && !(item instanceof File) ? JSON.stringify(item) : item,
      );
    }
  });

  return request<API.fileUploadResult>('/file/upload', {
    method: 'POST',
    params: {
      ...params,
    },
    data: formData,
    onUploadProgress: function (progress: ProgressEvent) {
      // console.log(progress);
      const { loaded, total } = progress;
      onProgress && onProgress(Math.round((loaded / total) * 100));
    },
    requestType: 'form',
    ...(options || {}),
  });
}
