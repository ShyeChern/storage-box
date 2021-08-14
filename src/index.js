import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import RNFS from 'react-native-fs';
import MainNavigator from 'src/routes/MainNavigator';
import CombinedContext from 'src/components/CombinedContext';
import CustomAlert from 'src/components/CustomAlert';
import Pincode from 'src/views/Pincode/Pincode';
import { constant } from 'src/utils/constants';
import { writeFile, readFile } from 'src/utils/function';
import { checkPermission } from 'src/utils/permissions';

export default function App() {
	const [isLoading, setIsLoading] = useState(true);
	const [isAuth, setAuth] = useState(false);

	useEffect(() => {
		const createDirectory = async () => {
			const existDir = await RNFS.exists(constant.DIRECTORY_PATH);
			if (!existDir) {
				RNFS.mkdir(constant.DIRECTORY_PATH).catch((err) => CustomAlert(err.message));
			}
			const [existImg, existDel] = await Promise.all([
				await RNFS.exists(constant.IMG_DIRECTORY_PATH),
				await RNFS.exists(constant.DEL_DIRECTORY_PATH),
			]);

			if (!existImg) {
				RNFS.mkdir(constant.IMG_DIRECTORY_PATH).catch((err) => CustomAlert(err.message));
			}
			if (!existDel) {
				RNFS.mkdir(constant.DEL_DIRECTORY_PATH).catch((err) => CustomAlert(err.message));
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

		const checkDeletedItem = async () => {
			let items = await readFile(constant.NOTE_PATH);
			if (!items.result) {
				CustomAlert(items.message);
			}
			// delete item that already exceed the time limit
			const now = Date.now();
			await writeFile(
				constant.NOTE_PATH,
				JSON.stringify(
					JSON.parse(items.data).filter((value) => {
						// deletedAt not null and exceed the allowed interval
						if (value.deletedAt && now - value.deletedAt > constant.DELETE_INTERVAL_MILLISECOND) {
							return false;
						}
						return true;
					}),
				),
			);
		};

		const checkPincode = async () => {
			const exist = await RNFS.exists(constant.PINCODE_PATH);
			if (!exist) {
				RNFS.writeFile(constant.PINCODE_PATH, '', 'utf8').catch((err) => {
					CustomAlert(err.message);
				});
				setAuth(true);
			} else {
				const pincode = await readFile(constant.PINCODE_PATH);
				if (!pincode.result) {
					CustomAlert(pincode.message);
				}
				// empty string = pincode not set
				if (!pincode.data) {
					setAuth(true);
				}
			}
		};

		const init = async () => {
			await checkPermission();
			// directory and pincode no need await
			createDirectory();
			checkPincode();
			// create not and check delete depend on each other
			await createNoteFile();
			await checkDeletedItem();
			setIsLoading(false);
		};

		init();
	}, []);

	if (isLoading) {
		return <ActivityIndicator style={styles.loading} size="large" color="#000" />;
	} else if (!isAuth) {
		return <Pincode setAuth={setAuth} />;
	} else {
		return (
			<CombinedContext contexts={[]}>
				<MainNavigator />
			</CombinedContext>
		);
	}
}

const styles = StyleSheet.create({
	loading: {
		flex: 1,
	},
});
