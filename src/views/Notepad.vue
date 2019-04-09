<template>
  <div class="notepad">
    <v-btn class="add-btn" v-on:click="addNote()"><i class="fas fa-plus"></i></v-btn>
      <v-collapse-group :onlyOneActive="false" class="notes">
        <v-collapse-wrapper v-for="(item, index) in items" v-on:afterToggle="onCollapse(item)" :key="item.id" :active="item.collapsed">
          <vue-draggable-resizable
            :isActive="true"
            :w="300" :h="20"
            :x="item.left"
            :y="item.top"
            @dragging="onDrag(...arguments, item)"
            :isResizable="false"
            drag-handle=".drag-handle"
            :disableUserSelect="false"
          >
            <div :class="'note color' + item.color">
              <div class="drag-handle"></div>
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
              <div class="my-content" v-collapse-content :active="false">
                <note :content="item.content"  @notecontent="onNoteUpdate($event, item, index)"></note>
              </div>
            </div>
          </vue-draggable-resizable>
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
import VueDraggableResizable from 'vue-draggable-resizable'

Vue.use(VueCollapse)
Vue.use(UUID)

export default {
  components: {
    Note,
    // eslint-disable-next-line
    VueCollapse,
    'medium-editor': editor,
    VueDraggableResizable,
  },
  methods: {
    addNote () {
      const blankNote = {
        title: 'New',
        content: '<p>this is Content</p><p><br></p>',
        id: this.$uuid.v1(),
        color: Math.floor(Math.random() * 4) + 1,
        width: 300,
        height: 300,
        top: 20,
        left: 20,
        collapsed: false,
      }
      this.items.push(blankNote)
    },
    onCollapse (item) {
      item.collapsed = !item.collapsed
    },
    onNoteUpdate (noteContent, item, index) {
      const itemObject = {
        title: item.title,
        content: noteContent,
        id: item.id,
        color: item.color,
        top: item.top,
        left: item.left,
        collapsed: item.collapsed,
      }
      Vue.set(this.items, index, itemObject)
    },
    onDrag (x, y, item) {
      // set x/y of dragged item
      item.left = this.x = x
      item.top = this.y = y
    },
    deleteItem (index) {
      this.items.splice(index, 1)
    },
    changeColor (item) {
      item.color = item.color === 4 ? 1 : item.color + 1
    },
    processEditOperation: function (operation, item) {
      this.text = operation.api.origElements.innerHTML
      item.title = this.text
    },
  },
  watch: {
    items: {
      handler () {
        localStorage.setItem('noteItems', JSON.stringify(this.items))
      },
      deep: true,
    },
  },
  mounted () {
    if (localStorage.getItem('noteItems')) this.items = JSON.parse(localStorage.getItem('noteItems'))
  },
  data: function () {
    return {
      items: [],
      activeItem: '',
    }
  },
}
</script>

<style>

  body, html {
   background: url('../assets/images/board.png') no-repeat;
   background-size: cover;
   height: 100vh;
   max-height: 100vh;
   overflow: hidden;
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
    width: 300px;
    padding: 0;
    margin: 0 30px 30px 0;
    -webkit-box-shadow: 0 3px 12px rgba(0, 0, 0, 0.50), 0 0 40px rgba(0, 0, 0, 0.12) inset;
    -moz-box-shadow: 0 3px 12px rgba(0, 0, 0, 0.50), 0 0 40px rgba(0, 0, 0, 0.12) inset;
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.50), 0 0 40px rgba(0, 0, 0, 0.12) inset;
    padding: 20px;
  }

  .drag-handle {
    position: absolute;
    width: 220px;
    height: 20px;
    top: 0;
    left: 0;
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
    background: #fff948; /* Old browsers */
    background: -moz-linear-gradient(top, #fff948 0%, #daca14 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(top, #fff948 0%,#daca14 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(to bottom, #fff948 0%,#daca14 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#fff948', endColorstr='#daca14',GradientType=0 ); /* IE6-9 */
  }

  .note.color4 {
    border: 1px solid #939393;
    background: #d3d3d3; /* Old browsers */
    background: -moz-linear-gradient(top, #d3d3d3 0%, #939393 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(top, #d3d3d3 0%,#939393 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(to bottom, #d3d3d3 0%,#939393 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#d3d3d3', endColorstr='#939393',GradientType=0 ); /* IE6-9 */
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

  .note h2:focus,
  .ProseMirror:focus {
    outline: none;
  }

  .note p {
    margin-bottom: 3px;
  }

  .note code {
    padding: 2px 4px;
    background: #fdf5e3;
    color: #013039;
    border-radius: 0;
    box-shadow: none;
    display: block;
    margin-bottom: 3px;
  }

  .note code:before,
  .note code:after {
    display: none;
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

  .vdr.active:before {
    outline: none;
  }

</style>
