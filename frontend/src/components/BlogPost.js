import React from 'react';
import { format } from 'date-fns';
import styles from './BlogPost.module.css';

const BlogPost = ({ post }) => {
  return (
    <article className={styles.blogPost}>
      <h2 className={styles.title}>{post.title}</h2>
      <div className={styles.meta}>
        <span className={styles.author}>By {post.author.name}</span>
        <span className={styles.date}>
          {format(new Date(post.publishDate), 'MMMM d, yyyy')}
        </span>
      </div>
      <div className={styles.content} dangerouslySetInnerHTML={{ __html: post.content }} />
      {post.tags && post.tags.length > 0 && (
        <div className={styles.tags}>
          {post.tags.map((tag, index) => (
            <span key={index} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
};

export default BlogPost;