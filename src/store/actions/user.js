import AsyncStorage from '@react-native-async-storage/async-storage';
export const USER_DETAIL = 'USER_DETAIL';
export const USER_MODALRENAME = 'USER_MODALRENAME';

export const getUser = () => {
   return async (dispatch, getState) => {
      try {
         const getUserName = await AsyncStorage.getItem('user')
         dispatch({ type: USER_DETAIL, userName: getUserName });
      } catch (error) {
         console.log(error)
      }
   }
}

export const addUser = (name) => {
   return async (dispatch, getState) => {
      try {
         await AsyncStorage.setItem('user', name)
         dispatch({ type: USER_DETAIL, userName: name });
      } catch (error) {
         console.log(error)
      }
   }
}

export const showRenameModal = () => {
   return async (dispatch, getState) => {
      dispatch({ type: USER_MODALRENAME, showModal: true });
   }
}