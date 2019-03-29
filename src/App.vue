<template>
  <div id="app">
    <div id="nav">
      <router-link to="/notepad">Notepad</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
  #nav {
    padding: 30px;
    a {
      font-weight: bold;
      color: #2c3e50;
      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }
  // Import a Google Font
  @import url('https://fonts.googleapis.com/css?family=Nunito:400,700');

  // Set your brand colors
  $purple: #8A4D76;
  $pink: #FA7C91;
  $brown: #757763;
  $beige-light: #D0D1CD;
  $beige-lighter: #EFF0EB;

  // Update Bulma's global variables
  $family-sans-serif: "Nunito", sans-serif;
  $grey-dark: $brown;
  $grey-light: $beige-light;
  $primary: $purple;
  $link: $pink;

  // Update some of Bulma's component variables
  $control-border-width: 2px;
  $input-background-color: $beige-lighter;
  $input-border-color: transparent;
  $input-shadow: none;

  // Import the rest of Bulma
  @import "../node_modules/bulma/css/bulma.css";
  @import "../node_modules/vuetify/dist/vuetify.min.css"; // Ensure you are using css-loader
  @import "../node_modules/vuetify/dist/vuetify.min.css";
</style>
