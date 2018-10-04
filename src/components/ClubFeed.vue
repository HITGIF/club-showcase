<template>
  <transition-group tag="ul" :name="transition" class="club__feed">
    <li v-for="post in feed" class="preview" :key="post.id">
      <figure class="preview__figure" :class="figureClass" :style="getBgImg(post.image)">
        <transition name="v--fade">
          <figcaption v-if="!reading || $device.phone" class="preview__details">
            <router-link class="preview__title"
                         :to="`/read/${post.id}`"
                         @click.native="scrollTo(0, 220, scrollDelay)">
              {{ post.title }}
            </router-link>

            <div class="preview__meta">
              <div class="preview__author">
                {{ post.author }}
              </div>
            </div>
          </figcaption>
        </transition>
        <figcaption v-if="reading">
          <div class="preview__meta">
            <div class="preview__author" @click="showImage" style="cursor: pointer;">
              <i class="fas fa-search fa-s"></i> View full image
            </div>
          </div>
        </figcaption>

        <viewer
          :options='{ "inline": false, "button": true, "navbar": false, "title": false, "toolbar": false,
          "tooltip": false, "movable": true, "zoomable": true, "rotatable": false, "scalable": false,
          "transition": false, "fullscreen": false, "keyboard": false, "url": "data-source" }'
          :images="getBgImgs(post.image)" @inited="inited" class="viewer" ref="viewer">
          <template slot-scope="scope">
            <img style="width: 0; height: 0;" v-for="src in scope.images" :src="src" :key="src">
          </template>
        </viewer>

      </figure>
    </li>
  </transition-group>
</template>

<script>
  import { scrollTo, kebabify, prettyDate } from '../helpers'
  import 'viewerjs/dist/viewer.css'
  import Viewer from 'v-viewer'
  import Vue from 'vue'

  Vue.use(Viewer)

  export default {
    name: 'club-feed',
    resource: 'ClubFeed',

    props: {
      filters: {
        type: Object,
        default: () => {}
      }
    },

    data () {
      return {
        posts: [],
        transition: 'preview-appear'
      }
    },

    computed: {
      reading () { return this.filters.post },
      scrollDelay () { return (this.$device.phone) ? 0 : 560 },
      figureClass () {
        return {'preview__figure--mobile': this.$device.phone && this.reading}
      },
      feed () {
        const filterBy = {
          post: (filter, {id}) => filter === id.toString(),
          author: (filter, {author}) => filter === this.kebabify(author)
        }

        if (!Object.keys(this.filters).length) return this.posts

        return this.posts.filter(post => {
          return Object.keys(this.filters).every(filter => {
            return filterBy[filter](this.filters[filter], post)
          })
        })
      }
    },

    methods: {
      scrollTo,
      kebabify,
      prettyDate,
      getBgImg (src) {
        return {backgroundImage: `url(${src})`}
      },
      getBgImgs (src) {
        let array = []
        array.push(src)
        return array
      },
      stackPosts (posts) {
        let interval
        const stack = () => {
          this.posts.push(posts.shift())

          if (!posts.length) {
            this.transition = 'preview'
            clearInterval(interval)
          }
        }

        interval = setInterval(stack, 125)
      },
      inited (viewer) {
        this.$viewer = viewer
      },
      showImage () {
        this.$viewer.show()
      }
    },

    mounted () {
      this.$getResource('feed')
        .then(posts => {
          if (!Object.keys(this.filters).length) {
            this.stackPosts(posts)
          } else {
            this.posts = posts
            this.transition = 'preview'
          }
        })
    }
  }
</script>
