import React,{createContext,useState} from 'react'
export const UserAuthorContextObj=createContext();

function UserAuthorProvider({children}) {
    const [currentUser,setCurrentUser]=useState({
           firstName:'',
           lastName:"",
           email:"",
           profileImageUrl:'',
           role:''
    });
  return (
    <UserAuthorContextObj.Provider value={{currentUser,setCurrentUser}}>
        {children}
    </UserAuthorContextObj.Provider>
  );
}

export default UserAuthorProvider;