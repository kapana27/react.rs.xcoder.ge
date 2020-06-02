
const eventEmitter = {
  events:{
    global:{},
    local:{}
  },
  dispatch:function (type,event,data) {
    if(!this.events[type][event]) return;
    this.events[type][event].forEach(callback=>callback(data))
  },
  subscribe: function (type,event,callback) {
    if(!this.events[type][event]) this.events[type][event] = [];
    this.events[type][event].push(callback)
  },
  unsubscribe: function(type,event){
    if(this.events[type][event]) delete this.events[type][event];
  }
}

module.exports ={ eventEmitter}
