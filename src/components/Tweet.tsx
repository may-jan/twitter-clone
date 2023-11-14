import styled from 'styled-components';
import { ITweet } from './TimeLine';
import { auth, db, storage } from '../firebase';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { useState } from 'react';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div``;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 20px 0px;
  font-size: 18px;
`;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const BtnWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 25px;
`;

const BtnColumn = styled.div`
  display: flex;
  gap: 5px;
  height: 100%;
`;

const EditButton = styled.button`
  background-color: #555;
  color: #fff;
  border: 0;
  font-weight: 600;
  font-size: 12px;
  padding: 0px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const DeleteButton = styled.button`
  background-color: tomato;
  color: #fff;
  border: 0;
  font-weight: 600;
  font-size: 12px;
  padding: 0px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const EditingBtn = styled.button`
  background-color: ddd;
  color: #555;
  border: 0;
  font-weight: 600;
  font-size: 12px;
  padding: 0px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const EditText = styled.textarea`
  display: flex;
  margin: 10px 0px;
  background-color: #000;
  color: #fff;
  font-size: 16px;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

const Tweet = ({ username, photo, tweet, userId, id }: ITweet) => {
  const user = auth.currentUser;
  const [isEditing, setIsEditing] = useState(false);
  const [editedTweet, setEditedTweet] = useState(tweet);
  // const [editedPhoto, setEditedPhoto] = useState<File | null>();

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
    }
  };

  const onEdit = async () => {
    if (user?.uid !== userId) return;
    setIsEditing(true);
  };

  const onSaveEdit = async () => {
    if (user?.uid !== userId) return;
    try {
      const tweetsRef = doc(db, 'tweets', id);
      const updateData = { tweet: editedTweet };

      // updateDoc : 문서 업데이트 (https://firebase.google.com/docs/firestore/manage-data/add-data?hl=ko#set_a_document)
      await updateDoc(tweetsRef, updateData);
      setIsEditing(false);
    } catch (e) {
      console.log(e);
    }
  };

  const onCancleEdit = () => {
    setIsEditing(false);
    setEditedTweet(tweet);
  };

  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        {isEditing ? (
          <>
            <EditText
              onChange={(e) => setEditedTweet(e.target.value)}
              value={editedTweet}
              rows={3}
              cols={50}
            />
          </>
        ) : (
          <Payload>{tweet}</Payload>
        )}
        {user?.uid === userId ? (
          <BtnWrapper>
            <BtnColumn>
              <EditButton onClick={onEdit}>Edit</EditButton>{' '}
              <DeleteButton onClick={onDelete}>Delete</DeleteButton>
            </BtnColumn>
            {isEditing ? (
              <BtnColumn>
                <EditingBtn onClick={onSaveEdit}>저장</EditingBtn>
                <EditingBtn onClick={onCancleEdit}>취소</EditingBtn>
              </BtnColumn>
            ) : null}
          </BtnWrapper>
        ) : null}
      </Column>
      <Column>{photo ? <Photo src={photo} /> : null}</Column>
      {/* <Column></Column> */}
    </Wrapper>
  );
};

export default Tweet;
