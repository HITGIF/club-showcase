export default {
  club() {
    return {
      path: '/club',
      resolve: (response, mappers) => {
        let club = response.results[0]
        return mappers.merge({
          title: club.title,
          labels: {
            post: club.post_label,
            author: club.author_label
          }
        })
      }
    }
  }
}
