// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 我的通知分页查询 GET /appletNotify/page */
export async function getNotify(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.NotifyParams,
  options?: { [key: string]: any },
) {
  return request<API.CommonResult>('/appletNotify/page', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 发送系统消息 0站内|1系统|2直播预告|3活动消息等消息发送 & 4订单物流|5等级|6积分等消息 POST /appletNotify/sendNotify */
export async function sendNotify(body: API.AppletNotify, options?: { [key: string]: any }) {
  return request<API.CommonResult>('/appletNotify/sendNotify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
