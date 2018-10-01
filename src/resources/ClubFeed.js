export default {
  feed() {
    return {
      path: '/get_clubs',
      resolve: (response, mappers) => mappers.pipe(response.results)
    }
  }
}
