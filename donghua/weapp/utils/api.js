import http from './configs/apiConfig.js';
// 获取session
export const getSessionId = params => http.get('account/sessionId', params);
// 用户登录
export const wxLogin = params => http.post('account/signInByWeApp', params);
// 获取用户信息 
export const getPeople = params => http.get('people/findById', params);
// 获取系统信息：GET app/findById
export const auth = params => http.post('publicWxLogin4',params)
export const user_info = params => http.get('user_info',params)
export const getAppMsg = params => http.get('app/findById', params);
export const add_forum = params => http.post('add_forum', params)
export const get_shop = params => http.get('get_shop',params)
export const click = params => http.get('click', params)
export const get_comment = params => http.get('get_comment', params)
export const reply = params => http.post('reply', params)
export const show_number = params =>http.get('show_number',params)
export const normal_card = params => http.post('normal_card',params)
export const money_card = params => http.post('money_card',params)
export const my_state = params => http.get('my_state',params)
export const get_click = params =>http.get('get_click',params)
export const show_forum_info = params => http.get('get_forum_info',params)
export const goods_list = params => http.get('goods_list',params)
 
export const search_goods = params => http.get('search_goods',params) // 搜索
 
export const search_tea_goods = params => http.get('search_tea_goods',params)
export const show_cash = params => http.get('show_cash',params)
export const get_default = params => http.get('get_default',params)
export const get_address = params => http.get('get_address',params)
export const add_address = params => http.post('add_address',params)
export const del_address = params => http.get('del_address',params)
export const update_address = params =>http.post('update_address',params)
export const default_address = params => http.get('default_address',params)
export const receive = params =>http.get('receive',params)
export const finish = params => http.get('finish',params)
export const refund_order = params => http.get('refund_order',params)
export const wait = params =>http.get('wait',params)
export const goods_info = params =>http.get('goods_info',params)
export const order = params => http.post('order',params)
export const pay = params =>http.post('pay',params)
export const confirm_receive = params => http.get('confirm_receive',params)
export const test = params =>http.post('test',params)
export const wait_pay = params =>http.get('wait_pay',params)
export const show_no_group=params =>http.get('show_no_group',params)
export const usable_cash = params =>http.get('usable_cash',params)
export const disable_cash = params =>http.get('disable_cash',params)
export const shop_info = params => http.get('shop_info',params)
export const my_collect_goods = params => http.get('my_collect_goods',params)
export const my_collect_shop = params =>http.get('my_collect_shop',params)
export const my_group = params => http.get('my_group',params)
export const show_commend = params => http.get('show_commend',params)
export const show_cut = params => http.get('show_cut',params)
export const cut = params => http.post('cut', params)
export const sel_cate = params => http.get('sel_cate',params)
export const show_cate_goods = params => http.get('show_cate_goods',params)
export const read_state = params => http.get('read_state',params)
export const refund = params => http.post('refund',params)
export const cancel_refund = params => http.get('cancel_refund',params)
export const cancel = params => http.get('cancel',params)
export const change_photo = params => http.post('change_photo',params)
export const my_cash = params =>http.get('my_cash',params)
export const show_hot = params =>http.get('show_hot',params)
export const get_shipping = params => http.get('get_shipping', params)
export const self_cut = params => http.post('self_cut', params)
export const help_people = params => http.get('help_people', params)
export const help_cut = params => http.post('help_cut', params)
export const add_shopcart = params => http.post('add_shopcart', params)
export const show_shopcart = params => http.get('show_shopcart', params)
export const del_shopcart = params => http.post('del_shopcart', params)
export const new_order = params => http.post('new_order', params)
export const show_one_cut = params => http.get('show_one_cut',params)
export const get_goods = params => http.get('get_goods',params)
export const search_order = params => http.get('search_order',params)
export const cut_order = params => http.post('cut_order',params)
export const get_cash = params => http.get('get_cash',params)
export const create_qrcode = params => http.get('create_qrcode',params)
export const tea_goods_show = params => http.get('tea_goods_show',params)

export const service_order = params => http.post('service_order',params)



export const order_pay = params => http.post('order_pay',params)

export const wait_experience = params => http.get('wait_experience',params)
export const already_experience = params => http.get('already_experience', params)

export const some_one_order = params => http.get('some_one_order', params)
export const print_pro = params => http.get('print_pro', params)

export const get_exp_version = params => http.get('get_exp_version', params)

export const wx_group_info = params => http.get('wx_group_info', params) //拼团
export const get_applyDistributio = params => http.post('get_applyDistributio',params)//分销申请
export const send_code = params => http.get('send_code',params)//短信验证
export const get_distributioToal = params => http.post('get_distributioToal', params)//分销
export const get_income = params => http.post('get_income', params)
export const shop_color = params => http.get('shop_color', params)
export const getQRcode = params => http.get('getQRcode', params)
export const cashDetail = params => http.get('cashDetail', params)
export const cash = params => http.post('cash', params)
export const get_goods_pro = params => http.get('get_goods_pro', params)
export const sel_cate_pro = params => http.get('sel_cate_pro', params)
export const get_config = params => http.get('get_config', params)
