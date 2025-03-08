import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserAuthorContextObj } from "../../contexts/UserAuthorContext";
import { FaEdit } from "react-icons/fa";
import { MdDelete, MdRestore } from "react-icons/md";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

function ArticleById() {
  const { state } = useLocation();
  const { currentUser } = useContext(UserAuthorContextObj);
  const [editArticleStatus, setEditArticleStatus] = useState(false);
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [currentArticle, setCurrentArticle] = useState(state);

  function enableEdit() {
    setEditArticleStatus(true);
  }

  async function onSave(modifiedArticle) {
    try {
      console.log("Modified Article Data:", modifiedArticle);
      const token = await getToken();
      if (!token) {
        alert("Error: Unable to retrieve token.");
        return;
      }
  
      // Merge current article with modified data and add a modification date
      const articleAfterChanges = {
        ...currentArticle,
        ...modifiedArticle,
        dateOfModification: new Date().toISOString().split("T")[0],
      };
      console.log("Article After Changes:", articleAfterChanges);
  
      if (!articleAfterChanges.articleId) {
        console.error("Error: articleId is undefined!");
        alert("Error: Missing article ID.");
        return;
      }
  
      // Remove immutable fields from the payload
      const { articleId, _id, ...payload } = articleAfterChanges;
  
      const response = await axios.put(
        `http://localhost:3000/author-api/article/${articleAfterChanges.articleId}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("API Response:", response);
  
      if (response.data.message === "Article modified") {
        setEditArticleStatus(false);
        setCurrentArticle(response.data.payload);
        // Instead of redirecting, display a success message
        alert("Article updated successfully!");
      } else {
        console.error("Unexpected response:", response.data);
        alert("Article update failed: unexpected response.");
      }
    } catch (error) {
      console.error("Error updating article:", error);
      alert("Failed to update the article. Please try again.");
    }
  }
  
  

  return (
    <div className="container mt-5">
      {editArticleStatus === false ? (
        <>
          <div className="card shadow-sm p-4 mb-4">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="display-4 fw-bold text-primary">
                  {currentArticle.title}
                </h1>
                <p className="text-muted">
                  <small>
                    Created: {currentArticle.dateOfCreation} | Updated: {currentArticle.dateOfModification}
                  </small>
                </p>
              </div>
              <div className="text-center">
                <img
                  src={currentArticle.authorData.profileImageUrl}
                  width="70"
                  className="rounded-circle border border-2"
                  alt="Author"
                />
                <p className="fw-semibold mt-2">
                  {currentArticle.authorData.nameOfAuthor}
                </p>
                {currentUser.role === "author" && (
                  <div className="mt-2">
                    <button className="btn btn-outline-warning me-2" onClick={enableEdit}>
                      <FaEdit className="fs-5" />
                    </button>
                    {currentArticle.isArticleActive ? (
                      <button className="btn btn-outline-danger">
                        <MdDelete className="fs-5" />
                      </button>
                    ) : (
                      <button className="btn btn-outline-info">
                        <MdRestore className="fs-5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="card shadow-sm p-4 mb-4">
            <p className="lead text-dark">{currentArticle.content}</p>
          </div>
          <div className="card shadow-sm p-4">
            <h5 className="text-primary">Comments</h5>
            <hr />
            {currentArticle.comments.length === 0 ? (
              <p className="text-muted">No comments yet...</p>
            ) : (
              currentArticle.comments.map((commentObj) => (
                <div key={commentObj._id} className="border-bottom py-2">
                  <p className="fw-bold mb-1 text-secondary small">{commentObj?.nameOfUser}</p>
                  <p className="text-muted small">{commentObj?.comment}</p>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit(onSave)}>
          <div className="mb-4">
            <label htmlFor="title" className="form-label">Title</label>
            <input type="text" className="form-control" id="title" defaultValue={currentArticle.title} {...register("title")} />
          </div>
          <div className="mb-4">
            <label htmlFor="category" className="form-label">Select a category</label>
            <select {...register("category")} id="category" className="form-select" defaultValue={currentArticle.category}>
              <option value="technology">Technology</option>
              <option value="health">Health</option>
              <option value="education">Education</option>
              <option value="business">Business</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="form-label">Content</label>
            <textarea {...register("content")} className="form-control" id="content" rows="10" defaultValue={currentArticle.content}></textarea>
          </div>
          <div className="text-end">
            <button type="submit" className="btn btn-success">Save</button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ArticleById;
