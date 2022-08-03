import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app'
import 'firebase/auth'
import db from '../firebase/firebaseInit'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    blogPosts: [],
    postLoaded: null,

    // 創建blog的內容
    blogHTML: 'Write your blog title here',
    blogTitle: '',
    blogPhotoName: '',
    blogPhotoFileUrl: null,
    blogPhotoPreview: null,

    // User資訊
    editPost: null,
    user: null,
    profileEmail: null,
    profileFirstName: null,
    profileLastName: null,
    profileUsername: null,
    profileId: null,
    profileInitials: null,
  },

  getters: {
    blogPostsFeed(state) {
      return state.blogPosts.slice(0, 2)
    },

    blogPostsCards(state) {
      return state.blogPosts.slice(2, 6)
    }
  },

  mutations: {
    toggleEditPost(state, payload) {
      state.editPost = payload
    },

    updateUser(state, payload) {
      state.user = payload
    },

    setProfileInfo(state, doc) {
      state.profileId = doc.id
      state.profileEmail = doc.data().email
      state.profileFirstName = doc.data().firstName
      state.profileLastName = doc.data().lastName
      state.profileUsername = doc.data().username
    },

    setProfileInitials(state) {
      state.profileInitials = state.profileFirstName.match(/(\b\S)?/g).join('') + state.profileLastName.match(/(\b\S)?/g).join('')
    },

    changeFirstName(state,payload) {
      state.profileFirstName = payload
    },

    changeLastName(state,payload) {
      state.profileLastName = payload
    },
    
    changeUsername(state,payload) {
      state.profileUsername = payload
    },

    updateBlogTitle(state,payload) {
      state.blogTitle = payload
    },

    newBlogPost(state,payload) {
      state.blogHTML = payload
    },

    fileNameChange(state,payload) {
      state.blogPhotoName = payload
    },

    createFileURL(state,payload) {
      state.blogPhotoFileUrl = payload
    },

    openPhotoPreview(state) {
      state.blogPhotoPreview = !state.blogPhotoPreview
    },

    filterBlogPost(state, payload) {
      state.blogPosts = state.blogPosts.filter(post => post.blogID !== payload)
    },

    setBlogState(state, payload) {
      state.blogTitle = payload.blogTitle
      state.blogHTML = payload.blogHTML
      state.blogPhotoFileUrl = payload.blogCoverPhoto
      state.blogPhotoName = payload.blogCoverPhotoName
    }
  },

  actions: {
    async getCurrentUser({commit}) {
      const database = await db.collection('users').doc(firebase.auth().currentUser.uid)
      const dbResult = await database.get()
      commit('setProfileInfo', dbResult)
      commit('setProfileInitials')
    },

    async updateUserSettings({commit, state}) {
      const dataBaee = await db.collection('users').doc(state.profileId)
      await dataBaee.update({
        firstName: state.profileFirstName,
        lastName: state.profileLastName,
        username: state.profileUsername,
      })
      commit('setProfileInitials')
    },

    async getPost({state}) {
      const dataBaee = await db.collection('blogPost').orderBy('date', 'desc')
      const dbResults = await dataBaee.get()
      dbResults.forEach(doc => {
        if(!state.blogPosts.some(post => post.blogID === doc.id)) {
          const data = {
            blogID: doc.data().blogID,
            blogHTML: doc.data().blogHTML,
            blogCoverPhoto: doc.data().blogCoverPhoto,
            blogCoverPhotoName: doc.data().blogCoverPhotoName,
            blogTitle: doc.data().blogTitle,
            blogDate: doc.data().date
          }
          state.blogPosts.push(data)
        }
      })
      state.postLoaded = true
      // 清空createPost畫面的狀態
      state.blogTitle = null
      state.blogPhotoFileUrl = null
      state.blogHTML = 'Write your blog title here'
      state.blogPhotoName = null
    },

    async deletePost({commit}, payload) {
      const getPost = db.collection('blogPost').doc(payload)
      await getPost.delete()
      commit('filterBlogPost', payload)
    },

    async updatePost({commit, dispatch}, payload) {
      commit('filterBlogPost', payload)
      await dispatch('getPost')
    },
  }
})
