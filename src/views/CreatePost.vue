<template>
    <div class="create-post">
        <BlogCoverPreview v-show="this.$store.state.blogPhotoPreview"/>
        <Loading v-show="loading"/>
        <div class="container">
            <div :class="{invisible: !error}" class="err-message">
                <p><span>Error:</span>{{ this.errorMsg }}</p>
            </div>
            <div class="blog-info">
                <input type="text" placeholder="Enter Blog Title" v-model="blogTitle">
                <div class="upload-file">
                    <label for="blog-photo">Upload Cover Photo</label>
                    <input type="file" ref="blogPhoto" id="blog-photo" accept=".png, .jpg, .jpeg" @change="fileChange">
                    <button class="preview" :class="{'button-inactive': !this.$store.state.blogPhotoFileUrl}" @click="openPreview">Preview Photo</button>
                    <span>File Choosen: {{ this.$store.state.blogPhotoName }}</span>
                </div>
            </div>
            <div class='editor'>
                <vue-editor :editorOptions="editorSettings" v-model="blogHTML" useCustomImageHandler/>
            </div>
            <div class="blog-actions">
                <button @click="uploadBlog">Publish Blog</button>
                <router-link class="router-button" :to="{name: 'BlogPreview'}">Post Preview</router-link>
            </div>
        </div>
    </div>
</template>

<script>
import db from '../firebase/firebaseInit'
import BlogCoverPreview from '../components/BlogCoverPreview.vue'
import Loading from '../components/Loading.vue'
import Quill from 'quill'
window.Quill = Quill
const ImageResize = require('quill-image-resize-module').default
Quill.register('modules/imageResize', ImageResize)

export default {
    name: "CreatePost",
    components: {BlogCoverPreview, Loading},
    data() {
        return {
            file: null,
            error: null,
            errorMsg: 'null',
            loading: null,
            editorSettings: {
                modules: {
                    imageResize: {}
                }
            }
        }
    },

    computed: {
        profileId() {
            return this.$store.state.profileId
        },

        blogCoverPhotoName() {
            return this.$store.state.blogPhotoName
        },

        blogTitle: {
            get() {
                return this.$store.state.blogTitle
            },
            set(payload) {
                this.$store.commit('updateBlogTitle', payload)
            }
        },

        blogHTML: {
            get() {
                return this.$store.state.blogHTML
            },
            set(payload) {
                this.$store.commit('newBlogPost', payload)
            }
        },
    },

    methods: {
        fileChange() {
            this.file = this.$refs.blogPhoto.files[0]
            const fileName = this.file.name
            this.$store.commit('fileNameChange', fileName)
            this.$store.commit('createFileURL', URL.createObjectURL(this.file))

            this.imageUrl = 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg'
        },

        openPreview() {
            this.$store.commit('openPhotoPreview')
        },

        async uploadBlog() {
            if(this.blogTitle.length !== 0 && this.blogHTML.length !== 0) {
                if(this.file) {
                    this.loading = true
                    const dataBase = await db.collection('blogPost').doc()
                    const timestamp =  Date.now()

                    await dataBase.set({
                        profileId: this.profileId,
                        date: timestamp,
                        blogID: dataBase.id,
                        blogHTML: this.blogHTML,
                        blogCoverPhoto: this.imageUrl,
                        blogCoverPhotoName: this.blogCoverPhotoName,
                        blogTitle: this.blogTitle
                    })
                    await this.$store.dispatch('getPost')
                    this.loading = false
                    this.$router.push({name: 'ViewBlog', params: {blogid: dataBase.id}})
                    return
                }
                this.error = true
                this.errorMsg = 'Please ensure you uploaded a cover photo!'
                setTimeout(() => {
                    this.error =false
                }, 3000)
                return
            }

            this.error = true
            this.errorMsg = 'Please ensure Blog Title and Blog Post has been filled!'
            setTimeout(() => {
                this.error =false
            }, 3000)
            return
        }
    }
}
</script>

<style lang="scss">
.create-post {
    position: relative;
    height: 100%;

    button {
        margin-top: 0;
    }

    .router-button {
        text-decoration: none;
        color: #fff
    }

    label,
    button,
    .router-button {
        transition: 0.5s ease-in-out all;
        align-self: center;
        font-size: 14px;
        cursor: pointer;
        border-radius: 20px;
        padding: 12px 24px;
        color: #fff;
        background-color: #303030;
        text-decoration: none;
        
        &:hover {
            background-color: rgba(48, 48, 48, 0.7);
        }
    }

    .container {
        position: relative;
        height: 100%;
        padding: 10px 25px 60px;
    }

    .invisible {
        opacity: 0 !important;
    }

    .err-message {
        width: 100%;
        padding: 12px;
        border-radius: 8px;
        color: #fff;
        margin-bottom: 10px;
        background-color: #303030;
        opacity: 1;
        transition: .5s ease all;

        p {
            font-size: 14px;
        }

        span {
            font-weight: 600;
        }
    }

    .blog-info {
        display: flex;
        margin-bottom: 32px;

        input:nth-child(1) {
            min-width: 300px;
        }

        input {
            transition: .5s ease-in-out all;
            padding: 10px 4px;
            border: none;
            border-bottom: 1px solid #303030;

            &:focus {
                outline: none;
                box-shadow: 0 1px 0 0 #303030;
            }
        }

        .upload-file {
            flex: 1;
            margin-left: 16px;
            position: relative;
            display: flex;

            input {
                display: none;
            }

            .preview {
                margin-left: 16px;
                text-transform: initial;
            }

            span {
                font-size: 12px;
                margin-left: 16px;
                align-self: center;
            }
        }
    }

    .editor {
        height: 60vh;
        display: flex;
        flex-direction: column;

        .quillWrapper {
            position: relative;
            display: flex;
            flex-direction: column;
            height: 100%;
        }

        .ql-container {
            display: flex;
            flex-direction: column;
            height: 100%;
            overflow: auto;
        }

        .ql-editor {
            padding: 20px 16px 30px;
        }
    }

    .blog-actions {
        margin-top: 32px;

        button {
            margin-right: 16px
        }
    }
}
</style>