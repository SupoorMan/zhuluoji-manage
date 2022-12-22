declare namespace API {
  interface PageParams {
    current?: number;
    pageSize?: number;
  }
  interface ConfigInfoParams {
    /** key */
    key?: string;
    /** value */
    value?: string;
  }

  interface ProdDetailParams {
    /** productId */
    productId?: number;
  }

  interface SalesParams {
    /** id */
    id?: number;
  }

  type Order = {
    /** 购买规格/数量 */
    amount?: string;
    /** 用户id */
    appletUserId?: number;
    createTime?: string;
    /** 运费 */
    expressFee?: number;
    /** 完成时间 */
    finishTime?: string;
    id?: number;
    /** 价值积分 */
    integral?: number;
    /** 订单号 */
    orderNo?: string;
    /** 支付时间 */
    payTime?: string;
    /** 商品id */
    productId?: number;
    /** 收货地址详情 */
    receiveAddress?: string;
    /** 状态: 0.正常 1.用户删除 2.系统删除 */
    state?: number;
    /** 订单状态: -1.取消 0.下单未支付 1.下单支付完成 2.发货中 3.签收完成 */
    status?: number;
    updateTime?: string;
  };

  type IntegralProduct = {
    /** 详情图文内容 */
    details?: string;
    id?: number;
    /** 价值积分 */
    integral?: number;
    /** 简介 */
    introduction?: string;
    /** 商品图片 */
    productImage?: string;
    /** 商品名称 */
    productName?: string;
    /** 商品类型: 0.玻璃餐具 1.睡衣浴袍 2.床上用品 3.家具装点 */
    productinterface?: number;
    /** 限购数量 */
    purchaseLimit?: number;
    /** 推荐: 0.不是 1.是 */
    recommend?: number;
    /** 0.下架 1.上架 */
    shopping?: number;
    /** 红星数 */
    starter?: number;
    /** 状态: 0.正常 1.删除 */
    state?: number;
    /** 标签类型: 0.新品 1.人气 */
    taginterface?: number;
    updateTime?: string;
    createTime?: string;
  };

  interface ListSignInParams {
    /** 时间字符串(yyyy-MM-dd) */
    date: string;
  }

  interface ListConfigInfoParams {
    /** key */
    key?: string;
  }

  interface NotifyParams extends PageParams {
    /** 小程序用户id */
    appletUserId?: number;
    /** 通知类型: 0.站内 1.系统 2.直播预告 3.活动消息 4.订单物流 5.等级 6.积分 */
    interface?: number;
  }

  interface PageUserInfoParams extends PageParams {
    /** 等级 */
    level?: number;
    /** 手机号 */
    phone?: string;
    /** 状态: 0.禁用 1.可用 */
    state?: number;
  }

  interface PageProdParams extends PageParams {
    name?: string;
  }

  interface PageLoginLogParams extends PageParams {
    /** 结束时间 */
    endTime?: string;
    /** 开始时间 */
    startTime?: string;
    /** 类型: 0.小程序 1.系统后台 */
    interface?: number;
  }

  interface pageOrderParams extends PageParams {
    appletUserId?: number;
  }

  interface PageAfterSalesParams extends PageParams {
    /** 小程序用户id */
    appletUserId?: number;
    /** 订单id */
    ordersId?: number;
    /** 售后状态: 0.售后申请 1.处理中 2.完成 */
    status?: number;
  }

  interface ConfigInfo {
    /** context */
    context?: string;
    createTime?: string;
    /** details */
    details?: string;
    id?: number;
    /** key */
    key?: string;
    /** 状态: 0.关闭 1.开启 */
    state?: number;
    updateTime?: string;
    /** value */
    value?: string;
  }

  interface ProductStater {
    /** 小程序用户id */
    appletUserId?: number;
    /** 创建时间 */
    createTime?: string;
    id?: number;
    /**  商品id */
    productId?: number;
    /** 收藏: -1.未收藏 1.收藏 */
    status?: number;
  }

  interface AfterSales {
    /** 小程序用户id */
    appletUserId?: number;
    createTime?: string;
    id?: number;
    /** 申请图片 */
    images?: string;
    /** 申请信息 */
    message?: string;
    /** 订单id */
    ordersId?: number;
    /** 售后状态: 0.售后申请 1.处理中 2.完成 */
    status?: number;
    updateTime?: string;
  }

  interface AppletDeliveryAddress {
    /** 详细地址 */
    address?: string;
    /** 小程序用户id */
    appletUserId?: number;
    /** 区 */
    area?: string;
    /** 市 */
    city?: string;
    createTime?: string;
    /** 默认地址: 0.否 1.是 */
    defaults?: number;
    id?: number;
    /** 手机号 */
    phone?: string;
    /** 省 */
    province?: string;
    /** 收件人 */
    receiver?: string;
    updateTime?: string;
  }

  interface CommonResult {
    /** 响应码: 200.成功 500.错误 1000以上.失败 */
    code?: number;
    /** 返回数据 */
    data?: Record<string, any>;
    /** 响应消息 */
    msg?: string;
  }

  interface AppletNotify {
    /** 小程序用户id */
    appletUserId?: number;
    createTime?: string;
    id?: number;
    /** 通知消息/模板 */
    message?: string;
    /** 状态: 0.关闭 1.开启 */
    state?: number;
    /** 通知类型: 0.站内 1.系统 2.直播预告 3.活动消息 4.订单物流 5.等级 6.积分 */
    interface?: number;
    updateTime?: string;
  }

  type uploadModel = {
    /** 传项目名称 */
    area: string;
  };

  interface WeChatLogin {
    /** 微信登录凭证[code] */
    code?: string;
    /** 微信用户信息 */
    userInfo?: WeChatUserInfo;
  }

  interface WeChatUserInfo {
    /** 头像url */
    avatarUrl?: string;
    /** 城市 */
    city?: string;
    /** 区县 */
    country?: string;
    /** 性别 */
    gender?: number;
    /** 语言 */
    language?: string;
    /** 昵名 */
    nickName?: string;
    /** 省 */
    province?: string;
  }

  interface AppletUser {
    /** 所在地区 */
    address?: string;
    /** 头像 */
    avatarUrl?: string;
    /** 生日 */
    birthday?: string;
    /** 创建时间 */
    createTime?: string;
    /** DY账号 */
    dyId?: string;
    /** 经验 */
    experience?: number;
    /** 0.女 1.男 */
    gender?: number;
    /** 成长值 */
    growth?: number;
    id?: number;
    /** 积分 */
    integral?: number;
    /** 等级 */
    level?: number;
    /** 昵名 */
    nickname?: string;
    /** openid */
    openid?: string;
    /** 手机号 */
    phone?: string;
    /** 小红书账号 */
    redbookId?: string;
    sessionKey?: string;
    /** 状态: 0.禁用 1.可用 */
    state?: number;
    /** TB账号 */
    tbId?: string;
    /** uid */
    uid?: string;
    /** 更新时间 */
    updateTime?: string;
  }
}
