<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
            text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item v-for="(threeItem,i) in subItem.subs" :key="i" :index="threeItem.index">
                                    {{ threeItem.title }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.index" :key="subItem.index">
                                {{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../common/bus';
    export default {
        data() {
            return {
                collapse: false,
                items: [
                    {
					    icon: 'el-icon-lx-cascades',
					    index: 'index',
					    title: '首页'
					},
					{
					    icon: 'el-icon-lx-cascades',
					    index: 'peopleManage',
					    title: '人员管理',
                        subs: [
                            {
                                
                                index: 'userManage',
                                title: '用户管理'
                            },
                            {
                                index: 'personManage',
                                title: '服务人员管理',
                                subs:[
                                    {
                                        index: 'thingsup',
                                        title: '贴膜服务人员'
                                    },
                                    {
                                        index: 'pickingpiece',
                                        title: '代取件服务人员'
                                    },
                                    {
                                        index: 'ccPickingpiece',
                                        title: '快递点服务人员'
                                    },
                                ]
                            }
                        ]
                    },
                    {
					    icon: 'el-icon-lx-cascades',
					    index: 'schoolManage',
					    title: '学校管理'
                    },
                    {
					    icon: 'el-icon-lx-cascades',
					    index: 'build',
					    title: '楼号管理'
                    },
                    {
					    icon: 'el-icon-lx-cascades',
					    index: 'expressageManage',
					    title: '快递网点'
					},
					{
					    icon: 'el-icon-lx-cascades',
					    index: 'orderManage',
                        title: '订单管理',
                        subs: [
                            {
                                index: 'pasting',
                                title: '手机贴膜订单'
                            },
                            {
                                index: 'pickup',
                                title: '代取件订单'
                            }
                        ]
                        
                    },
                     {
					    icon: 'el-icon-lx-cascades',
					    index: 'repertoryManage',
					    title: '库存管理'
                    },
                      {
					    icon: 'el-icon-lx-cascades',
					    index: 'phoneModule',
					    title: '手机型号管理'
                    },
                     {
					    icon: 'el-icon-lx-cascades',
					    index: 'productManage',
					    title: '产品管理'
                    },
                     {
					    icon: 'el-icon-lx-cascades',
					    index: 'dataManage',
					    title: '数据统计分析'
                    },
                     {
					    icon: 'el-icon-lx-cascades',
					    index: 'marketingManage',
					    title: '营销中心'
                    },
                     {
					    icon: 'el-icon-lx-cascades',
					    index: 'finance',
                        title: '财务管理',
                        subs: [
                            {
                                index: 'carryto',
                                title: '入账信息'
                            },
                            {
                                index: 'itemof',
                                title: '佣金出账'
                            }
                        ]
                    },
                     {
					    icon: 'el-icon-lx-cascades',
                        index: 'auditManage',
                        title: '审核管理',
                        subs: [
                            {
                                index: 'personnelAudit',
                                title: '人员审核'
                            },
                            {
                                index: 'stockAudit',
                                title: '库存申请审核'
                            }
                        ]
                    },
                     {
					    icon: 'el-icon-lx-cascades',
					    index: 'setting',
					    title: '系统设置'
                    },
                ]
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        },
        created(){
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom:0;
        overflow-y: scroll;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 250px;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
