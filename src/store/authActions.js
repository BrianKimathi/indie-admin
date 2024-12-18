import { createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { setError, setLoading, logout } from './authSlice';

export const createUser = (email, password) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    // Admin creates a new user
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const login = (email, password) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    await signInWithEmailAndPassword(auth, email, password);

    // Set a session timer of 20 minutes
    setTimeout(() => {
      dispatch(logoutUser());
    }, 20 * 60 * 1000); // 20 minutes in milliseconds
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const logoutUser = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    await signOut(auth);
    dispatch(logout());
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};
