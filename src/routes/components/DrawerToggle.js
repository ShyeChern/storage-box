import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { styleVar } from 'src/assets/styles/styles';
/**
 * Nested navigator with drawer on top
 * Drawer stack first screen's left header is overrided with toggle drawer icon
 */

export default function DrawerToggle({ navigation, ...rest }) {
	return (
		<TouchableOpacity
			{...rest}
			onPress={() => {
				navigation.toggleDrawer();
			}}
			style={styles.drawerToggle}
		>
			<FontAwesome name="navicon" size={25} color="#000" />
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	drawerToggle: {
		marginLeft: styleVar.margin.md,
	},
});
