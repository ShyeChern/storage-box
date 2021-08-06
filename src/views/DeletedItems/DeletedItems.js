import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function DeletedItem({ navigation }) {
	return (
		<View>
			<TouchableOpacity onPress={() => navigation.navigate('Pincode')}>
				<Text>Deleted Items</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({});
