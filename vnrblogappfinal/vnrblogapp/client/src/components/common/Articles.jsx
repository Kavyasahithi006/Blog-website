import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {useAuth} from "@clerk/clerk-react"
function Articles() {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const {getToken}=useAuth();

  async function getArticles() {
      const token=await getToken()
      let res = await axios.get("http://localhost:3000/author-api/articles",{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
      if (res.data.message === "articles") {
        setArticles(res.data.payload);
        setError('')
      } else {
        setError(res.data.message);
      }
  }

  // Navigate to specific article
  function gotoArticleById(articleObj) {
    navigate(`../articleId/${articleObj._id}`, { state: articleObj });
}


  useEffect(() => {
    getArticles();
  }, [getToken]);

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary mb-4">Latest Articles</h2>

      {/* Display Error Message */}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
        {articles.map((articleObj) => (
          <div className="col" key={articleObj.articleId}>
            <div className="card shadow-sm h-100 border-0">
              <div className="card-body d-flex flex-column">
                {/* Author Details */}
                <div className="d-flex align-items-center mb-3">
                  <img
                    src={articleObj.authorData.profileImageUrl}
                    width="40"
                    height="40"
                    className="rounded-circle me-2 border"
                    alt="Author"
                  />
                  <p className="m-0 text-secondary small">
                    {articleObj.authorData.nameOfAuthor}
                  </p>
                </div>

                {/* Article Title */}
                <h5 className="card-title fw-bold text-dark">{articleObj.title}</h5>

                {/* Article Content Preview */}
                <p className="card-text text-muted flex-grow-1">
                  {articleObj.content.substring(0, 80) + "...."}
                </p>

                {/* Read More Button */}
                <button
                  className="btn btn-outline-primary w-100 mt-auto"
                  onClick={() => gotoArticleById(articleObj)}
                >
                  Read More
                </button>
              </div>

              {/* Footer */}
              <div className="card-footer bg-light border-0 text-muted small">
                Last updated on {articleObj.dateOfModification}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Articles;
