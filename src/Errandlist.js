import React, {useEffect, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import HorizonLine from './horzline';
import "./listdot.css";


function PostList() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await axios.get('http://localhost:3001/Errandlist');
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }

    fetchPosts();
  }, []);

  function getStatusTextAndColor(post) {
    const currentTime = new Date();
    const postTime = new Date(post.ernd_vtime); 
  
    if (postTime < currentTime) { 
      return { text: "유효기간 만료", color: "gray" };
    }
    if (post.ernd_acpt) {
      return { text: "심부름 완료", color: "red" };
    }
    if (post.Customer_csm_id !== null) {
      return { text: "심부름 진행중", color: "orange" };
    }
    return { text: "심부름 진행 가능", color: "blue" };
  }

  return (
    <div>
      <div style={{ textAlign: 'right' }}>
        <Link to="/" style={{ padding: '10px', borderRadius: '5px', background: '#f0f0f0', textDecoration: 'none', color: 'black' }}>
          메인으로
        </Link>
      </div>
      <h2>심부름 목록</h2>
      <ul>
        {posts.slice().reverse().map(post => {
          const { text, color } = getStatusTextAndColor(post);
          return (
            <li className="nodot" key={post.ernd_no}>
              <Link to={`/post/${post.ernd_no}`}>
                {post.ernd_no}<br />
                <strong>{post.ernd_title}</strong><br />
                작성자 : {post.csm_id} / {post.ernd_pos} · <br />
                유효기간 : {post.ernd_vtime} 까지<br />
                <br></br>
                <span style={{ color: color }}>{text}</span>  {/* 상태 텍스트 추가 */}
              </Link>
              <HorizonLine/>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default PostList;