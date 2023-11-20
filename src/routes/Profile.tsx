import styled from 'styled-components';
import { auth, db, storage } from '../firebase';
import { useEffect, useState } from 'react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { ITweet } from '../components/TimeLine';
import Tweet from '../components/Tweet';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const AvatarUpload = styled.label`
  width: 80px;
  height: 80px;
  overflow: hidden;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    width: 50px;
  }
`;

const AvatarImg = styled.img`
  width: 100%;
`;

const AvatarInput = styled.input`
  display: none;
`;

const Name = styled.span`
  font-size: 22px;
  display: flex;
  align-items: center;
  gap: 5px;
  svg {
    width: 25px;
    cursor: pointer;
  }
`;

const TweetsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const EditNameWrapper = styled.div`
  display: flex;
  gap: 10px;
`;

const EditName = styled.textarea`
  background-color: #000;
  color: #fff;
  font-size: 16px;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

const Btn = styled.button`
  background-color: #ddd;
  color: #555;
  border: 0;
  font-weight: 600;
  font-size: 12px;
  padding: 0px 10px;
  border-radius: 5px;
  cursor: pointer;
`;

const Profile = () => {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const [name, setName] = useState(user?.displayName || undefined);
  const [isEdit, setIsEdit] = useState(false);

  // 프로필 사진 변경
  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!user) return;
    if (files && files.length === 1) {
      const file = files[0];
      const locationRef = ref(storage, `avatars/${user?.uid}`);
      const result = await uploadBytes(locationRef, file);
      const avatarUrl = await getDownloadURL(result.ref);
      setAvatar(avatarUrl);
      await updateProfile(user, { photoURL: avatarUrl });
    }
  };

  // 이름 변경
  const onEditSave = async () => {
    if (!user) return;
    try {
      tweets.forEach(async (tweet) => {
        if (user?.uid === tweet.userId) {
          const tweetsRef = doc(db, 'tweets', tweet.id);
          await updateDoc(tweetsRef, { username: name });
        }
      });
      await updateProfile(user, { displayName: name });
    } catch (e) {
      console.log(e);
    }
    setIsEdit(false);
  };

  useEffect(() => {
    const fetchTweets = async () => {
      const tweetQuery = query(
        collection(db, 'tweets'),
        where('userId', '==', user?.uid),
        orderBy('createdAt', 'desc'),
        limit(25)
      );

      const snapshot = await getDocs(tweetQuery);

      const tweets = snapshot.docs.map((doc) => {
        const { tweet, createdAt, userId, username, photo } = doc.data();
        return {
          id: doc.id,
          tweet,
          createdAt,
          userId,
          username,
          photo,
        };
      });
      setTweets(tweets);
    };

    fetchTweets();
  }, [name, user?.uid]);

  return (
    <Wrapper>
      <AvatarUpload htmlFor='avatar'>
        {avatar ? (
          <AvatarImg src={avatar} />
        ) : (
          <svg
            fill='currentColor'
            viewBox='0 0 20 20'
            xmlns='http://www.w3.org/2000/svg'
            aria-hidden='true'
          >
            <path d='M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z'></path>
          </svg>
        )}
      </AvatarUpload>
      <AvatarInput
        onChange={onAvatarChange}
        id='avatar'
        type='file'
        accept='image/*'
      />

      {user?.displayName ? (
        <>
          {!isEdit ? (
            <Name>
              {user.displayName}
              <svg
                onClick={() => setIsEdit(true)}
                fill='none'
                stroke='currentColor'
                strokeWidth='1.5'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
                aria-hidden='true'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10'
                ></path>
              </svg>
            </Name>
          ) : (
            <EditNameWrapper>
              <EditName
                onChange={(e) => setName(e.target.value)}
                value={name}
                rows={1}
                cols={15}
              ></EditName>
              <Btn onClick={onEditSave}>저장</Btn>
            </EditNameWrapper>
          )}
        </>
      ) : (
        <Name>Anonymous</Name>
      )}
      <TweetsContainer>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </TweetsContainer>
    </Wrapper>
  );
};

export default Profile;
