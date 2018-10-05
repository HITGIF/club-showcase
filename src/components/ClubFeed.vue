<template>
  <transition-group tag="ul" :name="transition" class="club__feed">
    <li v-for="post in feed" class="preview" :key="post.id">
      <figure class="preview__figure" :class="figureClass" :style="getBgImg(post.image)">

        <div v-if="maximumVotes > 0">

          <md-button
            v-if="!reading"
            class="vote md-icon-button md-raised md-accent"
            @click="active = true; voting = post.id">
            <md-icon>thumb_up</md-icon>
            {{ post.votes }}
          </md-button>

          <md-dialog
            v-if="voting == post.id && !reading"
            :md-active.sync="active"
            v-model="value"
            style=" height:auto; background-color: #ffffff;" >

            <div style="padding: 2rem;">
              <div style="
            line-height: 2rem;
            font-size: 1.5rem;
            margin-bottom: 1rem; ">

                Voting for <br>
                <p style="font-weight: bold;">{{ post.title }}</p>
              </div>

              <md-field md-clearable style="margin-top: 1rem">
                <label>Moodle ID</label>
                <md-input v-model="username"></md-input>
              </md-field>

              <md-field style="margin-top: -.5rem">
                <label>Moodle password</label>
                <md-input v-model="password" type="password"></md-input>
              </md-field>

              <p style="margin-top: 2rem">You can only vote {{ maximumVotes }} clubs!</p>

            </div>

            <md-dialog-actions style="margin-right: 1rem">
              <md-button class="md-primary" @click="endVote()">Calcel</md-button>
              <md-button class="md-primary" @click="
            voteClub(post.id, username, password);
            endVote();">
                <md-icon>thumb_up</md-icon>
                VOTE
              </md-button>
            </md-dialog-actions>
          </md-dialog>

          <md-snackbar
            v-if="post.id == 1 && !reading" :md-position="snackPosition" :md-duration="snackDuration" :md-active.sync="showSnackbar" md-persistent>
            <span>{{ snackMessage }}</span>
            <md-button class="md-primary" @click="showSnackbar = false">OK</md-button>
          </md-snackbar>

        </div>

        <transition name="v--fade">
          <figcaption v-if="!reading" class="preview__details">
            <router-link class="preview__title"
                         :to="`/read/${post.id}`"
                         style="text-decoration: none !important; line-height: 3.2rem !important; color: #ffffff"
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

        <figcaption v-if="reading && $device.phone" class="preview__details">
          <div class="preview__title"
               style="text-decoration: none !important; line-height: 3.2rem !important; color: #ffffff">
            {{ post.title }}
          </div>

          <div class="preview__meta-mobile">
            <div class="preview__author">
              {{ post.author }}
            </div>
          </div>
        </figcaption>

        <viewer
          v-if="reading"
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
      transition: 'preview-appear',
      active: false,
      voting: 0,
      value: null,
      username: '',
      password: '',
      snackMessage: '',
      snackDuration: 4000,
      showSnackbar: false,
      snackPosition: 'left',
      maximumVotes: 5
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
    },
    endVote () {
      this.active = false
      this.voting = 0
//      this.username = ''
      this.password = ''
    },
    voteClub (cid, username, password) {
      if (username === '' || password === '') {
        this.showSnackbarF('Please provide your Moodle ID and password.')
        return false
      }
      let formData = new FormData();
      formData.append('id', cid);
      formData.append('username', username);
      formData.append('password', password);
      this.$http.post('http://127.0.0.1:5000/vote', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((response) => {
        let error = response.body.error
        let votes = response.body.votes
        let remain = response.body.remain
        if (error) {
          this.showSnackbarF(error)
          console.log(error)
          return false
        } else if (votes && remain) {
          this.showSnackbarF(':) Voted, ' + remain + ' vote(s) left.')
          this.updateVotesFor(cid, votes)
          return true
        } else {
          this.showSnackbarF('Unknown error :(')
          return false
        }
      })
    },
    updateVotesFor (cid, votes) {
      console.log(cid, votes)
      this.posts[cid - 1].votes = votes
    },
    showSnackbarF (message) {
      this.snackMessage = message
      this.showSnackbar = true
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
