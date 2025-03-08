import React,{useContext} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {useClerk,useUser} from '@clerk/clerk-react'
import { UserAuthorContextObj } from '../../contexts/UserAuthorContext'
function Header() {
  const {signOut}=useClerk()
  const {isSignedIn,user,isLoaded}=useUser()
  const {currentUser,setCurrentUser}=useContext(UserAuthorContextObj)
  const navigate=useNavigate();
  async function handleSignout(){
      await signOut();
      setCurrentUser(null)
      navigate('/')
  }
  return (
    <div>
      <nav className='d-flex justify-content-between align-items-center'>
        <div className="d-flex justify-content-center">
          <Link href='/'>
          <img src='data:image/jpeg;base64,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' alt="" width="50px" className="ms-4"/>
          </Link>
        </div>
       <ul className='text-white d-flex justify-content-center list-unstyled'>
        {
          !isSignedIn?
          <>
          <li>
          <Link to=''className="link me-4">HOME</Link>
        </li>
        <li>
          <Link to='signin' className="link me-4">SIGNIN</Link>
        </li>
        <li>
          <Link to='signup' className="link me-4">SIGNUP</Link>
        </li>
          </>:
          <div className='user-button'>
            <div style={{position:'relative'}}>
                    <img src={user.imageUrl} width='40px' className='rounded-circle' alt=""/>
                    <p className='role' style={{position:'absolute',top:"0px",right:"-20px"}}>{currentUser.role}</p>
            </div>
            <p className='mb-0 user-name' >{user.firstName}</p>
            <button className="btn btn-danger" onClick={handleSignout}>Signout</button>
          </div>
        }

       </ul>
       </nav>
    </div>
  )
}

export default Header