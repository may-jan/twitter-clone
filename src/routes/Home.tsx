import { auth } from '../firebase';

const Home = () => {
  const logOut = () => {
    auth.signOut();
  };

  return (
    <div>
      <button onClick={logOut}>Log Out</button>
    </div>
  );
};

export default Home;
