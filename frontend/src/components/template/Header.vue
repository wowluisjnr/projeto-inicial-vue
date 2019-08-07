<template>
    <div>
      <b-navbar fixed toggleable="lg" type="dark" variant="info">
        <b-navbar-brand href="/viveiros">
          <!-- <img src="../../assets/logo32px.png" class="d-inline-block align-top" alt="Kitten"> -->
          TradeSysten 
        </b-navbar-brand>
        
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item href="/">Catalogação</b-nav-item>
            <b-nav-item href="/">Gerenciamento</b-nav-item>
          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <!-- <b-nav-form>
              <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
              <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
            </b-nav-form> -->

            <!-- <b-nav-item-dropdown text="Lang" right>
              <b-dropdown-item href="#">EN</b-dropdown-item>
              <b-dropdown-item href="#">ES</b-dropdown-item>
              <b-dropdown-item href="#">RU</b-dropdown-item>
              <b-dropdown-item href="#">FA</b-dropdown-item>
            </b-nav-item-dropdown> -->

            <b-nav-item-dropdown right>
              <template slot="button-content"><em>{{user.name}}</em></template>
              <b-dropdown-item v-if="user.admin" href="/adm">Configurações</b-dropdown-item>
              <b-dropdown-item @click="logout">Sair</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
</template>

<script>
import { userKey } from '@/global'
import {mapState} from 'vuex'

export default {
    name: 'Header',
    computed: mapState(['user']),
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
