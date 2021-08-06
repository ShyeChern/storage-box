import RNFS from 'react-native-fs';

export const constant = {
	APP_NAME: 'Storage Box',
	APP: '_o9jqhIjZu6B0kju1.wdAMlj9sO2UYGyKS',
	SET_LOADING: 'SET_LOADING',
	SET_LOGIN: 'SET_LOGIN',
	DIRECTORY_PATH: RNFS.ExternalStorageDirectoryPath + '/StorageBox', // located at --> /storage/emulated/0/Android/StorageBox
	PINCODE_PATH: RNFS.DocumentDirectoryPath + '/pincode.txt',
	NOTE_PATH: RNFS.DocumentDirectoryPath + '/note.json',
};