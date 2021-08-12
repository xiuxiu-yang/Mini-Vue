function createApp(rootComponet) {
  return {
    mount(selector) {
      const container = document.querySelector(selector)
      let isMounted = false
      let oldNode = null
      watchEffect(() => {
        if (!isMounted) {
          oldNode = rootComponet.render()
          mount(oldNode, container)
          isMounted = true
        } else {
          const newNode = rootComponet.render()
          patch(oldNode, newNode)
          oldNode = newNode
        }
      })
    }
  }
}
