import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import {
  Error,
  Form,
  Input,
  Switcher,
  Title,
  Wrapper,
} from '../components/AuthComponents';

interface ErrorMsg {
  [code: string]: string;
}

const errorMsg: ErrorMsg = {
  'auth/email-already-in-use': '이미 사용 중인 이메일 입니다.',
  'auth/invalid-email': '잘못된 이메일 형식입니다.',
  'auth/weak-password': '비밀번호는 6글자 이상이어야 합니다.',
  'auth/network-request-failed': '네트워크 연결에 실패 하였습니다.',
  'auth/internal-error': '잘못된 요청입니다.',
};

const CreateAccount = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;

    if (name === 'name') {
      setName(value);
    } else if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError('');
    if (loading || name === '' || email === '' || password === '') return;
    try {
      setLoading(true);

      // 1. create account
      const credentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // 2. set the name of the user profile
      await updateProfile(credentials.user, {
        displayName: name,
      });

      // 3. redirect to the home page
      navigate('/');
    } catch (e) {
      // setError
      if (e instanceof FirebaseError) {
        setError(errorMsg[e.code]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Title>Join 🕊️</Title>
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          name='name'
          value={name}
          placeholder='Name'
          type='text'
          required
        />
        <Input
          onChange={onChange}
          name='email'
          value={email}
          placeholder='Email'
          type='email'
          required
        />
        <Input
          onChange={onChange}
          name='password'
          value={password}
          placeholder='Password'
          type='password'
          required
        />
        <Input
          type='submit'
          value={loading ? 'loading...' : 'Create Account'}
        />
      </Form>
      {error !== '' ? <Error>{error}</Error> : null}
      <Switcher>
        이미 계정이 있으신가요? <Link to='/login'>Login →</Link>
      </Switcher>
    </Wrapper>
  );
};

export default CreateAccount;
