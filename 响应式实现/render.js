let activeEffct = null
const deps = new WeakMap()
class Dep {
  constructor() {
    this.subscriber = new Set()
  }
  depend() {
    if(activeEffct){
      this.subscriber.add(activeEffct)
    }
  }
  notify() {
    this.subscriber.forEach(effct => {
      effct()
    })
  }
}

function watchEffect(effct){
  activeEffct = effct
  effct()
  activeEffct = null
}

function getDep(target, key) {
  let depsMap = deps.get(target)
  if(!depsMap){
    depsMap = new Map()
    deps.set(target, depsMap)
  }

  let dep = depsMap.get(key)
  if(!dep){
    dep = new Dep()
    depsMap.set(key, dep)
  }

  return dep
}

// vue2 对 raw 进行数据劫持
// function reactive(raw) {
//   Object.keys(raw).forEach(key => {
//     const dep = getDep(raw, key)
//     let value = raw[key]
//     Object.defineProperty(raw, key, {
//       get() {
//         dep.depend()
//         return value
//       },
//       set(newValue) {
//         if(newValue !== value){
//           value = newValue
//         }
//         dep.notify()
//       }
//     })
//   })
//   return raw
// }

//vue3 对 raw 进行数据劫持
function reactive(raw){
  return new Proxy(raw,{
    get(target,key){
      const dep = getDep(target, key)
      dep.depend()
      return target[key]
    },
    set(target, key, newValue){
      const dep = getDep(target, key)
      if(newValue !== target[key]){
        target[key] = newValue
      }
      dep.notify()
    }
  })
}


// const info = reactive({counter: 100, name: "yct"})

// watchEffect(function(){
//   console.log(info.counter * info.counter, info.name)
// })
// watchEffect(function(){
//   console.log(info.counter + 10, info.name)
// })

// info.counter++
// info.name = "coder"
