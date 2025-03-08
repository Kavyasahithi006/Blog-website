import {useContext} from 'react'
import {useForm} from 'react-hook-form';
import axios from 'axios';
import { UserAuthorContextObj } from '../../contexts/UserAuthorContext';
import {useNavigate} from 'react-router-dom';
function PostArticle() {
  const {register,handleSubmit,formState:{errors}}=useForm()
  const {currentUser}=useContext(UserAuthorContextObj)
  const navigate=useNavigate()
  async function postArticle(articleObj){
    //create article obj as per article schema
    const authorData={
      nameOfAuthor:currentUser.firstName,
      email:currentUser.email,
      profileImageUrl:currentUser.profileImageUrl
    }
    articleObj.authorData=authorData;
    //article id(timestamp)
    articleObj.articleId=Date.now();
    //add date of creation and date of modification
     let currentDate=new Date();
     articleObj.dateOfCreation=currentDate.getDate()+"-"+currentDate.getMonth()+"-"+currentDate.getFullYear()+" "+currentDate.toLocaleTimeString("en-US",{hour12:true})
     articleObj.dateOfModification=currentDate.getDate()+"-"+currentDate.getMonth()+"-"+currentDate.getFullYear()+" "+currentDate.toLocaleTimeString("en-US",{hour12:true})
     //add comments array
     articleObj.comments=[];
     //add article active state
     articleObj.isArticleActive=true;
    //make http post req to create new article in backend
    let res=await axios.post('http://localhost:3000/author-api/article',articleObj)
    if(res.status==201){
      navigate(`/author-profile/${currentUser.email}/articles`)
    }
    else{
      //set error
    }
  }
  return (
    <div className="container mt-4 p-4 shadow-lg rounded bg-white">
      <h2 className="text-center text-warning fw-bold">Write an Article</h2>
      <form onSubmit={handleSubmit(postArticle)} className="mt-3">
        <div className="mb-3">
          <label className="form-label fw-bold">Title</label>
          <input 
            type="text" 
            className="form-control" 
            {...register("title", { required: "Title is required" })} 
          />
          {errors.title && <p className="text-danger">{errors.title.message}</p>}
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Select a Category</label>
          <select className="form-select" {...register("category", { required: "Category is required" })}>
            <option value="">-- Select Category --</option>
            <option value="Technology">Technology</option>
            <option value="Health">Health</option>
            <option value="Education">Education</option>
            <option value="Business">Business</option>
          </select>
          {errors.category && <p className="text-danger">{errors.category.message}</p>}
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Content</label>
          <textarea 
            className="form-control" 
            rows="5" 
            {...register("content", { required: "Content is required" })} 
          />
          {errors.content && <p className="text-danger">{errors.content.message}</p>}
        </div>

        <div className="text-end">
          <button type="submit" className="btn btn-success px-4">Post</button>
        </div>
        </form>
    </div>
  );
}

export default PostArticle