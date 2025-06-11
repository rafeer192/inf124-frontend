import { Link } from 'react-router-dom';
import logo from '../assets/GreenWaveLogo.png'; // adjust path if needed

function LogoLink() {
  return (
    <Link to='/'>
      <img
        src={logo}
        alt='GreenWave Logo'
        style={{ height: '220px', cursor: 'pointer',textAlign:'top-left'}}
        className='logo-img'
      />
    </Link>
  );
}
export default LogoLink;
