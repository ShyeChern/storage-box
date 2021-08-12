import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import RNFS from 'react-native-fs';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CustomAlert from 'src/components/CustomAlert';
import { styleVar, styleBase } from 'src/assets/styles/styles';
import { constant } from 'src/utils/constants';
import { sortBy, writeFile, readFile } from 'src/utils/function';
export default function ImageView({ navigation }) {
	return (
		<View>
			<Text>ImageView</Text>
			<TouchableOpacity style={styles.floatButton} onPress={() => {}}>
				<FontAwesome name="plus" size={25} color="#000" />
			</TouchableOpacity>
			<View>
				<TouchableOpacity
					onPress={() => {
						launchCamera({}, (cb) => {
							console.log(cb);
							if (cb.assets) {
								RNFS.copyFile(
									cb.assets[0].uri,
									RNFS.ExternalStorageDirectoryPath + '/StorageBox/test.jpg',
								)
									.then((success) => {
										console.log('FILE WRITTEN!');
									})
									.catch((err) => {
										console.log(err.message);
									});
							}
						});
					}}
				>
					<Text>Take photo</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => {
						launchImageLibrary({}, (cb) => {
							console.log(cb);
						});
					}}
				>
					<Text>Import</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({});
