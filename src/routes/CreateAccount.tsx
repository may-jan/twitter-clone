import styled from 'styled-components';
import { useState } from 'react';

const Wrapper = styled.div`
  height: 100%;
  width: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 0px;
`;

const Title = styled.h1`
  font-size: 24px;
`;

const Form = styled.form`
  width: 100%;
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 20px;
  border-radius: 50px;
  border: none;
  box-sizing: border-box;
  font-size: 16px;
  &[type='submit'] {
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
`;

const Error = styled.span`
  font-weight: 600;
  color: tomato;
`;

const CreateAccount = () => {
  const [Loading, setLoading] = useState(false);
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

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // 1. create account
      // 2. set the name of the user profile
      // 3. redirect to the home page
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Title>Log into 🕊️</Title>
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
          value={Loading ? 'Loading...' : 'Create Account'}
        />
      </Form>
      {error !== '' ? <Error>{error}</Error> : null}
    </Wrapper>
  );
};

export default CreateAccount;
