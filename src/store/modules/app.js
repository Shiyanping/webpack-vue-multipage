const state = {
  count: 0
};

const mutations = {
  ADD_COUNT: (state, payload) => {
    state.count += payload.amount;
  }
};

const actions = {
  addCount({ commit }, payload) {
    commit('ADD_COUNT', {
      amount: payload.num
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
