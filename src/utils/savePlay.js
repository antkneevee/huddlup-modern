import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default async function savePlayToFirestore(userId, playData) {
  if (!userId || !playData?.id) {
    throw new Error('userId and playData with an id are required');
  }
  const playRef = doc(db, 'users', userId, 'plays', playData.id);
  await setDoc(playRef, playData);
}
