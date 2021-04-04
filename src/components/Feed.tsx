import React, { useEffect, useState } from 'react'
import { db } from '../firebase'

import Post from './Post'
import TweetInput from './TweetInput'

import styles from './Feed.module.css'

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
      {posts[0]?.id && (
        <>
          {posts.map((post) => (
            <Post
              avatar={post.avatar}
              image={post.image}
              key={post.id}
              postId={post.id}
              text={post.text}
              timestamp={post.timestamp}
              username={post.username}
            />
          ))}
        </>
      )}
    </div>
  )
}

export default Feed
