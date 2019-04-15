import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // this object will be what gets referenced in your components
    // for example, your state could look like this:
    notes: [],
    background: 1,

    // when you want to reference them in a component, you'll add to the
    // computed object: ...mapState(['notes', 'background'])
    // then in your component you can directly reference `this.notes`, `this.background, etc
  },
  mutations: {
    // mutations change (or mutate) the state object
    // they can easily be accessed from any component with ...mapState('name')

    // example of mutators you might want:

    addNote ({ state, }, note) {
      // you want to use Vue.set when mutating state objects
      // you _could_ simply do:  state.notes.push(note);
      // but at some point you might run into the issue where the object is not
      // being reactive. In other words, you're watching `state.notes` for changes in
      // Note/index.vue, but it won't notice "deep" changes
      // more info here: https://vuejs.org/v2/api/#Vue-set
      const notes = state.notes
      notes.push(note)
      Vue.set(state, 'notes', notes)
    },

    deleteNote ({ state, }, noteId) {
      const notes = state.notes.filter(note => note.id !== noteId)
      Vue.set(state, 'notes', notes)
    },

    setBackground ({ state, }, backgroundId) {
      state.background = backgroundId
    },
  },
  actions: {
    // actions probably aren't needed here -- typically they are
    // for data fetching. then the data is sent to a mutator.
    // in this case, don't worry about actions for now
  },
})
