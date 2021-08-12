const h = (tag, props, children) => {
  return {
    tag,
    props,
    children
  }
}

const mount = (vnode, contain) => {
  const el = vnode.el = document.createElement(vnode.tag)

  if(vnode.props){
    for(const key in vnode.props){
      if(key.startsWith("on")){
        el.addEventListener(key.slice(2).toLowerCase(), vnode.props[key])
      }else{
        el.setAttribute(key, vnode.props[key])
      }
    }
  }

  if(vnode.children){
    if(typeof vnode.children == "string"){
      el.textContent = vnode.children
    }else{
      vnode.children.forEach(item => {
        mount(item,el)
      })
    }
  }

  contain.appendChild(el)
}

const patch = (n1, n2) => {
  if(n1.tag !== n2.tag){
    const ElParent = n1.el.parentElement
    ElParent.removeChild(n1.el)
    mount(n2,ElParent)
  }else{
    const el = n2.el = n1.el
    const oldProps = n1.props || {}
    const newProps = n2.props || {}

    for(const key in newProps){
      const newValue = newProps[key]
      const oldValue = oldProps[key]

      if(newValue !== oldValue){
        if(key.startsWith("on")){
          el.addEventListener(key.slice(2).toLowerCase(), newValue)
          el.removeEventListener(key.slice(2).toLowerCase(), oldValue)
        }else{
          el.setAttribute(key, newValue)
        }
      }
    }

    for(const key in oldProps){
      if(!(key in newProps)){
        if(key.startsWith("on")){
          el.removeEventListener(key.slice(2).toLowerCase(), oldProps[key])
        }else{
          el.removeAttribute(key)
        }
      }
    }

    const n1Child = n1.children || []
    const n2Child = n2.children || []

    if(typeof n2Child === "string"){
      if(typeof n1Child === "string"){
        if(n1Child !== n2Child){
          el.textContent = n2.children
        }
      }else{
        el.innerHTML = ""
        el.textContent = n2.children
      }
    }else {
      if(typeof n1Child === "string"){
        el.textContent = ""
        n2Child.forEach(item => {
          mount(item, el)
        }) 
      }else{
        const commenLength = Math.min(n1Child.length, n2Child.length)

        for(let i = 0; i < commenLength ; i++){
          patch(n1Child[i], n2Child[i])
        }

        if(n1Child.length > n2Child.length){
          n1Child.slice(n2Child.length).forEach(item => {
            n1.el.removeChild(item.el)
          })
        }
        if(n1Child.length < n2Child.length){
          n2Child.slice(n1Child.length).forEach(item => {
            mount(el, n2Child)
          })
        }
      }
    }
  }
}
