import { createStore } from "vuex";
import auth from "./modules/auth";

export default createStore({
  state: {
    isLoading: false,
  },
  mutations: {
    setIsLoading(state: any, isLoading: boolean) {
      state.isLoading = isLoading;
    },
  },
  actions: {
    setIsLoading({ commit }: any, isLoading: boolean) {
      commit("setIsLoading", isLoading);
    },
  },
  getters: {
    isLoading: (state: any) => state.isLoading,
  },

  modules: {
    auth,
  },
});