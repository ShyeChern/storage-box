import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { styleVar, styleBase } from 'src/assets/styles/styles';
import { constant } from 'src/utils/constants';

/**
 * Pincode input component
 * @param {integer} index index of current pincodeInput
 * @param {array} inputRef array of pincodeInput ref
 * @param {function} setPincode function to set pincode array
 * @param {array} pincode array of pincodeInput value
 * @param {string} value value of current input value
 */
export default function PincodeInput({ index, inputRef, setPincode, pincode, value }) {
	return (
		<TextInput
			ref={(ref) => (inputRef[index] = ref)}
			style={styles.pincodeInput}
			onChangeText={(text) => {
				// input text and if cursor still within the length focus next
				pincode[index] = text;
				setPincode([...pincode]);
				if (text && index < constant.PINCODE_LENGTH - 1) {
					inputRef[index + 1].focus();
				}
			}}
			onFocus={() => {
				// focus on the last value by default
				let focusIndex = constant.PINCODE_LENGTH - 1;
				for (let i = 0; i < constant.PINCODE_LENGTH; i++) {
					// if no input, focus self
					if (!pincode[i]) {
						focusIndex = i;
						break;
					}
				}
				inputRef[focusIndex].focus();
			}}
			onKeyPress={({ nativeEvent }) => {
				if (nativeEvent.key === 'Backspace') {
					if (index !== 0) {
						if (pincode[index]) {
							// if there is input in the cursor delete it (for last value)
							pincode[index] = '';
						} else {
							// else delete previous one and focus
							pincode[index - 1] = '';
							inputRef[index - 1].focus();
						}
						setPincode([...pincode]);
					}
				}
			}}
			value={value}
			maxLength={1}
			placeholder={'\u2B24'}
			keyboardType={'number-pad'}
			secureTextEntry={true}
			textAlign={'center'}
		/>
	);
}

const styles = StyleSheet.create({
	pincodeInput: {
		...styleBase.center,
		backgroundColor: styleVar.color.light,
		fontSize: styleVar.fonts.lg,
		padding: styleVar.padding.md,
		borderWidth: 2,
	},
});
