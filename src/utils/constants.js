import RNFS from 'react-native-fs';

export const constant = {
	APP_NAME: 'Storage Box',
	DIRECTORY_PATH: RNFS.ExternalStorageDirectoryPath + '/StorageBox', // --> /storage/emulated/0/Android/StorageBox
	IMG_DIRECTORY_PATH: RNFS.ExternalStorageDirectoryPath + '/StorageBox/img', // --> /storage/emulated/0/Android/StorageBox/img
	DEL_DIRECTORY_PATH: RNFS.ExternalStorageDirectoryPath + '/StorageBox/del', // --> /storage/emulated/0/Android/StorageBox/del
	PINCODE_PATH: RNFS.DocumentDirectoryPath + '/pincode.txt', // --> /storage/emulated/0/Android/data/com.package.name/pincode.txt
	NOTE_PATH: RNFS.DocumentDirectoryPath + '/note.json', // --> /storage/emulated/0/Android/data/com.package.name/note.json
	PINCODE_LENGTH: 6,
	DELETE_INTERVAL_MILLISECOND: 2.592e9, // --> 2592000000
	ONE_DAY_MILLISECOND: 8.64e7, // --> 86400000
	NOT_IMAGE_PLACEHOLDER: 'https://via.placeholder.com/500?text=Not%20An%20Image',
};
