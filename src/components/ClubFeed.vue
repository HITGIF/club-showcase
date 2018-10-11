<template>
<div>
  <md-snackbar
    :md-position="snackPosition" :md-duration="snackDuration" :md-active.sync="showSnackbar" md-persistent>
    <span>{{ snackMessage }}</span>
    <md-button class="md-primary" @click="showSnackbar = false">OK</md-button>
  </md-snackbar>

  <md-card v-if="!reading && !shownNotif" class="md-primary" style="margin: 2.5rem 2.5rem 0 2.5rem; z-index: 0; padding: 1rem 1rem 0 1rem">
    <md-card-header>
      <md-card-header-text>
        <div class="md-title">Vote Start ! 投票开始了！</div>
        <div class="md-subhead" style="font-size: 20px; margin-top: .5rem">Voting will end at 24:00, Sunday October 14. Come pick your favourite clubs!</div>
        <div class="md-subhead" style="font-size: 20px; margin-top: .5rem">投票将于 10.14 周日晚上 24:00 结束，快来 pick 你最爱的社团吧！</div>
      </md-card-header-text>

      <md-card-media>
        <md-icon style="font-size: 5rem!important; margin-top: 2rem">thumb_up</md-icon>
      </md-card-media>
    </md-card-header>

    <md-card-actions>
      <md-button @click="dismissNotif()">OK</md-button>
    </md-card-actions>
  </md-card>

  <transition-group tag="ul" :name="transition" class="club__feed">

    <li v-if="!reading && posts.length == 0" v-for="n in 30" class="preview" :key="n">
      <content-loader
        :height="630"
        :width="420"
        :speed="2"
        primaryColor="#f3f3f3"
        secondaryColor="#ecebeb">
        <rect x="0" y="0" rx="1" ry="1" width="420" height="600"></rect>
        <rect x="0" y="610" rx="2" ry="2" width="200" height="20"></rect>
      </content-loader>
    </li>

    <li v-for="post in feed" class="preview" :key="post.id">
      <figure class="preview__figure" :class="figureClass" :style="getBgImg(post.image)">

          <md-button
            class="vote md-icon-button md-raised md-accent"
            @click="active = true; voting = post.id">
            <md-icon>thumb_up</md-icon>
            <!--{{ post.votes }}-->
          </md-button>

        <md-dialog-alert
          v-if="voting == post.id && maximumVotes <= 0"
          :md-active.sync="active"
          md-title="Vote haven't started 投票暂未开始"
          md-content="Vote for your favourite club on the Club Fair day! 社团展当天为你最爱的社团点赞吧！" ></md-dialog-alert>

        <div v-if="maximumVotes > 0">

          <md-dialog
            v-if="voting == post.id"
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
</div>
</template>

<script>
import { ContentLoader } from 'vue-content-loader'
import { scrollTo, kebabify, prettyDate } from '../helpers'
import 'viewerjs/dist/viewer.css'

export default {
  name: 'club-feed',
  resource: 'ClubFeed',

  components: {
    ContentLoader
  },

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
      maximumVotes: 5,
      shownNotif: false
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
      return {
        backgroundImage: `url(${src})`
      }
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
          // this.transition = 'preview'
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
      this.$http.post('https://api.mlzjsu.com/vote', formData, {
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
        } else if (votes) {
          this.showSnackbarF(':) Voted, ' + remain + ' vote(s) left.')
          this.updateVotesFor(cid, votes)
          return true
        } else {
          console.log(response.body)
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
    },
    dismissNotif () {
      this.shownNotif = true
      localStorage.shownNotif = true;
    }
  },

  mounted () {
    this.$ga.page(this.$router)
    if (localStorage.shownNotif) {
      this.shownNotif = true;
    }
    this.$getResource('feed')
      .then(posts => {
        if (!Object.keys(this.filters).length) {
          this.stackPosts(posts)
        } else {
          this.posts = posts
//          this.transition = 'preview'
        }
      })
  }
}
</script>
