export default {
  post(id) {
    return {
      path: `/get_club/${id}`,
      resolve: (response, mappers) => {
        let { title, content, description, author, video, image } = response.results[0]
        return mappers.merge({ title, content, description, author, video, image })
      }
    }
  }
}
