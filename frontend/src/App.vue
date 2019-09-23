<template>
  <div id="app">
	<Header v-if="user" />
	<Loading v-if="validatingToken" />
    <Content v-else/>
  </div>
</template>

<script>
import axios from "axios"
import { baseApiUrl, userKey } from "@/global"
import { mapState } from "vuex"

import Content from './components/template/Content'
import Loading from './components/template/Loading'
import Header from './components/template/Header'

export default {
  name: 'app',
  components: {
	Header,
	Content,
	Loading

  },
  computed: mapState(['user']),
	data: function() {
		return {
			validatingToken: true
		}
	},
	methods: {
		async validateToken() {
			this.validatingToken = true

			const json = localStorage.getItem(userKey)
			const userData = JSON.parse(json)
			//this.$store.commit('setUser', null)

			if(!userData) {
				this.validatingToken = false
				this.$router.push({ name: 'auth' })
				return
			}

			const res = await axios.post(`${baseApiUrl}/validateToken`, userData)

			if (res.data) {
				this.$store.commit('setUser', userData)
				
				// if(this.$mq === 'xs' || this.$mq === 'sm') {
				// 		this.$store.commit('toggleMenu', false)
				// }
			} else {
				localStorage.removeItem(userKey)
				this.$router.push({ name: 'auth' })
			}

			this.validatingToken = false
		}
	},
	created() {
		this.validateToken()
	}
}
</script>

<style>
body{
	margin: 0;
}

#app {
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;

	height: 100vh;
    background-color: #efefef;
  
	text-align: center;
	color: #2c3e50;
}
</style>
