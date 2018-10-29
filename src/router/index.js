import Vue from 'vue'
import Router from 'vue-router'
import Lines from '@/components/line/line'
import List from '@/page/visualize/list/list'
import DashboardList from '@/page/dashboard/list/list'
import Detail from '@/page/visualize/detail/detail'
import EditLine from '@/page/visualize/edit/edit'
import EditBar from '@/page/visualize/edit/bar'
import EditPie from '@/page/visualize/edit/pie'
import DashboardEdit from '@/page/dashboard/edit/edit'
import Login from '@/page/login/login'
import User from '@/page/sys/user/user'
import Role from '@/page/sys/role/role'
import Model from '@/page/sys/model/model'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },{
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/user',
      name: 'User',
      component: User
    },
    {
      path: '/role',
      name: 'Role',
      component: Role
    },
    {
      path: '/model',
      name: 'Model',
      component: Model
    },
    {
	  path: '/detail',
	  name: 'Detail',
	  component: Detail
	},
	{
	  path: '/editline',
	  name: 'EditLine',
	  component: EditLine
	},
	{
	  path: '/editbar',
	  name: 'EditBar',
	  component: EditBar
	},
	{
	  path: '/editpie',
	  name: 'EditPie',
	  component: EditPie
	},
	{
	  path: '/dashboardList',
	  name: 'DashboardList',
	  component: DashboardList
	},
	{
	  path: '/dashboardEdit',
	  name: 'DashboardEdit',
	  component: DashboardEdit
	},
	{
	  path: '/visualizeList',
	  name: 'List',
	  component: List
	}
  ]
})
