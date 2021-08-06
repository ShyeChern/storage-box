import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { styleVar } from 'src/assets/styles/styles';
import { constant } from 'src/utils/constants';

export default function DrawerContent(props) {
	return (
		<DrawerContentScrollView {...props}>
			<Text style={styles.title}>{constant.APP_NAME}</Text>
			<DrawerItemList {...props} />
		</DrawerContentScrollView>
	);
}

const styles = StyleSheet.create({
	title: {
		fontSize: styleVar.fonts.lg,
		textAlign: 'center',
		paddingVertical: styleVar.padding.md,
	},
});
