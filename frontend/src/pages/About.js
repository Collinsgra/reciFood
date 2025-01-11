import React from 'react';
import styles from './About.css';

const About = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>About ReciFood</h1>
      <p className={styles.paragraph}>
        Welcome to <span className={styles.brand}>ReciFood</span>! Your ultimate destination for discovering,
        sharing, and enjoying delicious recipes from around the world. Whether you're a seasoned chef or
        just starting your culinary journey, ReciFood has something special for you.
      </p>
      <p className={styles.paragraph}>
        Our mission is to bring food enthusiasts together, making it easier than ever to explore diverse
        cuisines and create memorable dining experiences. With ReciFood, cooking becomes an adventure.
      </p>
      <p className={styles.paragraph}>Thank you for being a part of our community. Let's make cooking fun and flavorful!</p>
    </div>
  );
};

export default About;