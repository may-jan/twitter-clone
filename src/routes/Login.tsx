import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from 'firebase/auth';
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

  const onClick = async () => {
    setError('');
    await sendPasswordResetEmail(auth, email);
    setError('이메일을 확인하세요');
  };

  return (
    <Wrapper>
      <Title>
        Log into{' '}
        <svg
          width='52'
          height='42'
          viewBox='0 0 172 140'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M171.505 16.4988C165.196 19.2978 158.414 21.1887 151.297 22.0393C158.561 17.6848 164.141 10.7894 166.768 2.5726C159.968 6.60555 152.438 9.53313 144.423 11.111C138.005 4.2722 128.861 0 118.74 0C99.3084 0 83.553 15.7536 83.553 35.1852C83.553 37.9431 83.8643 40.6288 84.4646 43.204C55.2211 41.7368 29.2946 27.7282 11.9399 6.44003C8.91115 11.6367 7.17551 17.6805 7.17551 24.1292C7.17551 36.3369 13.3874 47.1066 22.8288 53.4163C17.0611 53.2336 11.6355 51.6507 6.89166 49.0155C6.88766 49.1621 6.88766 49.3096 6.88766 49.4579C6.88766 66.5056 19.0166 80.726 35.1132 83.9606C32.1608 84.765 29.0522 85.1946 25.8433 85.1946C23.576 85.1946 21.3722 84.9733 19.2232 84.5634C23.7012 98.542 36.6954 108.715 52.0931 108.998C40.0509 118.436 24.8795 124.061 8.39349 124.061C5.55335 124.061 2.75267 123.894 0 123.569C15.5719 133.553 34.067 139.378 53.9377 139.378C118.658 139.378 154.051 85.7631 154.051 39.2645C154.051 37.739 154.016 36.222 153.949 34.7119C160.823 29.7519 166.788 23.5554 171.505 16.4988Z'
            fill='#1d9bf0'
          />
        </svg>
      </Title>
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
      {error !== '' ? (
        <>
          <Error>{error}</Error>{' '}
          <Switcher onClick={onClick}>비밀번호 변경하기</Switcher>
        </>
      ) : null}

      <Switcher>
        계정이 없으신가요? <Link to='/create-account'>Create →</Link>
      </Switcher>
      <GithubBtn />
      <GoogleBtn />
    </Wrapper>
  );
};

export default Login;
