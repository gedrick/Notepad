<template>
  <div class="notepad">
    <v-btn class="add-btn" v-on:click="addNote()"><i class="fas fa-plus"></i></v-btn>
      <v-collapse-group :onlyOneActive="false" class="notes">
        <v-collapse-wrapper v-for="(item, index) in items" :key="item.id">
          <div :class="'note color' + item.color">
            <div class="title">
              <medium-editor :text='item.title' custom-tag='h2' v-on:edit='processEditOperation($event, item)' />
            </div>
            <div v-on:click="changeColor(item)" class="color">
              <i class="fas fa-fill-drip"></i>
            </div>
            <div class="toggle" v-collapse-toggle>
              <i class="fas fa-toggle-on"></i>
            </div>
            <v-btn class="close-btn" v-on:click="deleteItem(index)"><i class="fas fa-times"></i></v-btn>
            <div class="my-content" v-collapse-content>
              <note :content="item.content"  @notecontent="onNoteUpdate($event, item, index)"></note>
            </div>
          </div>
        </v-collapse-wrapper>
      </v-collapse-group>
    </div>
</template>

<script>
// Import the editor
import Vue from 'vue'
import Note from '@/components/Note.vue'
import VueCollapse from 'vue2-collapse'
import UUID from 'vue-uuid'
import editor from 'vue2-medium-editor'

Vue.use(VueCollapse)
Vue.use(UUID)

export default {
  components: {
    Note,
    // eslint-disable-next-line
    VueCollapse,
    'medium-editor': editor,
  },
  methods: {
    addNote () {
      const blankNote = {
        title: 'New',
        content: '<p>this is Content</p>',
        id: this.$uuid.v1(),
        color: Math.floor(Math.random() * 3) + 1,
      }
      this.items.push(blankNote)
    },
    onNoteUpdate (noteContent, item, index) {
      const itemObject = {
        title: item.title,
        content: noteContent,
        id: item.id,
      }
      Vue.set(this.items, index, itemObject)
    },
    deleteItem (index) {
      this.items.splice(index, 1)
    },
    changeColor (item) {
      item.color = item.color === 3 ? 1 : item.color + 1
      console.log(item.color)
    },
    processEditOperation: function (operation, item) {
      this.text = operation.api.origElements.innerHTML
      item.title = this.text
    },
  },
  watch: {
    items: {
      handler () {
        console.log('items changed!')
        localStorage.setItem('noteItems', JSON.stringify(this.items))
      },
      deep: true,
    },
  },
  mounted () {
    console.log('App mounted!')
    if (localStorage.getItem('noteItems')) this.items = JSON.parse(localStorage.getItem('noteItems'))
  },
  data: function () {
    return {
      items: [],
    }
  },
}
</script>

<style>

  body {
   background: url('../assets/images/board.png') no-repeat;
   background-size: cover;
   height: 100vh;
   max-height: 100vh;
  }

  .notepad {
    padding: 50px;
    max-height: 100vh;
  }

  .v-collapse-content {
    min-height: 180px;
  }
  .v-collapse-content-end {
    display: none;
    min-height: 0;
  }

  .note {
    position: relative;
    float: left;
    width: 300px;
    padding: 0;

    margin: 0 30px 30px 0;
    -webkit-box-shadow: 0 3px 12px rgba(0, 0, 0, 0.50), 0 0 40px rgba(0, 0, 0, 0.12) inset;
    -moz-box-shadow: 0 3px 12px rgba(0, 0, 0, 0.50), 0 0 40px rgba(0, 0, 0, 0.12) inset;
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.50), 0 0 40px rgba(0, 0, 0, 0.12) inset;
    padding: 20px;
  }

  .note.color1 {
    border: 1px solid #107B7F;
    background: #00b7ea; /* Old browsers */
    background: -moz-linear-gradient(top, #00b7ea 0%, #007597 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(top, #00b7ea 0%,#007597 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(to bottom, #00b7ea 0%,#007597 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#00b7ea', endColorstr='#007597',GradientType=0 ); /* IE6-9 */
  }

  .note.color2 {
    border: 1px solid #74af01;
    background: #b6f934; /* Old browsers */
    background: -moz-linear-gradient(top, #b6f934 0%, #74af01 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(top, #b6f934 0%,#74af01 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(to bottom, #b6f934 0%,#74af01 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#b6f934', endColorstr='#74af01',GradientType=0 ); /* IE6-9 */
  }

  .note.color3 {
    border: 1px solid #c0b107;
    background: #f6e529; /* Old browsers */
    background: -moz-linear-gradient(top, #f6e529 0%, #daca14 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(top, #f6e529 0%,#daca14 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(to bottom, #f6e529 0%,#daca14 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f6e529', endColorstr='#daca14',GradientType=0 ); /* IE6-9 */
  }

  .medium-editor-toolbar {display: none;}

  .note:after,
  .note:before {
    content: '';
    z-index: -1;
    position: absolute;
    left: 10px;
    bottom: 10px;
    width: 70%;
    max-width: 300px; /* avoid rotation causing ugly appearance at large container widths */
    max-height: 100px;
    height: 55%;
    -webkit-box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6);
    -moz-box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6);
    -webkit-transform: skew(-15deg) rotate(-6deg);
    -moz-transform: skew(-15deg) rotate(-6deg);
    -ms-transform: skew(-15deg) rotate(-6deg);
    -o-transform: skew(-15deg) rotate(-6deg);
    transform: skew(-15deg) rotate(-6deg);
  }

  button.close-btn.theme--light.v-btn:not(.v-btn--icon):not(.v-btn--flatclose-btn) {
    background-color: transparent;
    box-shadow: none;
    position: absolute;
    top: 10px;
    right: 10px;
    width: 10px;
    height: 10px;
    margin: 0;
    padding: 0;
    min-width: 0;
    cursor: pointer;
  }

  .toggle {
    cursor: pointer;
    position: absolute;
    top: 9px;
    right: 26px;
  }

  .color {
    cursor: pointer;
    position: absolute;
    top: 10px;
    right: 46px;
    font-size: 12px;
  }

  .notes {
    columns:4;
    column-gap: 1em;
    max-height: calc(100vh - 100px);
  }

  .notes > * {
    max-width: 320px;
    margin-bottom:1em;
    display: inline-block;
  }

  .theme--light.v-btn:not(.v-btn--icon):not(.v-btn--flat) {
    margin: 0 0 20px;
    padding: 0;
  }

</style>
