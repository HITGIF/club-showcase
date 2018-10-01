<template>
  <main class="club" :class="{ 'club--reading': this.post }">
    <club-nav :content="content" :filters="filters" :navs="navs"/>
    <club-feed :filters="filters"/>
    <club-post :post="post"/>
    <club-footer/>
  </main>
</template>

<script>
import ClubNav from './ClubNav'
import ClubFeed from './ClubFeed'
import ClubPost from './ClubPost'
import ClubFooter from './ClubFooter'

export default {
  name: 'club',
  components: { ClubNav, ClubFeed, ClubPost, ClubFooter },
  resource: 'Club',
  props: {
    post: String,
    author: String
  },

  data() {
    return {
      navs: 0,
      title: '',
      labels: {
        post: '',
        author: ''
      }
    }
  },

  computed: {
    content() {
      return { title: this.title, labels: this.labels }
    },
    filters() {
      let filters = {}

      if (this.post) filters.post = this.post
      if (this.author) filters.author = this.author

      return filters
    }
  },

  watch: {
    '$route.name' (to, from) {
      if (to !== from) this.navs++
    }
  },

  mounted() {
    this.$getResource('club')
      .then(x => {
        // use pace hook to know when rendering is ready
      })
  }
}
</script>
