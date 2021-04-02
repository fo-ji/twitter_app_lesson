import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { auth, provider, storage } from '../firebase'

import {
  Avatar,
  Box,
  Button,
  CssBaseline,
  Grid,
  IconButton,
  Modal,
  Paper,
  TextField,
  Typography,
  makeStyles,
} from '@material-ui/core'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import CameraIcon from '@material-ui/icons/Camera'
import EmailIcon from '@material-ui/icons/Email'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import SendIcon from '@material-ui/icons/Send'

import styles from './Auth.module.css'

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage:
      'url(https://images.unsplash.com/photo-1617289341260-76cad9da9731?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=658&q=80)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light'
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

const Auth: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)

  const classes = useStyles()

  const signInEmail = async () => {
    await auth.signInWithEmailAndPassword(email, password)
  }

  const signUpEmail = async () => {
    await auth.createUserWithEmailAndPassword(email, password)
  }

  const signInGoogle = async () => {
    await auth.signInWithPopup(provider).catch((error) => alert(error.message))
  }

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {isLogin ? 'Login' : 'Register'}
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              autoComplete="email"
              autoFocus
              fullWidth
              id="email"
              label="Email Address"
              margin="normal"
              name="email"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              required
              value={email}
              variant="outlined"
            />
            <TextField
              autoComplete="current-password"
              fullWidth
              id="password"
              label="Password"
              margin="normal"
              name="password"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              required
              type="password"
              variant="outlined"
              value={password}
            />

            <Button
              className={classes.submit}
              color="primary"
              fullWidth
              onClick={
                isLogin
                  ? async () => {
                      try {
                        await signInEmail()
                      } catch (error) {
                        alert(error.message)
                      }
                    }
                  : async () => {
                      try {
                        await signUpEmail()
                      } catch (error) {
                        alert(error.message)
                      }
                    }
              }
              startIcon={<EmailIcon />}
              variant="contained"
            >
              {isLogin ? 'Login' : 'Register'}
            </Button>
            <Grid container>
              <Grid item xs>
                <span className={styles.login_reset}>Forgot password?</span>
              </Grid>
              <Grid item xs>
                <span
                  className={styles.login_toggleMode}
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? 'create new account ?' : 'Back to login'}
                </span>
              </Grid>
            </Grid>
            <Button
              className={classes.submit}
              color="primary"
              fullWidth
              onClick={signInGoogle}
              variant="contained"
            >
              SignIn with Google
            </Button>
          </form>
        </div>
      </Grid>
    </Grid>
  )
}

export default Auth
