import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';

export default function Pincode({ navigation }) {
	return (
		<View>
			<TouchableOpacity onPress={() => navigation.navigate('Home')}>
				<Text>Pincode</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({});
