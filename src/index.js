import 'react-native-gesture-handler';
import React, { useState, useEffect, useReducer, useMemo, Suspense } from 'react';
import { StyleSheet, ActivityIndicator, Text, View, TouchableOpacity } from 'react-native';
import RNFS from 'react-native-fs';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import MainNavigator from 'src/routes/MainNavigator';
import CombinedContext from 'src/components/CombinedContext';
import { appInitialState, appReducer, appContext } from 'src/components/hooks/app';
import base64 from 'base-64';
import { constant } from 'src/utils/constants';
import CustomAlert from 'src/components/CustomAlert';
import Pincode from 'src/views/Pincode/Pincode';

export default function App() {
	const [appState, dispatchApp] = useReducer(appReducer, appInitialState);
	const [isLoading, setIsLoading] = useState(true);
	const [isAuth, setAuth] = useState(false);

	const appContextValue = useMemo(() => {
		return { appState, dispatchApp };
	}, [appState, dispatchApp]);

	useEffect(() => {
		const createDirectory = async () => {
			const exist = await RNFS.exists(constant.DIRECTORY_PATH);
			if (!exist) {
				RNFS.mkdir(constant.DIRECTORY_PATH).catch((err) => CustomAlert(err.message));
			}
		};

		const createNoteFile = async () => {
			const exist = await RNFS.exists(constant.NOTE_PATH);
			if (!exist) {
				RNFS.writeFile(constant.NOTE_PATH, JSON.stringify([]), 'utf8').catch((err) => {
					CustomAlert(err.message);
				});
			}
		};

		const checkPincode = async () => {
			const exist = await RNFS.exists(constant.PINCODE_PATH);
			if (exist) {
				const pincode = await RNFS.readFile(constant.PINCODE_PATH).catch((e) => console.log(e));
				console.log(pincode);
			} else {
				setAuth(true);
			}
			setIsLoading(false);
		};
		createDirectory();
		createNoteFile();
		checkPincode();
	});
	useEffect(() => {
		// base64
		// console.log(base64.encode('1234'));
		// console.log(base64.decode('MTIzNA=='));

		// check directory then create directory
		// /storage/emulated/0/Android/StorageBox
		// RNFS.exists(RNFS.ExternalStorageDirectoryPath + '/StorageBox').then((exist) =>
		// 	console.log(exist, 'exist'),
		// );
		// var path = RNFS.ExternalStorageDirectoryPath + '/StorageBox/fsfile.txt';

		// RNFS.mkdir(RNFS.ExternalStorageDirectoryPath + '/StorageBox')
		// 	.then((cb) => {
		// 		console.log(cb);
		// 	})
		// 	.catch((e) => console.log(e));

		// write the file
		// RNFS.writeFile(path, 'Lorem ipsum dolor sit amet', 'utf8')
		// 	.then((success) => {
		// 		console.log('FILE WRITTEN!');
		// 	})
		// 	.catch((err) => {
		// 		console.log(err.message);
		// 	});

		return () => {};
	}, []);
	if (isLoading) {
		return <ActivityIndicator style={styles.loading} size="large" color="#000" />;
	} else if (!isAuth) {
		return <Pincode />;
	} else {
		return (
			// send array of context to custom component to create layers of context
			// <CombinedContext contexts={[{ context: appContext, value: appContextValue }]}>
			<CombinedContext contexts={[]}>
				<MainNavigator />
			</CombinedContext>
		);
	}

	// return (
	// 	<View>
	// 		<Text>Hi</Text>
	// 		<SimpleLineIcons name="graph" size={30} color="#000000" onPress={() => alert('ewer')} />
	// 		<TouchableOpacity
	// 			onPress={() => {
	// 				launchCamera({}, (cb) => {
	// 					console.log(cb);
	// 					if (cb.assets) {
	// 						RNFS.copyFile(
	// 							cb.assets[0].uri,
	// 							RNFS.ExternalStorageDirectoryPath + '/StorageBox/test.jpg',
	// 						)
	// 							.then((success) => {
	// 								console.log('FILE WRITTEN!');
	// 							})
	// 							.catch((err) => {
	// 								console.log(err.message);
	// 							});
	// 					}
	// 				});
	// 			}}
	// 		>
	// 			<Text>Camera</Text>
	// 		</TouchableOpacity>
	// 		<TouchableOpacity
	// 			onPress={() => {
	// 				launchImageLibrary({}, (cb) => {
	// 					console.log(cb);
	// 				});
	// 			}}
	// 		>
	// 			<Text>Image</Text>
	// 		</TouchableOpacity>
	// 	</View>
	// );
}

const styles = StyleSheet.create({
	loading: {
		flex: 1,
	},
});
