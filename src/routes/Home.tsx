import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const Home = () => {
  const navigate = useNavigate();

  const logOut = () => {
    auth.signOut();
    navigate('/login');
  };

  return (
    <div>
      <button onClick={logOut}>Log Out</button>
    </div>
  );
};

export default Home;
