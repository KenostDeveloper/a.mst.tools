export default function (instance) {
  return {
    get (payload) {
      const data = instance.post('front_getmsproducts', payload)
      return data
    },
    set (payload) {
      const data = instance.post('front_getmsproducts', payload)
      return data
    }
  }
}
