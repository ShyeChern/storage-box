import React, { useState, useEffect } from 'react';
import {
	StyleSheet,
	Text,
	View,
	TouchableWithoutFeedback,
	TouchableOpacity,
	Keyboard,
} from 'react-native';
import PincodeInput from 'src/views/Pincode/component/PincodeInput';
import { styleVar, styleBase } from 'src/assets/styles/styles';
import CustomAlert from 'src/components/CustomAlert';
import base64 from 'base-64';
import { constant } from 'src/utils/constants';
import { readFile } from 'src/utils/function';

/**
 * Pincode screen on landing
 * @param {function} setAuth setAuth function from index
 */
export default function Pincode({ setAuth }) {
	const [pincodeInput, setPincodeInput] = useState(new Array(constant.PINCODE_LENGTH).fill(''));
	const [pincode, setPincode] = useState('');
	const inputRef = [];

	useEffect(() => {
		const getPincode = async () => {
			const prevPin = await readFile(constant.PINCODE_PATH);
			if (!prevPin.result) {
				CustomAlert(prevPin.message);
			}
			setPincode(prevPin.data);
		};
		getPincode();
	}, []);

	const confirmPincode = () => {
		const pin = pincodeInput.join('');
		if (pin.length !== 6) {
			CustomAlert('Please input pincode');
			return;
		}

		if (base64.decode(pincode) !== pin) {
			CustomAlert('Incorrect pincode');
			return;
		}
		setAuth(true);
	};

	return (
		<View style={styles.container}>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View style={styles.container}>
					<Text style={styles.pincodeTitle}>Enter Pincode</Text>
					<View style={styles.pincodeInputView}>
						{pincodeInput.map((value, index) => (
							<PincodeInput
								key={index}
								index={index}
								inputRef={inputRef}
								setPincode={setPincodeInput}
								pincode={pincodeInput}
								value={value}
							/>
						))}
					</View>
					<TouchableOpacity style={styles.confirmBtn} onPress={() => confirmPincode()}>
						<Text style={styles.confirmBtnText}>Confirm</Text>
					</TouchableOpacity>
				</View>
			</TouchableWithoutFeedback>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		...styleBase.container,
		...styleBase.center,
	},
	pincodeTitle: {
		fontSize: styleVar.fonts.lg,
	},
	pincodeInputView: {
		...styleBase.center,
		margin: styleVar.margin.md,
		flexDirection: 'row',
	},
	pincodeInput: {
		...styleBase.center,
		backgroundColor: styleVar.color.light,
		fontSize: styleVar.fonts.lg,
		padding: styleVar.padding.md,
		borderWidth: 2,
	},
	confirmBtn: {
		...styleBase.btn,
		alignSelf: 'center',
		backgroundColor: styleVar.color.info,
	},
	confirmBtnText: {
		...styleBase.btnText,
	},
});
