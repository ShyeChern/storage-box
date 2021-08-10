import React, { useState, useEffect } from 'react';
import {
	StyleSheet,
	Text,
	View,
	ActivityIndicator,
	TouchableWithoutFeedback,
	TouchableOpacity,
	TextInput,
	Keyboard,
} from 'react-native';
import PincodeInput from 'src/views/Pincode/component/PincodeInput';
import { styleVar, styleBase } from 'src/assets/styles/styles';
import CustomAlert from 'src/components/CustomAlert';
import base64 from 'base-64';
import { constant } from 'src/utils/constants';
import { writeFile, readFile } from 'src/utils/function';

export default function Pincode({ navigation }) {
	const [pincode, setPincode] = useState(new Array(constant.PINCODE_LENGTH).fill(''));
	const [prevPincode, setPrevPincode] = useState('');
	const [prevPincodeConfirmation, setPrevPincodeConfirmation] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const inputRef = [];

	useEffect(() => {
		const getPrevPincode = async () => {
			const prevPin = await readFile(constant.PINCODE_PATH);
			if (!prevPin.result) {
				CustomAlert(prevPin.message);
			}
			setPrevPincode(prevPin.data);
			setIsLoading(false);
		};
		getPrevPincode();
	}, [isLoading]);

	const updatePincode = async () => {
		Keyboard.dismiss();
		const pin = pincode.join('');
		if (pin.length !== 6) {
			CustomAlert('Please input pincode');
			return;
		}

		//  prev pincode is set and not yet verify
		if (prevPincode && !prevPincodeConfirmation) {
			if (base64.decode(prevPincode) !== pin) {
				CustomAlert('Incorrect previous pincode');
			} else {
				setPrevPincodeConfirmation(true);
				setPincode(new Array(constant.PINCODE_LENGTH).fill(''));
			}
			return;
		}

		const result = await writeFile(constant.PINCODE_PATH, base64.encode(pin));
		if (result.result) {
			CustomAlert('Update pincode successfully');
			setIsLoading(true);
			setPrevPincodeConfirmation(false);
			setPincode(new Array(constant.PINCODE_LENGTH).fill(''));
		} else {
			CustomAlert(result.message);
		}
	};

	const removePincode = async () => {
		Keyboard.dismiss();
		setPincode(new Array(constant.PINCODE_LENGTH).fill(''));
		setPrevPincodeConfirmation(false);
		const result = await writeFile(constant.PINCODE_PATH, '');
		if (result.result) {
			CustomAlert('Remove pincode successfully');
			setIsLoading(true);
			setPrevPincodeConfirmation(false);
			setPincode(new Array(constant.PINCODE_LENGTH).fill(''));
		} else {
			CustomAlert(result.message);
		}
	};

	return (
		<View style={styles.container}>
			{isLoading ? (
				<ActivityIndicator size="large" color="#000" />
			) : (
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<View style={styles.container}>
						<Text style={styles.pincodeTitle}>
							{prevPincode && !prevPincodeConfirmation
								? 'Enter previous pincode'
								: 'Setup new pincode'}
						</Text>
						<View>
							<View style={styles.pincodeInputView}>
								{pincode.map((value, index) => (
									<PincodeInput
										key={index}
										index={index}
										inputRef={inputRef}
										setPincode={setPincode}
										pincode={pincode}
										value={value}
									/>
								))}
							</View>
							<View style={styles.btnView}>
								{prevPincodeConfirmation && (
									<TouchableOpacity
										style={styles.cancelBtn}
										onPress={() => {
											Keyboard.dismiss();
											setPincode(new Array(constant.PINCODE_LENGTH).fill(''));
											setPrevPincodeConfirmation(false);
										}}
									>
										<Text style={styles.cancelBtnText}>Cancel</Text>
									</TouchableOpacity>
								)}
								<TouchableOpacity style={styles.confirmBtn} onPress={() => updatePincode()}>
									<Text style={styles.confirmBtnText}>Confirm</Text>
								</TouchableOpacity>
							</View>
							{prevPincodeConfirmation && (
								<TouchableOpacity style={styles.deleteBtn} onPress={() => removePincode()}>
									<Text style={styles.cancelBtnText}>Remove Pincode</Text>
								</TouchableOpacity>
							)}
						</View>
					</View>
				</TouchableWithoutFeedback>
			)}
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
	btnView: {
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
	confirmBtn: {
		...styleBase.btn,
		alignSelf: 'center',
		backgroundColor: styleVar.color.info,
	},
	cancelBtn: {
		...styleBase.btn,
		alignSelf: 'center',
		backgroundColor: styleVar.color.secondary,
	},
	deleteBtn: {
		...styleBase.btn,
		alignSelf: 'center',
		backgroundColor: styleVar.color.danger,
	},
	confirmBtnText: {
		...styleBase.btnText,
	},
	cancelBtnText: {
		...styleBase.btnText,
		color: styleVar.color.light,
	},
});
