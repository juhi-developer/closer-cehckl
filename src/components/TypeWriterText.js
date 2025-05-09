import React, {useEffect, useState} from 'react';
import {Text} from 'react-native';
import {fonts} from '../styles/fonts';
import {colors} from '../styles/colors';

const TypewriterText = ({
  text,
  typingDelay = 100,
  deletingDelay = 100,
  onFinish,
}) => {
  const [visibleText, setVisibleText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!isDeleting) {
      if (index < text.length) {
        setTimeout(() => {
          setVisibleText(prev => prev + text.charAt(index));
          setIndex(index + 1);
        }, typingDelay);
      } else {
        setTimeout(() => setIsDeleting(true), 1000); // Wait a bit before starting to delete
      }
    } else {
      if (index > 0) {
        setTimeout(() => {
          const lastSpace = text.substring(0, index).lastIndexOf(' ');
          setVisibleText(text.substring(0, lastSpace));
          setIndex(lastSpace);
        }, deletingDelay);
      } else {
        setTimeout(() => setIsDeleting(false), 1000); // Wait a bit before typing again
        setIndex(0);
      }
    }

    if (!isDeleting && index === text.length) {
      setTimeout(() => setIsDeleting(true), 1000); // Starts deleting after finishing typing
    } else if (isDeleting && index === 0) {
      onFinish && onFinish(); // Call onFinish when deletion is done
    }
  }, [index, isDeleting]);

  return (
    <Text
      style={{
        fontFamily: fonts.playFairSemiBold,
        fontSize: 28,
        color: colors.white,
      }}>
      {visibleText}
    </Text>
  );
};

export default TypewriterText;
