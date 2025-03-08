import {useContext,useEffect,useState} from 'react'
import {UserAuthorContextObj} from '../../contexts/UserAuthorContext'
import {useUser} from '@clerk/clerk-react'
import axios from 'axios';
import {useNavigate} from 'react-router-dom'
function Home() {
  const {currentUser,setCurrentUser}=useContext(UserAuthorContextObj)
  const {isSignedIn,user,isLoaded}=useUser()
  const [error,setError]=useState("");
  const navigate=useNavigate();
  console.log("isSignedIn:",isSignedIn)
  console.log("User:",user)
  console.log("isLolded:",isLoaded)
  async function onSelectRole(e){
    setError('')
    const selectedRole=e.target.value;
    currentUser.role=selectedRole;
    let res=null;
    if(selectedRole=='author'){
          res=await axios.post('http://localhost:3000/author-api/author',currentUser)
          let {message,payload}=res.data;
          if(message=='author'){
            setCurrentUser({...currentUser,...payload})
          }
          else{
            setError(message);
          }
    }
    if(selectedRole=='user'){
      res=await axios.post('http://localhost:3000/user-api/user',currentUser)
      let {message,payload}=res.data;
      if(message=='user'){
        setCurrentUser({...currentUser,...payload})
      }
      else{
        setError(message);
      }
    }
  }
  useEffect(()=>{
    if(isSignedIn==true){
   setCurrentUser({
    ...currentUser,
    firstName:user.firstName,
    lastName:user.lastName,
    email:user.emailAddresses[0].emailAddress,
    profileImageUrl:user.imageUrl,
   });
  }
  },[isLoaded])
  useEffect(()=>{
    if(currentUser?.role=='user'&&error.length==0){
      navigate('/user-profile/${currentUser.email}');
    }
    if(currentUser?.role=='author'&&error.length==0){
      navigate('/author-profile/${currentUser.email}');
    }
  },[currentUser?.role]);

  return (
    <div className='container'>
      {
        isSignedIn==false&&<div>
          <p className="lead">Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia, nam?</p>
          <p className="lead">Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia, nam?</p>
          <p className="lead">Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia, nam?</p>
          </div>
      }
      {
        isSignedIn==true&&
        <div>
        <div className='d-flex justify-content-evenly align-items-center bg-info p-3 '>
                <img src={user.imageUrl} width="100px" className='rounded-circle' alt=""/>
                <p className="display-6">{user.firstName}</p>
          </div>
          <p className="lead">SELECT ROLE</p>
          {
            error.length!=0&&(
              <p
              className="text-danger fs-5"
              style={{fontFamily:'sans-serif'}}
              >
              {error}
              </p>
            )
          }
          <div className='d-flex role-radio py-3 justify-content-center bg-secondary'>
            <div className="form-check me-4">
              <input type="radio" name="role" id="author" value="author" className="form-check-input" onChange={onSelectRole}/>
              <label htmlFor="author" className="form-check-label">Author</label>
              </div>
              <div className="form-check">
              <input type="radio" name="role" id="user" value="user" className="form-check-input" onChange={onSelectRole}/>
              <label htmlFor="userr" className="form-check-label">user</label>
              </div>

            </div>
          </div>
      }
    </div>
  )
}

export default Home