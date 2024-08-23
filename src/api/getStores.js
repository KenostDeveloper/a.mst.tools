export default function (instance) {
  return {
    get (payload) {
      const data = instance.post('/front_getstores', payload)
      return data
    },
    set (payload) {
      const data = instance.post('/front_getstores', payload)
      return data
    }
  }
}
