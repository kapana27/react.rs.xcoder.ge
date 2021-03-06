export const Config = {
  management: {
    warehouse: {
      post: {},
      get: {
        items: '/api/secured/Item/Select',
        insertStart:"/api/secured/Item/Insert/Start"
      }
    },
    property:{
      post:{},
      get:{
        21: '/api/secured/Item/Section/Out/Select',
        22: '/api/secured/Item/Section/In/Select'
      }
    }
  },
  cart: {
    post: {
      put: "/api/secured/internal/session/put",
      getAll: "/api/secured/internal/session/getAll",
      remove: "/api/secured/internal/session/remove",
      clear: "/api/secured/internal/session/clear",
    }
  },
};
