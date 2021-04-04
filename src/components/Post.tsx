import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectUser } from '../features/userSlice'
import firebase from 'firebase/app'
import { db } from '../firebase'

import { Avatar, makeStyles } from '@material-ui/core'
import MessageIcon from '@material-ui/icons/Message'
import SendIcon from '@material-ui/icons/Send'

import styles from './Post.module.css'

const useStyles = makeStyles((theme) => ({
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: theme.spacing(1),
  },
}))

interface PROPS {
  avatar: string
  image: string
  postId: string
  text: string
  timestamp: any
  username: string
}

interface COMMENT {
  avatar: string
  id: string
  text: string
  timestamp: any
  username: string
}

const Post: React.FC<PROPS> = (props) => {
  const { avatar, image, postId, text, timestamp, username } = props
  const user = useSelector(selectUser)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState<COMMENT[]>([
    {
      avatar: '',
      id: '',
      text: '',
      timestamp: null,
      username: '',
    },
  ])
  const [openComments, setOpenComments] = useState(false)

  const classes = useStyles()

  useEffect(() => {
    const unSub = db
      .collection('posts')
      .doc(postId)
      .collection('comments')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) =>
        setComments(
          snapshot.docs.map((doc) => ({
            avatar: doc.data().avatar,
            id: doc.id,
            text: doc.data().text,
            timestamp: doc.data().timestamp,
            username: doc.data().username,
          }))
        )
      )
    return () => {
      unSub()
    }
  }, [postId])

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

        <MessageIcon
          className={styles.post_commentIcon}
          onClick={() => setOpenComments(!openComments)}
        />
        {openComments && (
          <>
            {comments.map((com) => (
              <div key={com.id} className={styles.post_comment}>
                <Avatar src={com.avatar} className={classes.small} />
                <span className={styles.post_commentUser}>@{com.username}</span>
                <span className={styles.post_commentText}>{com.text} </span>
                <span className={styles.post_headerTime}>
                  {new Date(com.timestamp?.toDate()).toLocaleString()}
                </span>
              </div>
            ))}

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
          </>
        )}
      </div>
    </div>
  )
}

export default Post
