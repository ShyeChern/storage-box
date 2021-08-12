import RNFS from 'react-native-fs';

export const constant = {
	APP_NAME: 'Storage Box',
	APP: '_o9jqhIjZu6B0kju1.wdAMlj9sO2UYGyKS',
	SET_LOADING: 'SET_LOADING',
	SET_LOGIN: 'SET_LOGIN',
	DIRECTORY_PATH: RNFS.ExternalStorageDirectoryPath + '/StorageBox', // --> /storage/emulated/0/Android/StorageBox
	PINCODE_PATH: RNFS.DocumentDirectoryPath + '/pincode.txt', // --> /storage/emulated/0/Android/data/com.package.name/pincode.txt
	NOTE_PATH: RNFS.DocumentDirectoryPath + '/note.json', // --> /storage/emulated/0/Android/data/com.package.name/note.json
	PINCODE_LENGTH: 6,
	DELETE_INTERVAL_MILLISECOND: 2.592e9, // --> 2592000000
	ONE_DAY_MILLISECOND: 8.64e7, // --> 86400000
};
