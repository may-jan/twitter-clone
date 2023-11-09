import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import {
  Error,
  Form,
  Input,
  Switcher,
  Title,
  Wrapper,
} from '../components/AuthComponents';
import GithubBtn from '../components/GithubBtn';
import GoogleBtn from '../components/GoogleBtn';

interface ErrorMsg {
  [code: string]: string;
}

const errorMsg: ErrorMsg = {
  'auth/invalid-login-credentials': '잘못된 로그인 정보입니다',
  'auth/user-not-found': '일치하는 사용자를 찾을 수 없습니다.',
  'auth/wrong-password': '비밀번호가 일치하지 않습니다.',
  'too-many-requests': '요청 수가 초과하였습니다. 관리자에게 문의하세요.',
};

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;

    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError('');
    if (loading || email === '' || password === '') return;
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      // redirect to the home page
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

  console.log(location.origin);
  return (
    <Wrapper>
      <Title>Log into 🕊️</Title>
      <Form onSubmit={onSubmit}>
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
        <Input type='submit' value={loading ? 'loading...' : 'Login'} />
      </Form>
      {error !== '' ? <Error>{error}</Error> : null}
      <Switcher>
        계정이 없으신가요? <Link to='/create-account'>Create →</Link>
      </Switcher>
      <GithubBtn />
      <GoogleBtn />
    </Wrapper>
  );
};

export default Login;
