<template>
  <v-app light>
    
    <!--Hamburger Menu slider, temporary in order to not load it when the page load itself-->
    <v-navigation-drawer v-model="isHamburgerOpen" temporary>
      <v-list dense>
        <v-list-tile v-for="leftButton in leftButtonList" :key="leftButton.name" :to="leftButton.link">
          <v-list-tile-action>
            <v-icon>{{ leftButton.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>{{ leftButton.name }}</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <!--Title bar-->
    <v-toolbar class="primary" dark>
      
      <!--This is the hamburger button-->
      <v-toolbar-side-icon class="hidden-md-and-up" @click.stop="isHamburgerOpen = !isHamburgerOpen"/>

      <!--This is the title-->
      <v-toolbar-title><router-link to="/" tag="span" style="cursor: pointer;"><v-icon dark class="mr-3">build</v-icon>BuildaBuilder</router-link></v-toolbar-title>

      <!--This take all the space, content after this spacer will be all to the right-->
      <v-spacer/>

      <!--Navigation buttons-->
      <v-toolbar-items class="hidden-sm-and-down ">
        <v-btn flat v-for="leftButton in titleBarLeftButton" :key="leftButton.name" :to="leftButton.link">
          <v-icon left dark>{{ leftButton.icon }}</v-icon>
          {{ leftButton.name }}
        </v-btn>
      </v-toolbar-items>

    </v-toolbar>

    <main>
      <router-view></router-view>
    </main>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      isHamburgerOpen: false,
      leftButtonList: [
        {name: 'Home', icon: 'home', link: '/', showOnlyInHamburger: true},
        {name: 'Info', icon: 'info', link: '/info', showOnlyInHamburger: false},
        {name: 'Settings', icon: 'settings', link: '/settings', showOnlyInHamburger: false}
      ]
    }
  },
  computed: {
    titleBarLeftButton () {
      return this.leftButtonList.filter(leftButton => {
        return leftButton.showOnlyInHamburger === false
      })
    }
  }
}
</script>

<style lang="stylus">
  @import './stylus/main'
</style>
