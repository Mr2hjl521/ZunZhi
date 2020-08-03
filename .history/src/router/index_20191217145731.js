import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [{
            path: '/',
            redirect: '/index.vue'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children: [
                //首页
                {
                    path: '/index',
                    component: resolve => require(['../components/page/index.vue'], resolve),
                    meta: { title: '首页' }
                },
                //首页进入 给服务人员派单的页面
                {
                    path: '/distributeLeaflets',
                    component: resolve => require(['../components/page/distributeLeaflets.vue'], resolve),
                    meta: { title: '给服务人员派单' }
                },
                //用户管理
                {
                    path: '/userManage',
                    component: resolve => require(['../components/page/userManage.vue'], resolve),
                    meta: { title: '用户管理' }
                },
                //服务人员
                {
                    path: '/personManage',
                    component: resolve => require(['../components/page/personManage.vue'], resolve),
                    meta: { title: '服务人员' }
                },
                //贴膜服务人员
                {
                    path: '/thingsup',
                    component: resolve => require(['../components/page/thingsup.vue'], resolve),
                    meta: { title: '贴膜服务人员' }
                },
                //代取件服务人员
                {
                    path: '/pickingpiece',
                    component: resolve => require(['../components/page/pickingpiece.vue'], resolve),
                    meta: { title: '代取件服务人员' }
                },
                //快递点服务人员
                {
                    path: '/ccPickingpiece',
                    component: resolve => require(['../components/page/ccPickingpiece.vue'], resolve),
                    meta: { title: '快递点服务人员' }
                },
                //财务管理
                {
                    path: '/finance',
                    component: resolve => require(['../components/page/finance.vue'], resolve),
                    meta: { title: '财务管理' }
                },
                //入账信息
                {
                    path: '/carryto',
                    component: resolve => require(['../components/page/carryto.vue'], resolve),
                    meta: { title: '入账信息' }
                },
                //佣金出账
                {
                    path: '/itemof',
                    component: resolve => require(['../components/page/itemof.vue'], resolve),
                    meta: { title: '佣金出账' }
                },
                //审核管理
                {
                    path: '/auditManage',
                    component: resolve => require(['../components/page/auditManage.vue'], resolve),
                    meta: { title: '审核管理' }
                },
                //人员审核
                {
                    path: '/personnelAudit',
                    component: resolve => require(['../components/page/personnelAudit.vue'], resolve),
                    meta: { title: '人员审核' }
                },
                //库存审核申请
                {
                    path: '/stockAudit',
                    component: resolve => require(['../components/page/stockAudit.vue'], resolve),
                    meta: { title: '库存申请审核' }
                },
                //学校管理
                {
                    path: '/schoolManage',
                    component: resolve => require(['../components/page/schoolManage.vue'], resolve),
                    meta: { title: '学校管理' }
                },
                //数据分析
                {
                    path: '/dataManage',
                    component: resolve => require(['../components/page/dataManage.vue'], resolve),
                    meta: { title: '数据分析' }
                },
                //营销管理
                {
                    path: '/marketingManage',
                    component: resolve => require(['../components/page/marketingManage.vue'], resolve),
                    meta: { title: '营销管理' }
                },
                //快递网点
                {
                    path: '/expressageManage',
                    component: resolve => require(['../components/page/expressageManage.vue'], resolve),
                    meta: { title: '快递网点' }
                },
                //产品管理(简单的查询操作已经上架的商品)
                {
                    path: '/productManage',
                    component: resolve => require(['../components/page/productManage.vue'], resolve),
                    meta: { title: '产品管理' }
                },
                //产品管理-->(上传新产品)
                {
                    path: '/uploadProduct',
                    component: resolve => require(['../components/page/uploadProduct.vue'], resolve),
                    meta: { title: '上传产品' }
                },
                 //产品管理-->(编辑产品)
                {
                    path: '/editProduct',
                    component: resolve => require(['../components/page/editProduct.vue'], resolve),
                    meta: { title: '编辑产品' }
                },
                //订单管理
                {
                    path: '/orderManage',
                    component: resolve => require(['../components/page/orderManage.vue'], resolve),
                    meta: { title: '订单管理' }
                },
                //手机贴膜订单
                {
                    path: '/pasting',
                    component: resolve => require(['../components/page/pasting.vue'], resolve),
                    meta: { title: '手机贴膜订单' }
                },
                 //手机贴膜订单--> 里面可以进入 异常订单页面
                {
                    path: '/abnormal',
                    component: resolve => require(['../components/page/abnormal.vue'], resolve),
                    meta: { title: '手机贴膜异常订单' }
                },
                //代取件订单
                {
                    path: '/pickup',
                    component: resolve => require(['../components/page/pickup.vue'], resolve),
                    meta: { title: '代取件订单' }
                },
                //系统设置
                {
                    path: '/setting',
                    component: resolve => require(['../components/page/setting.vue'], resolve),
                    meta: { title: '系统设置' }
                },
                {
                    path: '/404',
                    component: resolve => require(['../components/page/404.vue'], resolve),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: resolve => require(['../components/page/403.vue'], resolve),
                    meta: { title: '403' }
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})