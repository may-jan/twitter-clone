import styled from 'styled-components';
import { ITweet } from './TimeLine';
import { auth, db, storage } from '../firebase';
import { deleteDoc, doc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div`
  &:last-child {
    place-self: end;
  }
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const DeleteButton = styled.button`
  background-color: tomato;
  color: #fff;
  border: 0;
  font-weight: 600;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const Tweet = ({ username, photo, tweet, userId, id }: ITweet) => {
  const user = auth.currentUser;
  const onDelete = async () => {
    const ask = confirm('이 트윗을 정말로 삭제하시겠습니까?');
    if (user?.uid !== userId || !ask) return;
    try {
      // tweets 컬렉션에서 트윗 삭제하기
      await deleteDoc(doc(db, 'tweets', id));

      // Storage에서 이미지 삭제하기 (https://firebase.google.com/docs/storage/web/delete-files?hl=ko#delete_a_file)
      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    } finally {
      //
    }
  };

  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        <Payload>{tweet}</Payload>
        {user?.uid === userId ? (
          <DeleteButton onClick={onDelete}>Delete</DeleteButton>
        ) : null}
      </Column>
      <Column>{photo ? <Photo src={photo} /> : null}</Column>
    </Wrapper>
  );
};

export default Tweet;
