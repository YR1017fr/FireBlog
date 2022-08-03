<template>
  <div class="form-wrap">
    <form class="login">
      <p class="login-register">
        Don't have a account?
        <router-link class="router-link" :to="{ name: 'Register' }">Register</router-link>
      </p>
      <h2>Login to FireBlogs</h2>
      <div class="inputs">
        <div class="input">
          <input type="text" placeholder="Email" v-model="email"/>
          <email class="icon"/>
        </div>
        <div class="input">
          <input type="password" placeholder="Password" v-model="password"/>
          <password class="icon"/>
        </div>
        <div v-show="error" class="error">{{ this.errorMessage }}</div>
      </div>
      <router-link class="forgot-password" :to="{ name: 'ForgotPassword' }">Forgot your password?</router-link>
      <button @click.prevent="signIn">Sign In</button>
      <div class="angle"/>
    </form>
    <div class="background"/>
  </div>
</template>

<script>
import email from "../assets/Icons/envelope-regular.svg";
import password from "../assets/Icons/lock-alt-solid.svg";
import firebase from 'firebase/app'
import 'firebase/auth'

export default {
  name: "Login",
  components: { email, password },
  data() {
    return {
        email: null,
        password: null,
        error: null,
        errorMessage: ''
    }
  },

  methods: {
    signIn() {
        firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(() => {
            this.$router.push({name: 'Home'})
            this.error = false
            this.errorMessage = ''
        }).catch(err => {
            this.error = true
            this.errorMessage = err.message
        })
    }
  }
};
</script>

<style lang="scss">
.form-wrap {
    overflow: hidden;
    display: flex;
    height: 100vh;
    width: 90%;
    justify-content: center;
    align-self: center;
    margin: 0 auto;

    @media(min-width: 900px) {
        width: 100%;
    }

    .login-register {
        margin-bottom: 32px;
        
        .router-link {
            color: #000;
        }
    }

    form {
        padding:10px 0;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex: 1;

        @media(min-width: 900px) {
            padding: 0 50px;
        }

        h2 {
            text-align: center;
            font-size: 32px;
            color: #303030;
            margin-bottom: 40px;

            @media(min-width: 900px) {
                font-size: 40px;
            }
        }

        .inputs {
            width: 100%;
            max-width: 350px;

            .input {
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-bottom: 8px;

                input {
                    width: 100%;
                    border: none;
                    background-color: #f2f7f6;
                    padding: 4px 4px 4px 30px;
                    height: 50px;

                    &:focus {
                        outline: none;
                    }
                }

                .icon {
                    width: 12px;
                    position: absolute;
                    left: 6px;
                }
            }
        }

        .forgot-password {
            text-decoration: none;
            color: #000;
            cursor: pointer;
            font-size: 14px;
            margin: 16px 0 8px;
            border-bottom: 1px solid transparent;
            transition: .5s ease all;

            &:hover {
                border-color: #303030;
            }
        }

        .angle {
            display: none;
            position: absolute;
            background-color: #fff;
            transform: rotateZ(3deg);
            width: 60px;
            height: 101%;
            right: -30px;

            @media(min-width: 900px) {
                display: initial;
            }
        }
    }

    .background {
        display: none;
        flex: 2;
        background-size: cover;
        background-image: url('../assets/background.png');
        height: 100%;
        width: 100%;

        @media(min-width: 900px) {
            display: initial;
        }
    }
}
</style>