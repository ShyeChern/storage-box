import { Alert } from 'react-native';

/**
 * https://reactnative.dev/docs/alert
 * @param {Strring} message Message to display
 * @param {Array} buttons Array of objects with button text, onPress function etc
 * @param {String} title Title of the alert
 * @returns Custom Alert
 */
export default function CustomAlert(message, buttons = [{ text: 'OK' }], title = 'Alert') {
	return Alert.alert(title, message, buttons);
}
