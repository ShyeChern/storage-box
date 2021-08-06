import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';

export default function Login() {
	return (
		<View>
			<Text>Storage Box</Text>
			<Text>Enter Pincode</Text>
			<TouchableOpacity>
				<Text>Login</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({});
