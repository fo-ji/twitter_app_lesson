import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectUser } from '../features/userSlice'
import firebase from 'firebase/app'
import { auth, db, storage } from '../firebase'

import { Avatar, Button, IconButton } from '@material-ui/core'
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto'

import styles from './TweetInput.module.css'

const TweetInput: React.FC = () => {
  const user = useSelector(selectUser)
  const [tweetMsg, setTweetMsg] = useState('')
  const [tweetImage, setTweetImage] = useState<File | null>(null)

  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Non-null Assertion Operator
    if (e.target.files![0]) {
      setTweetImage(e.target.files![0])
      e.target.value = ''
    }
  }

  // 画像がある場合は、storageにアップロードしてから、urlを取得してdbに追加する
  const sendTweet = (e: React.FormEvent<HTMLFormElement>) => {
    // onSubmitでリロード回避
    e.preventDefault()
    if (tweetImage) {
      const S = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      const N = 16
      const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map((n) => S[n % S.length])
        .join('')
      const fileName = randomChar + '_' + tweetImage.name
      const uploadTweetImage = storage.ref(`images/${fileName}`).put(tweetImage)
      // storageに対して何らかの変化が起きた場合の後処理をonメソッドで実装する
      uploadTweetImage.on(
        firebase.storage.TaskEvent.STATE_CHANGED,

        // 1. アップロードの進捗管理
        () => {}, // 今回は未実装
        // 2. エラーハンドリング
        (error) => {
          alert(error.message)
        },
        // 3. 正常終了した際の関数処理
        async () => {
          await storage
            .ref('images')
            .child(fileName)
            .getDownloadURL()
            .then(async (url) => {
              await db.collection('posts').add({
                avatar: user.photoUrl,
                image: url,
                text: tweetMsg,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                username: user.displayName,
              })
            })
        }
      )
    } else {
      db.collection('posts').add({
        avatar: user.photoUrl,
        image: '',
        text: tweetMsg,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        username: user.displayName,
      })
    }
    setTweetImage(null)
    setTweetMsg('')
  }

  return (
    <>
      <form onSubmit={sendTweet}>
        <div className={styles.tweet_form}>
          <Avatar
            className={styles.tweet_avatar}
            src={user.photoUrl}
            onClick={async () => {
              await auth.signOut()
            }}
          />
          <input
            autoFocus
            className={styles.tweet_input}
            onChange={(e) => setTweetMsg(e.target.value)}
            placeholder="What's happening ?"
            type="text"
            value={tweetMsg}
          />
          <IconButton>
            <label>
              <AddAPhotoIcon
                className={
                  tweetImage ? styles.tweet_addIconLoaded : styles.tweet_addIcon
                }
              />
              <input
                className={styles.tweet_hiddenIcon}
                onChange={onChangeImageHandler}
                type="file"
              />
            </label>
          </IconButton>
        </div>
        <Button
          className={
            tweetMsg ? styles.tweet_sendBtn : styles.tweet_sendDisableBtn
          }
          disabled={!tweetMsg}
          type="submit"
        >
          Tweet
        </Button>
      </form>
    </>
  )
}

export default TweetInput
