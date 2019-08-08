const state = {
  name: 'hello world!'
};

const mutations = {
  CHANGE_NAME: (state) => {
    state.name = 'hello webpack4-vue2-vuex!';
  }
};

const actions = {
  changeName({ commit }) {
    commit('CHANGE_NAME');
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
