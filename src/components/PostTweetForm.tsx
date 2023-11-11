import styled from 'styled-components';
import { useState } from 'react';
import { addDoc, collection, updateDoc } from 'firebase/firestore';
import { auth, db, storage } from '../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TextArea = styled.textarea`
  border: 2px solid #fff;
  padding: 20px;
  box-sizing: border-box;
  border-radius: 20px;
  font-size: 16px;
  color: #fff;
  background-color: #000;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;

  &::placeholder {
    background-color: #000;
    color: #fff;
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

const AttachFileButton = styled.label`
  padding: 10px 0px;
  color: #1d9bf0;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9bf0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const AttachFileInput = styled.input`
  display: none;
`;

const SubmitBtn = styled.input`
  background-color: #1d9bf0;
  color: #fff;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.8;
  }
`;

const PostTweetForm = () => {
  const [loading, setLoading] = useState(false);
  const [tweet, setTweet] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1 && files[0].size < 1000000) {
      setFile(files[0]);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (!user || loading || tweet === '' || tweet.length > 180) return;

    try {
      setLoading(true);
      const doc = await addDoc(collection(db, 'tweets'), {
        tweet,
        createdAt: Date.now(),
        username: user.displayName || 'Anonymous',
        userId: user.uid,
      });

      // 업로드한 파일이 있는 경우
      if (file) {
        // Cloud Storage 루트 지정
        const locationRef = ref(
          storage,
          `tweets/${user.uid}-${user.displayName}/${doc.id}`
        );
        // Firebase에 업로드 (https://firebase.google.com/docs/storage/web/upload-files?hl=ko#upload_files)
        const result = await uploadBytes(locationRef, file);
        // 파일의 다운로드 URL 정보 가져오기 (https://firebase.google.com/docs/storage/web/download-files?hl=ko#download_data_via_url)
        const url = await getDownloadURL(result.ref);
        // 기존 doc에 다운로드한 URL 추가해 업데이트 하기 (https://firebase.google.com/docs/firestore/manage-data/add-data?hl=ko#update-data)
        updateDoc(doc, { photo: url });
      }
      setTweet('');
      setFile(null);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        rows={5}
        maxLength={180}
        onChange={onChange}
        value={tweet}
        placeholder='무슨 일이 일어나고 있나요?'
      />
      <AttachFileButton htmlFor='file'>
        {file ? 'Photo Added ✅' : 'Add photo'}
      </AttachFileButton>
      <AttachFileInput
        onChange={onFileChange}
        type='file'
        id='file'
        accept='image/*'
      />
      <SubmitBtn type='submit' value={loading ? 'Posting...' : 'Post Tweet'} />
    </Form>
  );
};

export default PostTweetForm;
