<template>
  <div class="notepad" v-bind:class="bgClass()">
    <v-btn class="add-btn" v-on:click="addNote()"><i class="fas fa-plus"></i></v-btn>
    <v-btn class="add-btn" v-on:click="changeBg()"><i class="fas fa-image"></i></v-btn>
    <v-collapse-group :onlyOneActive="false" class="notes">
      <v-collapse-wrapper v-for="(item, index) in items" v-on:afterToggle="onCollapse(item)" :key="item.id">
        <vue-draggable-resizable
          :isActive="true"
          :w="300" :h="20"
          :x="item.left"
          :y="item.top"
          @dragging="onDrag(...arguments, item)"
          :resizable="false"
          drag-handle=".drag-handle"
          :disableUserSelect="false"
        >
          <div :class="'note color' + item.color" v-on:click="onActivated(item)">
            <div class="drag-handle"></div>
            <div class="title">
              <medium-editor :options="options" :text='item.title' custom-tag='h2' v-on:edit='processEditOperation($event, item)' />
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
import Note from '@/components/Note/index.vue'
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
      // add new note
      const blankNote = {
        title: 'New',
        content: '<p>this is Content</p><p><br></p>',
        id: this.$uuid.v1(),
        color: Math.floor(Math.random() * 5) + 1,
        width: 300,
        height: 300,
        top: 20,
        left: 20,
        collapsed: false,
      }
      this.items.push(blankNote)
    },
    changeBg () {
      // change/set background
      if (this.bgNumber > 2) {
        this.bgNumber = 1
      } else {
        this.bgNumber++
      }
      localStorage.setItem('bgNumber', JSON.stringify(this.bgNumber))
    },
    bgClass () {
      // bind bg class
      return 'bg' + this.bgNumber
    },
    onActivated (item) {
      // On selected, push to end of array and bring to top of stack
      if (this.items.length > 1) {
        this.items.push(this.items.splice(this.items.indexOf(item), 1)[0])
      }
    },
    onCollapse (item) {
      // toggle note collapse state
      item.collapsed = !item.collapsed
    },
    onNoteUpdate (noteContent, item, index) {
      // update note object
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
      // delete note
      this.items.splice(index, 1)
    },
    changeColor (item) {
      // cycle through colors
      item.color = item.color === 5 ? 1 : item.color + 1
    },
    processEditOperation: function (operation, item) {
      // update title of note
      this.text = operation.api.origElements.innerHTML
      item.title = this.text
    },
  },
  watch: {
    // watch items array for changes and update local storage
    items: {
      handler () {
        localStorage.setItem('noteItems', JSON.stringify(this.items))
      },
      deep: true,
    },
  },
  mounted () {
    // get notes/bg if key exists in local storage
    if (localStorage.getItem('noteItems')) this.items = JSON.parse(localStorage.getItem('noteItems'))
    if (localStorage.getItem('bgNumber')) this.bgNumber = JSON.parse(localStorage.getItem('bgNumber'))
  },
  data: function () {
    return {
      items: [],
      bgNumber: 1,
      options: {
        toolbar: false,
      },
    }
  },
}
</script>

<style lang="scss">
// Variables
$color1: #4ad2f8;
$color2: #d0fd75;
$color3: #fffa6e;
$color4: #eeeeee;
$color5: #f397ff;

// Mixins
@mixin gradientBackground($color) {
  border: 1px solid darken($color, 10%);
  background: $color; /* Old browsers */
  background: -moz-linear-gradient(top, $color 0%, darken($color, 20%) 100%); /* FF3.6-15 */
  background: -webkit-linear-gradient(top, $color 0%, darken($color, 20%) 100%); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(to bottom, $color 0%, darken($color, 20%) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='$color', endColorstr='darken($color, 20%)', GradientType=0 ); /* IE6-9 */
}

  .notepad {
    background-size: cover;
    height: 100vh;
    max-height: 100vh;
    overflow: hidden;
    padding: 50px;

    &.bg1 {
      background-image: url('../assets/images/tiles.jpg');
    }
    &.bg2 {
      background-image: url('../assets/images/board.png');
    }
    &.bg3 {
      background-position: right;
      background-image: url('../assets/images/cherry.jpg');
    }
  }

  .draggable {
    // overriding inline style from 3rd party library ¯\_(ツ)_/¯
    z-index: 1 !important;
  }

  .notes > * {
    max-width: 320px;
    margin-bottom:1em;
    display: inline-block;

    .note {
      width: 300px;
      padding: 0;
      -webkit-box-shadow: 0 3px 12px rgba(0, 0, 0, 0.50), 0 0 40px rgba(0, 0, 0, 0.12) inset;
      -moz-box-shadow: 0 3px 12px rgba(0, 0, 0, 0.50), 0 0 40px rgba(0, 0, 0, 0.12) inset;
      box-shadow: 0 3px 12px rgba(0, 0, 0, 0.50), 0 0 40px rgba(0, 0, 0, 0.12) inset;
      padding: 20px;
      position: relative;

      &.color1 {
        @include gradientBackground($color1);
      }

      &.color2 {
        @include gradientBackground($color2);
      }

      &.color3 {
        @include gradientBackground($color3);
      }

      &.color4 {
        @include gradientBackground($color4);
      }

      &.color5 {
        @include gradientBackground($color5);
      }

      &:after,
      &:before {
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

      .v-collapse-content {
        min-height: 180px;
      }
      .v-collapse-content-end {
        display: none;
        min-height: 0;
      }

      .drag-handle {
        position: absolute;
        width: 220px;
        height: 20px;
        top: 0;
        left: 0;
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

      h2:focus,
      .ProseMirror:focus {
        outline: none;
      }

      p {
        margin-bottom: 3px;
      }

      code {
        padding: 2px 4px;
        background: #fdf5e3;
        color: #013039;
        border-radius: 0;
        box-shadow: none;
        display: block;
        margin-bottom: 3px;

        &:before,
        &:after {
          display: none;
        }
      }
    }
  }

</style>
