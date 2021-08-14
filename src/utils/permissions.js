import { PermissionsAndroid } from 'react-native';

export const checkPermission = async () => {
	const granted = await PermissionsAndroid.requestMultiple([
		PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
		PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
	]);
	return granted;
};
