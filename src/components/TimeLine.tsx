import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { db } from '../firebase';
import Tweet from './Tweet';
import { Unsubscribe } from 'firebase/auth';

export interface ITweet {
  id: string;
  photo: string;
  tweet: string;
  userId: string;
  username: string;
  createdAt: number;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TimeLine = () => {
  const [tweets, setTweets] = useState<ITweet[]>([]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchTweets = async () => {
      const tweetsQuery = query(
        collection(db, 'tweets'),
        orderBy('createdAt', 'desc'),
        limit(25)
      );

      // 데이터베이스 및 쿼리와 실시간 연결
      // 요소가 생성, 삭제, 업데이트 되면 쿼리에 즉시 알려준다
      // onSnapshot() : 이벤트 리스너를 연결시키는 함수
      // https://firebase.google.com/docs/firestore/query-data/listen?hl=ko#listen_to_multiple_documents_in_a_collection
      unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
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
      });
    };
    fetchTweets();

    return () => {
      // 사용자가 타임라인을 보고 있을 때만 활성화 (cleanUp)
      unsubscribe && unsubscribe();
    };
  }, []);

  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
};

export default TimeLine;
