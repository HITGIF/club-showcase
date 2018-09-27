export default {
  post(id) {
    return {
      path: `/get_club/${id}`,
      resolve: (response, mappers) => {
        let { title, content, description, author, video, image } = response.results[0]
        content = '<p>' + content.split('\n\n').join('</p><p>') + '</p>'
        return mappers.merge({ title, content, description, author, video, image })
      }
    }
  }
}
