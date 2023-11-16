import styled from 'styled-components';
import { ITweet } from './TimeLine';
import { auth, db, storage } from '../firebase';
import { deleteDoc, deleteField, doc, updateDoc } from 'firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';
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
  background-color: #ddd;
  color: #555;
  border: 0;
  font-weight: 600;
  font-size: 12px;
  padding: 0px 10px;
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

const AttachFileButton = styled.label`
  background-color: #000;
  color: #1d9bf0;
  border: 1px solid #1d9bf0;
  font-weight: 600;
  font-size: 12px;
  padding: 0px 10px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const AttachFileInput = styled.input`
  display: none;
`;

const Tweet = ({ username, photo, tweet, userId, id }: ITweet) => {
  const user = auth.currentUser;
  const [isEditing, setIsEditing] = useState(false);
  const [editedTweet, setEditedTweet] = useState(tweet);
  const [editedPhoto, setEditedPhoto] = useState<File | null>();

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
      const updateTweet = { tweet: editedTweet };

      // 트윗 수정시 파일을 업로드 하는 경우
      if (editedPhoto) {
        // Cloud Storage 루트 지정
        const locationRef = ref(storage, `tweets/${user.uid}/${tweetsRef.id}`);

        // Firebase에 업로드 (https://firebase.google.com/docs/storage/web/upload-files?hl=ko#upload_files)
        const result = await uploadBytes(locationRef, editedPhoto);

        // 파일의 다운로드 URL 정보 가져오기 (https://firebase.google.com/docs/storage/web/download-files?hl=ko#download_data_via_url)
        const url = await getDownloadURL(result.ref);

        // 기존 doc에 다운로드한 URL 추가해 업데이트 하기 (https://firebase.google.com/docs/firestore/manage-data/add-data?hl=ko#update-data)
        updateDoc(tweetsRef, { photo: url });
      }

      // updateDoc : 문서 업데이트 (https://firebase.google.com/docs/firestore/manage-data/add-data?hl=ko#set_a_document)
      await updateDoc(tweetsRef, updateTweet);

      setIsEditing(false);
      setEditedPhoto(null);
    } catch (e) {
      console.log(e);
    }
  };

  const onCancleEdit = () => {
    setIsEditing(false);
    setEditedPhoto(null);
    setEditedTweet(tweet);
  };

  const onAddFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (user?.uid !== userId) return;
    const { files } = e.target;

    if (files && files.length === 1 && files[0].size < 1000000) {
      setEditedPhoto(files[0]);
    }

    try {
      const tweetsRef = doc(db, 'tweets', id);
      if (editedPhoto) {
        updateDoc(tweetsRef, { photo: editedPhoto });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onDeleteFile = async () => {
    const ask = confirm('이미지를 정말로 삭제하시겠습니까?');
    if (user?.uid !== userId || !ask) return;
    try {
      // tweets 컬렉션에서 photo 필드 삭제하기
      const tweetsRef = doc(db, 'tweets', id);
      await updateDoc(tweetsRef, { photo: deleteField() });

      // Storage에서 이미지 삭제하기 (https://firebase.google.com/docs/storage/web/delete-files?hl=ko#delete_a_file)
      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
      alert('이미지가 삭제되었습니다.');
    } catch (e) {
      console.log(e);
    }
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
                <>
                  <AttachFileButton htmlFor='editFile'>
                    {editedPhoto ? 'Photo Added ✅' : 'EDIT PHOTO'}
                  </AttachFileButton>
                  <AttachFileInput
                    onChange={onAddFile}
                    type='file'
                    id='editFile'
                    accept='image/*'
                  />
                  {photo ? (
                    <AttachFileButton onClick={onDeleteFile}>
                      REMOVE PHOTO
                    </AttachFileButton>
                  ) : null}
                </>
                <EditingBtn onClick={onSaveEdit}>저장</EditingBtn>
                <EditingBtn onClick={onCancleEdit}>취소</EditingBtn>
              </BtnColumn>
            ) : null}
          </BtnWrapper>
        ) : null}
      </Column>
      <Column>{photo ? <Photo src={photo} /> : null}</Column>
    </Wrapper>
  );
};

export default Tweet;
