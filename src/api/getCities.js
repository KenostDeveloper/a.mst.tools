export default function (instance) {
  return {
    get (payload) {
      const data = instance.post('/front_getcities', payload)
      return data
    },
    set (payload) {
      const data = instance.post('/front_getcities', payload)
      return data
    }
  }
}
