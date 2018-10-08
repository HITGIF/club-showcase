<template>
  <transition name="post">
    <article v-if="allReady" class="post">
      <header class="post__header">
        <h2 class="post__title">{{ title }}</h2>

        <h3 class="post__meta"><div class="post__author">{{ author }}</div>

        </h3>

        <blockquote class="post__subtitle">{{ description }}</blockquote>
      </header>

      <iframe v-if = "video"
              :src = "video"
              scrolling="yes" frameborder="no" allowfullscreen="true" id="video"
              style="width: 100%; height: 60vh; margin-bottom: 80px">
      </iframe>

      <vue-markdown class="post__body markdown-body" :source="content"></vue-markdown>

    </article>

  </transition>

</template>

<script>

import VueDisqus from 'vue-disqus/VueDisqus'
import VueMarkdown from 'vue-markdown'
import { kebabify, prettyDate } from '../helpers'
import { page } from 'vue-analytics'

export default {
  name: 'club-post',
  resource: 'ClubPost',
  components: {
    VueDisqus, VueMarkdown
  },
  props: { post: String },

  data() {
    return {
      title: '',
      author: '',
      content: '',
      published: '',
      description: '',
      video: '',
      votes: '',
      commentsReady: false,
      ready: false
    }
  },

  computed: {
    allReady() {
      return this.ready && this.post;
    }
  },

  watch: {
    post(to, from) {
      if (to === from || !this.post) return;

      this.commentsReady = false
      this.$getResource('post', to)
        .then(this.showComments)
        .then(() => {
          this.ready = true;
        });
    }
  },

  methods: {
    kebabify,
    prettyDate,
    showComments() {
      // This is injected by prerender-spa-plugin on build time, we don't prerender disqus comments.
      if (window.__PRERENDER_INJECTED &&
          window.__PRERENDER_INJECTED.prerendered) {
        return;
      }

      setTimeout(() => {
        this.commentsReady = true
      }, 1000)
    },
    track () {
      page('/read/' + this.post)
    }
  },

  mounted() {
    if (!this.post) {
      this.ready = true;
      return;
    }

    this.$getResource('post', this.post)
      .then(this.showComments)
      .then(() => {
        this.ready = true;
      });
  }
}
</script>
