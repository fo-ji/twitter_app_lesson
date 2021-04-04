import React, { useEffect, useState } from 'react'
import { db } from '../firebase'

import TweetInput from './TweetInput'

import styles from './TweetInput.module.css'

const Feed: React.FC = () => {
  const [posts, setPosts] = useState([
    {
      avatar: '',
      id: '',
      image: '',
      text: '',
      timestamp: null,
      username: '',
    },
  ])

  useEffect(() => {
    const unSub = db
      .collection('posts')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) =>
        setPosts(
          snapshot.docs.map((doc) => ({
            avatar: doc.data().avatar,
            id: doc.id,
            image: doc.data().image,
            text: doc.data().text,
            timestamp: doc.data().timestamp,
            username: doc.data().username,
          }))
        )
      )
    return () => {
      unSub()
    }
  }, [])

  return (
    <div className={styles.feed}>
      <TweetInput />
      {posts.map((post) => (
        <h3>{post.id}</h3>
      ))}
    </div>
  )
}

export default Feed
