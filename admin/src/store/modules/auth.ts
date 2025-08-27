const auth = {
  namespaced: true,
  state: {
    user: null,
  },
  mutations: {
    setUser(state: any, user: any) {
      state.user = user;
    },
  },
  actions: {
    setUser({ commit }: any, user: any) {
      commit("setUser", user);
    },
  },
  getters: {
    user: (state: any) => state.user,
  },
};

export default auth;