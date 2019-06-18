import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios' //

import HelloWorld from '@/components/HelloWorld'
import NotHelloWorld from '@/components/NotHelloWorld'
import Auth from '@/components/auth/Auth'

import { userKey, baseApiUrl } from '@/global'

Vue.use(VueRouter)

const routes = [{
    name: 'NotHelloWorld',
    path: '/',
    component: NotHelloWorld,
}, {
    name: 'HelloWord',
    path: '/adm',
    component: HelloWorld,
    meta: { requiresAdmin: true }
}, {
    name: 'auth',
    path: '/auth',
    component: Auth
}]

const router = new VueRouter({
    mode: 'history',
    routes
})

router.beforeEach(async (to, from, next) => {
    const user = JSON.parse(localStorage.getItem(userKey))
    const res = await axios.post(`${baseApiUrl}/validateAdmin`, user) // tenho que setar localStorage com user admin
    if(user){
        user.admin = res.data
        localStorage.setItem(userKey, JSON.stringify(user))
    }

    if(to.matched.some(record => record.meta.requiresAdmin)) {        
        user && res.data ? next() : next({ path: '/' })
    } else if(user && to.path =='/auth'){
        next({path: '/'})
    } else {
        next()
    }
})

export default router
