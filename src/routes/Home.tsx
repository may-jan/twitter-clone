import styled from 'styled-components';
import PostTweetForm from '../components/PostTweetForm';
import TimeLine from '../components/TimeLine';

const Wrapper = styled.div`
  display: grid;
  gap: 50px;
  overflow-y: hidden;
  grid-template-rows: 1fr 5fr;
`;

const Home = () => {
  return (
    <Wrapper>
      <PostTweetForm />
      <TimeLine />
    </Wrapper>
  );
};

export default Home;
