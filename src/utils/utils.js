import moment from 'moment-timezone';
import {PermissionsAndroid, Platform} from 'react-native';
import {getTimeZone} from 'react-native-localize';
import {RNFS} from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import naclUtil from 'tweetnacl-util';
import nacl from 'tweetnacl';

export async function getKeyFromStorage(key) {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (e) {
    console.error('Error fetching key from AsyncStorage:', e);
    return null; // Consider how you want to handle errors.
  }
}

export async function getKeyPair(keyType) {
  let encodedPublicKey = null;
  let encodedSecretKey = null;

  const keyPair =
    keyType === 'Encryption' ? nacl.box.keyPair() : nacl.sign.keyPair();
  encodedPublicKey = naclUtil.encodeBase64(keyPair.publicKey);
  encodedSecretKey = naclUtil.encodeBase64(keyPair.secretKey);

  await AsyncStorage.setItem(`publicKey${keyType}`, encodedPublicKey);
  await AsyncStorage.setItem(`privateKey${keyType}`, encodedSecretKey);

  return {
    publicKey: encodedPublicKey,
    secretKey: encodedSecretKey,
  };
}

export const getActiveRouteName = state => {
  const route = state.routes[state.index];
  if (route.state) {
    // Dive into nested navigators
    return getActiveRouteName(route.state);
  }
  return route.name;
};

export const getFileName = path => {
  // Split the path by "/" and take the last element of the array
  const segments = path.split('/');
  return segments.pop(); // Returns the last segment, which is the filename
};

export const getCurrentTimezone = () => {
  const timezone = getTimeZone();
  return timezone;
};

// Function to calculate time ago
export const getTimeAgo = utcTime => {
  const now = moment();
  const utcDate = moment.utc(utcTime).local();
  const duration = moment.duration(now.diff(utcDate));

  const days = duration.asDays();
  if (days >= 30) {
    return Math.floor(days / 30) + 'M'; // Months
  } else if (days >= 1) {
    return Math.floor(days) + 'd'; // Days
  } else {
    const hours = duration.asHours();
    if (hours >= 1) {
      return Math.floor(hours) + 'h'; // Hours
    } else {
      const minutes = duration.asMinutes();
      if (minutes >= 1) {
        return Math.floor(minutes) + 'm'; // Minutes
      } else {
        return '1m';
      }
    }
  }
};

export const getLabelForDate = dateParam => {
  let date = new Date(dateParam);

  const today = new Date();

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (isSameDay(date, today)) {
    return 'Today';
  } else if (isSameDay(date, yesterday)) {
    return 'Yesterday';
  } else {
    return moment(date).format('DD/MM');
  }

  // Return the date in any desired format for other sections
  // For example: return formatDate(date);
};

const isSameDay = (date1, date2) => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

export function containsOnlyEmojis(text) {
  // Attempt to match complex emojis, including those with skin tone modifiers, joiners, etc.
  const emojiPattern =
    /(\p{Extended_Pictographic})(\p{Emoji_Modifier}|\uFE0F\u200D[\p{Extended_Pictographic}\p{Emoji_Modifier}])*[\uFE0F\u200D]?/gu;

  const matches = text.match(emojiPattern) || [];
  const cleanedText = matches.join('');

  // Check if the original string is the same as the cleaned (emojis only) string
  // and there is exactly one emoji found.
  return text.trim() === cleanedText && matches.length === 1;
}

export function isOnlyEmojis(text) {
  const emojiRegexPattern =
    /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c\ude32-\ude3a]|[\ud83c\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]\ufe0f?|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;

  const matches = text.match(emojiRegexPattern);
  return matches && matches.length === Array.from(text).length;
}

export async function StoreLocalImage(imageUri, fileName) {
  // Request necessary permissions if needed (e.g., for Android)
  if (Platform.OS === 'android') {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    ]);
  }

  const picturesPath = RNFS.DocumentDirectoryPath; // Get the default pictures directory path

  //const directoryPath = `${picturesPath}/${directoryName}`; // Specify the name of your directory
  const directoryPath = picturesPath;
  // Check if the directory exists, and create it if it doesn't
  const directoryExists = await RNFS.exists(directoryPath);
  if (!directoryExists) {
    await RNFS.mkdir(directoryPath);
  }

  const destinationPath = `${directoryPath}/${fileName}`;

  try {
    // Copy the image to the destination directory
    await RNFS.copyFile(imageUri, destinationPath);
  } catch (error) {
    console.log('Error uploading image:', error);
  }
}

export function updateReactionsPostsComments(
  posts,
  {reaction, postId, commentId},
) {
  return posts.map(post => {
    if (post._id === postId) {
      // Handle reactions directly on posts
      if (!commentId) {
        const index = post.reactions.findIndex(r => r.user === reaction.user);
        if (index !== -1) {
          post.reactions[index] = reaction;
        } else {
          post.reactions = [...post.reactions, reaction];
        }
      } else {
        // Handle reactions on comments within posts
        const commentIndex = post.comments.findIndex(
          comment => comment._id === commentId,
        );
        if (commentIndex !== -1) {
          const reactionIndex = post.comments[commentIndex].reactions.findIndex(
            r => r.user === reaction.user,
          );
          if (reactionIndex !== -1) {
            post.comments[commentIndex].reactions[reactionIndex] = reaction;
          } else {
            post.comments[commentIndex].reactions = [
              ...post.comments[commentIndex].reactions,
              reaction,
            ];
          }
        }
      }
    }
    return post;
  });
}

export function updateReactionInArray(array, data) {
  // Clone the array for immutability
  const newArray = [...array];

  // Find the index of the post/note with the given _id
  const itemIndex = newArray.findIndex(
    item => item._id === data.noteId || item._id === data.postId,
  );

  if (itemIndex !== -1) {
    const item = newArray[itemIndex];

    // Find the index of the reaction with the given user id
    const reactionIndex = item.reactions.findIndex(
      r => r.user === data.reaction.user,
    );

    if (reactionIndex !== -1) {
      // User has reacted before, update the reaction
      newArray[itemIndex].reactions[reactionIndex] = data.reaction;
    } else {
      // This is a new reaction from the user, add it to the array
      newArray[itemIndex].reactions.push(data.reaction);
    }
  }

  return newArray;
}

export function updateCommentsInPosts(posts, newComment, postId) {
  return posts.map(post => {
    if (post._id === postId) {
      const commentExists = post.comments.some(
        comment => comment._id === newComment._id,
      );
      if (!commentExists) {
        return {...post, comments: [...post.comments, newComment]};
      }
    }
    return post;
  });
}

export function removeCommentFromPost(posts, commentId, postId) {
  return posts.map(post => {
    if (post._id === postId) {
      return {
        ...post,
        comments: post.comments.filter(comment => comment._id !== commentId),
      };
    }
    return post;
  });
}

export const formatRelativeTime = utcDateString => {
  const now = moment(); // Current time as a moment object

  const past = moment(utcDateString + 'Z'); // Parse the UTC date string

  const diffInSeconds = now.diff(past, 'seconds');

  // Check if the time difference is negative or less than 1 second
  if (diffInSeconds <= 0) {
    return '1s'; // Return 1 second if time is in the future or less than 1 second ago
  }

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s`;
  }

  const diffInMinutes = now.diff(past, 'minutes');
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m`;
  }

  const diffInHours = now.diff(past, 'hours');
  if (diffInHours < 24) {
    return `${diffInHours}h`;
  }

  const diffInDays = now.diff(past, 'days');
  if (diffInDays < 30) {
    return `${diffInDays}d`;
  }

  const diffInMonths = now.diff(past, 'months');
  if (diffInMonths < 12) {
    return `${diffInMonths}mo`; // Changed 'm' to 'mo' to differentiate from minutes
  }

  const diffInYears = now.diff(past, 'years');
  return `${diffInYears}y`;
};

export async function safeGetItem(key) {
  try {
    const item = await AsyncStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(
      `Error getting item from AsyncStorage with key ${key}: ${error}`,
    );
    return null;
  }
}

export async function safeSetItem(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(
      `Error setting item in AsyncStorage with key ${key}: ${error}`,
    );
  }
}

export async function getGoogleUserInfo(accessToken) {
  const response = await fetch(
    'https://www.googleapis.com/oauth2/v3/userinfo',
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const userInfo = await response.json();
  // userInfo should contain { sub, name, email, picture, ... }
  return userInfo;
}

// staging
export const googleConfig = {
  issuer: 'https://accounts.google.com',
  clientId:
    Platform.OS === 'ios'
      ? '658277377274-nev5759hjaf92n950u8adc7fdqgc79ho.apps.googleusercontent.com'
      : '658277377274-qvj9hapo9kgf0hg7h4pmjjhefdro3r1e.apps.googleusercontent.com',
  redirectUrl:
    Platform.OS === 'ios'
      ? 'com.googleusercontent.apps.658277377274-nev5759hjaf92n950u8adc7fdqgc79ho:/oauth2redirect/google'
      : 'com.closer.staging:/oauth2redirect/google',
  scopes: ['profile', 'email', 'https://www.googleapis.com/auth/drive.appdata'],
  additionalParameters: {
    access_type: 'offline',
    prompt: 'consent', // 'consent' ensures Google prompts and issues a fresh token
  },
  serviceConfiguration: {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
    revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
  },
};

// production
// export const googleConfig = {
//   issuer: 'https://accounts.google.com',
//   clientId:
//     Platform.OS === 'ios'
//       ? '658277377274-8ofjtsnhsv1s2mbf8qoebqndb686o2pv.apps.googleusercontent.com'
//       : '658277377274-7mvqg0f0il03p1ro84jjb2jndmvcsg8j.apps.googleusercontent.com',
//   redirectUrl:
//     Platform.OS === 'ios'
//       ? 'com.googleusercontent.apps.658277377274-8ofjtsnhsv1s2mbf8qoebqndb686o2pv:/oauth2redirect/google'
//       : 'com.closer.application:/oauth2redirect/google',
//   scopes: ['profile', 'email', 'https://www.googleapis.com/auth/drive.appdata'],
//   additionalParameters: {
//     access_type: 'offline',
//     prompt: 'consent', // 'consent' ensures Google prompts and issues a fresh token
//   },
//   serviceConfiguration: {
//     authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
//     tokenEndpoint: 'https://oauth2.googleapis.com/token',
//     revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
//   },
// };
