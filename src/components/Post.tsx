import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectUser } from '../features/userSlice'
import firebase from 'firebase/app'
import { db } from '../firebase'

import { Avatar, makeStyles } from '@material-ui/core'
import MessageIcon from '@material-ui/icons/Message'
import SendIcon from '@material-ui/icons/Send'

import styles from './Post.module.css'

interface PROPS {
  avatar: string
  image: string
  postId: string
  text: string
  timestamp: any
  username: string
}

const Post: React.FC<PROPS> = (props) => {
  const { avatar, image, postId, text, timestamp, username } = props
  const user = useSelector(selectUser)
  const [comment, setComment] = useState('')

  const newComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    db.collection('posts').doc(postId).collection('comments').add({
      avatar: user.photoUrl,
      text: comment,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      username: user.displayName,
    })
    setComment('')
  }

  return (
    <div className={styles.post}>
      <div className={styles.post_avatar}>
        <Avatar src={avatar} />
      </div>
      <div className={styles.post_body}>
        <div>
          <div className={styles.post_header}>
            <h3>
              <span className={styles.post_headerUser}>@{username}</span>
              <span className={styles.post_headerTime}>
                {/* firebaseのtimestampのデータ型をjsonに変換する定型分 */}
                {new Date(timestamp?.toDate()).toLocaleString()}
              </span>
            </h3>
          </div>
          <div className={styles.post_tweet}>
            <p>{text}</p>
          </div>
        </div>
        {image && (
          <div className={styles.post_tweetImage}>
            <img src={image} alt="tweet" />
          </div>
        )}
        <form onSubmit={newComment}>
          <div className={styles.form}>
            <input
              className={styles.post_input}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setComment(e.target.value)
              }
              placeholder="Type new comment.."
              type="text"
              value={comment}
            />
            <button
              className={
                comment ? styles.post_button : styles.post_buttonDisable
              }
              disabled={!comment}
              type="submit"
            >
              <SendIcon className={styles.post_sendIcon} />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Post
