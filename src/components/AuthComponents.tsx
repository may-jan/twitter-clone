import styled from 'styled-components';

export const Wrapper = styled.div`
  height: 100%;
  width: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 0px;
`;

export const Title = styled.h1`
  font-size: 24px;
`;

export const Form = styled.form`
  width: 100%;
  margin-top: 50px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Input = styled.input`
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

export const Error = styled.span`
  font-weight: 600;
  color: tomato;
`;

export const Switcher = styled.span`
  margin-top: 20px;
  a {
    color: #1d9bf0;
  }
`;
