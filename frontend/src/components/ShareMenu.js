import React, { useState } from 'react';
import { Share2, Facebook, Twitter, PhoneIcon as WhatsApp, Link2, X } from 'lucide-react';
import styles from './ShareMenu.module.css';

const ShareMenu = ({ title, url }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const shareUrl = url || window.location.href;
  const shareTitle = `Check out this recipe: ${title}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          url: shareUrl,
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error);
          setIsOpen(true); // Show fallback sharing options
        }
      }
    } else {
      setIsOpen(true); // Show fallback sharing options
    }
  };

  const shareFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
    setIsOpen(false);
  };

  const shareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
    setIsOpen(false);
  };

  const shareWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(`${shareTitle} ${shareUrl}`)}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShowCopiedMessage(true);
      setTimeout(() => setShowCopiedMessage(false), 2000);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className={styles.shareContainer}>
      <button className={styles.shareButton} onClick={handleShare}>
        <Share2 size={16} />
        Share Recipe
      </button>

      {isOpen && (
        <div className={styles.shareMenu}>
          <button className={styles.closeButton} onClick={() => setIsOpen(false)}>
            <X size={16} />
          </button>
          <h3>Share this recipe</h3>
          <div className={styles.shareOptions}>
            <button onClick={shareFacebook} className={styles.facebook}>
              <Facebook size={20} />
              Facebook
            </button>
            <button onClick={shareTwitter} className={styles.twitter}>
              <Twitter size={20} />
              Twitter
            </button>
            <button onClick={shareWhatsApp} className={styles.whatsapp}>
              <WhatsApp size={20} />
              WhatsApp
            </button>
            <button onClick={copyLink} className={styles.copyLink}>
              <Link2 size={20} />
              Copy Link
            </button>
          </div>
        </div>
      )}
      
      {showCopiedMessage && (
        <div className={styles.copiedMessage}>
          Link copied to clipboard!
        </div>
      )}
    </div>
  );
};

export default ShareMenu;