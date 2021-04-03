import React from 'react'
import { auth } from '../firebase'

import TweetInput from './TweetInput'

import styles from './TweetInput.module.css'

const Feed = () => {
  return (
    <div className={styles.feed}>
      <TweetInput />
      <button onClick={() => auth.signOut()}>Logout</button>
    </div>
  )
}

export default Feed
