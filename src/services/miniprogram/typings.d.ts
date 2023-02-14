declare namespace API {
  type PageParams = {
    current?: number;
    pageSize?: number;
  };
  type ConfigInfoParams = {
    /** key */
    key?: string;
    /** value */
    value?: string;
  };

  type Banner = {
    createTime?: string;
    id?: number;
    /** 跳转地址 */
    links?: string;
    /** 轮播类型 0.首页 1.直播预告*/
    type?: string;
    /** 排序 */
    sorts?: number;
    /** 路径 */
    url?: string;
  };

  type Home = {
    // 图片分享列表
    list?: Home[];
    /** 品牌 */
    brands?: string;
    createTime?: string;
    id?: number;
    /** roomtour图片或产品图片 */
    images?: string;
    /** 简介 */
    introduction?: string;
    /** 名称 */
    names?: string;
    /** 状态: 0.未激活 1.激活 */
    status?: number;
    /** 上级id */
    topId?: number;
    /** 所属类型(填写) */
    topType?: string;
    /** 价值 */
    values?: string;
  };

  type ProdDetailParams = {
    /** productId */
    productId?: number;
    // 1直播商品 0 积分商品
    type: number;
  };

  type IdParams = {
    /** id */
    id?: number;
  };

  type ProdIdParams = {
    /** productId */
    productId?: number;
    // 1直播商品 0 积分商品
    type: number;
  };
  type TopIdParams = {
    /** topId */
    topId?: number;
  };
  type ActivityIdParams = {
    /** activityId */
    activityId?: number;
  };

  type pageHomeParams = {
    topId?: number;
    status?: number;
  } & PageParams;

  type pageActivityParams = {
    days?: number;
    sources?: string;
  } & PageParams;

  type pageActivityDetailParams = {
    // 1 买家秀
    type?: number;
    status?: number;
    activityId?: number;
  } & PageParams;

  type ManageUser = {
    createTime?: string;
    id?: number;
    /** 手机号 */
    phone?: string;
    /** 密码 */
    pwd?: string;
    /** 状态: 0.禁用 1.可用 */
    state?: number;
    updateTime?: string;
  };
  type ProductSpecs = {
    /** 颜色 */
    colors?: string;
    id?: number;
    /** 积分 */
    integral?: string;
    /** 价格 */
    price?: string;
    /** 积分商品id */
    productId?: number;
    /** 尺寸 */
    sizes?: string;
    /** 类型 0: 积分商品；1. 直播商品 */
    type?: string;
  };
  type LoginParams = {
    /** 手机号 */
    phone?: string;
    /** 密码 */
    pwd?: string;
  };

  type Order = {
    /** 购买规格/数量 */
    amount?: string;
    /** 用户id */
    appletUserId?: number;
    /** 买方用户名称 */
    nickname?: string;
    createTime?: string;
    /** 运费 */
    expressFee?: number;
    /** 运单号 */
    transferNo?: string;
    /** 快递 */
    transferDetail?: number;
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
    colors?: string;
    sizes?: string;
  };

  type OrderConvert = {
    /** 小程序用户id */
    appletUserId?: number;
    /** 消费价格 */
    costs?: number;
    /**奖励积分 */
    integral?: number;
    createTime?: string;
    id?: number;
    /** 订单图片证明 */
    images?: string;
    /** 订单号 */
    orderNo?: string;
    /** 备注 */
    remark?: string;
    /** 审核状态: 0.未通过 1.通过 */
    status?: number;
    /** 类型: 0.微信 1.淘宝 2.小红书 3.抖音 4.其他 */
    type?: number;
  };

  type IntegralProduct = {
    /** 详情图文内容 */
    details?: string;
    id?: number;
    /** 价值积分 */
    integral?: number;
    /** 规格列表 */
    list?: ProductAmount[];
    /** 简介 */
    introduction?: string;
    /** 商品图片 */
    productImage?: string;
    /** 商品名称 */
    productName?: string;
    /** 商品类型: 0.餐具摆件 1.睡衣浴袍 2.床品家纺 3.生活日用 */
    productType?: number | string;
    /** 限购数量 */
    purchaseLimit?: number;
    /** 规格 */
    amount?: string;
    /** 数量 */
    totals?: string;
    /** 推荐: 0.不是 1.是 */
    recommend?: number;
    /** 0.下架 1.上架 */
    shopping?: number | string;
    /** 红星数 */
    starter?: number;
    /** 状态: 0.正常 1.删除 */
    state?: number;
    /** 标签类型: 0.新品 1.人气 */
    tagType?: number | string;
    updateTime?: string;
    createTime?: string;
  };

  type ProductAmount = {
    /** 颜色 */
    colors?: string;
    id?: number;
    /** 积分 */
    integral?: string;
    /** 价格 */
    price?: string;
    /** 积分商品id */
    productId?: number;
    /** 尺寸 */
    sizes?: string;
  };
  type ActivityProduct = {
    createTime?: string;
    /** 说明,详情 */
    details?: string;
    id?: number;
    /** 商品图片 */
    images?: string;
    /** 商品名称 */
    productName?: string;
    /** 类型: 0.商品 1.赠品 */
    type?: number;
    /** 规格列表*/
    list?: ProductSpecs[];
    /** 商品类型: 0.餐具摆件 1.睡衣浴袍 2.床品家纺 3.生活日用 */
    topType?: number | string;
    // 直播价格
    lastPrice?: number;
    // 直播时间段
    stamps?: string;
  };
  type Activity = {
    createTime?: string;
    /** 活动日期 */
    days?: string;
    id?: number;
    /** 来源: 0.家纺直播 1.家具直播 */
    sources?: number;
    /** 商品列表*/
    list?: (ActivityProduct & ActivityDetail)[];
    /** 状态: 0.关闭 1.开启 */
    status?: number;
    /** 类型: 0.直播预告  */
    type?: number;
  };
  type ActivityDetail = {
    /** 活动赠品id */
    activityGiftId?: number;
    /** 活动id */
    activityId?: number;
    /** 活动商品id */
    activityProductId?: number;
    productName?: string;
    createTime?: string;
    id?: number;
    /** 其他说明 */
    otherMsg?: string;
  };
  type LivePreview = {
    createTime?: string;
    /**说明+简介 */
    detail?: string;
    /** 日期: 格式.2022-12-29 */
    dates?: string;
    /**  */
    endTime?: string;
    /** 主持人 */
    hoster?: string;
    id?: number;
    /** 图片 */
    images?: string;
    /** 链接 */
    links?: string;
    /** 主打商品 */
    products?: string;
    /** 开始时间-结束时间 */
    stamps?: string;
    /** 预约数 */
    stater?: number;
    /** 状态: 0.不展示 1.展示 */
    status?: number;
    /** 类型: 0.汀戴家具 1.酷酷的侏罗纪 */
    type?: number;
  };

  type ListSignInParams = {
    /** 时间字符串(yyyy-MM-dd) */
    date: string;
  };

  type ListConfigInfoParams = {
    /** key */
    key?: string;
  };

  type pageLiveParams = {
    /** 小程序用户id */
    appletUserId?: number;
    /** 通知类型: 0.站内 1.系统 2.直播预告 3.活动消息 4.订单物流 5.等级 6.积分 */
    type?: number;
  } & PageParams;

  type pageConvertParams = {
    /** 小程序用户id */
    appletUserId?: number;
    /** 审核状态: 0.未通过 1.通过 */
    status?: number;
    /** 类型: 0.微信 1.淘宝 2.小红书 3.抖音 4.其他 */
    type?: number;
  } & PageParams;

  type NotifyParams = {
    /** 小程序用户id */
    appletUserId?: number;
    /** 通知类型: 0.站内 1.系统 2.直播预告 3.活动消息 4.订单物流 5.等级 6.积分 */
    interface?: number;
  } & PageParams;

  type pageActProdParams = {
    productName?: string;
    /**0 直播商品 */
    type?: number;
  } & PageParams;

  type PageUserInfoParams = {
    /** 等级 */
    level?: number;
    /** 手机号 */
    phone?: string;
    /** 状态: 0.禁用 1.可用 */
    state?: number;
  } & PageParams;

  type PageProdParams = {
    name?: string;
  } & PageParams;

  type PageLoginLogParams = {
    /** 结束时间 */
    endTime?: string;
    /** 开始时间 */
    startTime?: string;
    /** 类型: 0.小程序 1.系统后台 */
    interface?: number;
  } & PageParams;

  type pageOrderParams = {
    appletUserId?: number;
  } & PageParams;

  type PageAfterSalesParams = {
    /** 小程序用户id */
    appletUserId?: number;
    /** 订单id */
    ordersId?: number;
    /** 售后状态: 0.售后申请 1.处理中 2.完成 */
    status?: number;
  } & PageParams;

  type ConfigInfo = {
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
  };

  type ProductStater = {
    /** 小程序用户id */
    appletUserId?: number;
    /** 创建时间 */
    createTime?: string;
    id?: number;
    /**  商品id */
    productId?: number;
    /** 收藏: -1.未收藏 1.收藏 */
    status?: number;
  };

  type AfterSales = {
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
    /** 处理备注*/
    remark?: string;
  };

  type AppletDeliveryAddress = {
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
  };

  type UserParams = {
    phone?: string;
  } & PageParams;

  type CommonResult = {
    /** 响应码: 200.成功 500.错误 1000以上.失败 */
    code?: number;
    /** 返回数据 */
    data?: Record<string, any>;
    /** 响应消息 */
    msg?: string;
  };
  type ListResult = {
    /** 响应码: 200.成功 500.错误 1000以上.失败 */
    code?: number;
    /** 返回数据 */
    data?: T[];
    /** 响应消息 */
    msg?: string;
  };
  type fileUploadResult = {
    /** 响应码: 200.成功 500.错误 1000以上.失败 */
    code?: number;
    /** 返回数据 */
    data?: string;
    /** 响应消息 */
    msg?: string;
  };
  type UpDownProductsParams = {
    /** id集合 */
    ids?: number[];
    /** 0.下架 1.上架 */
    shopping?: number;
  };

  type AppletNotify = {
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
  };

  type uploadModel = {
    /** 传项目名称 */
    area: string;
  };

  type WeChatLogin = {
    /** 微信登录凭证[code] */
    code?: string;
    /** 微信用户信息 */
    userInfo?: WeChatUserInfo;
  };

  type WeChatUserInfo = {
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
  };

  type AppletUser = {
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
  };
}
