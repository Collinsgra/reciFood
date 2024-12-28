import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className='about-container'>
        <header className="hero-section">
          <div className="hero-content">
            <h1>About Our <span className="accent-text">Culinary</span> Stories</h1>
          </div>
        </header>

        <section className="belief-section">
          <div className="belief-content">
            <div className="belief-text">
              <h2>We believe in the <span className="accent-text">transformative</span> power</h2>
              <h2>of cooking and good food</h2>
              <p>We are driven by a vision of endless culinary possibilities for those keen to take an opportunity to learn life.</p>
              <p>Our platform is a celebration of culinary diversity, bringing together home cooks and food enthusiasts.</p>
            </div>
            
            <div className="features-grid">
              <div className="feature-card chef-card">
                <img src="../assets/pasta.jpg" alt="Cook with Master Chefs" className="feature-image" />
                <div className="card-overlay">
                  <h3>Cook with<br />Master Chef</h3>
                </div>
              </div>
              
              <div className="feature-list">
                <div className="feature-item">
                  <div className="feature-icon">🏆</div>
                  <div className="feature-text">
                    <h4>Achievements</h4>
                    <p>Share & earn badges</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">👨‍🍳</div>
                  <div className="feature-text">
                    <h4>Live Now</h4>
                    <p>Join live session</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">📝</div>
                  <div className="feature-text">
                    <h4>Today's Recipe</h4>
                    <p>Share your recipe</p>
                  </div>
                </div>
              </div>

              <div className="testimonial-card">
                <div className="testimonial-content">
                  <h3>"ReciFOOD has always helped my cooking."</h3>
                  <div className="testimonial-author">
                    <img src="../assets/pasta.jpg" alt="User" className="author-image" />
                    <span>Collins Koch</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="stats-section">
          <div className="stat-item">
            <h3>10k +</h3>
            <p>Registered Talented Users</p>
          </div>
          <div className="stat-item">
            <h3>50+</h3>
            <p>Verified Chefs in Community</p>
          </div>
          <div className="stat-item">
            <h3>98%</h3>
            <p>User Satisfaction Rate</p>
          </div>
          <div className="stat-item">
            <h3>100+</h3>
            <p>Officially Published Recipes</p>
          </div>
        </section>

        <section className="values-section">
          <h2>Values That <span className="accent-text">Shape</span> ReciFOOD</h2>
          <div className="values-grid">
            <div className="value-card">
              <h3>User-Centered</h3>
              <p>We've built an intuitive cooking platform, ensuring a seamless experience for every culinary journey.</p>
            </div>
            <div className="value-card">
              <h3>Diverse Recipes</h3>
              <p>Explore authentic culinary traditions from around the world, inspiring you today.</p>
            </div>
            <div className="value-card">
              <h3>Fun Community</h3>
              <p>Join our vibrant cooking community where you come and share recipes with us.</p>
            </div>
          </div>
        </section>
    </div>
  );
};

export default About;