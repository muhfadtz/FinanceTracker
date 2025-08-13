import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const Timestamp = firebase.firestore.Timestamp;

export const formatDate = (date: firebase.firestore.Timestamp | Date | undefined, locale: string = 'id-ID') => {
  if (!date) return '';
  
  const dateObj = date instanceof Timestamp ? date.toDate() : date;
  
  return dateObj.toLocaleDateString(locale, {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};
