<template>
    <div>
        <h1>Voce não precisa ser administrador</h1>
        <button @click.prevent="logout">sair</button>
    </div>
</template>

<script>
import { userKey } from '@/global'

export default {
    name: 'NotHelloWorld',
    methods:{
    logout(){
      localStorage.removeItem(userKey)
      this.$store.commit('setUser', null)
      this.$router.push({ path: '/auth' })
    }
  }

}
</script>

<style>

</style>
