import React, { useState, useEffect } from 'react';
import {
	StyleSheet,
	Text,
	View,
	Modal,
	TouchableOpacity,
	TouchableWithoutFeedback,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { styleVar, styleBase } from 'src/assets/styles/styles';

/**
 * https://reactnative.dev/docs/alert
 * @param {boolean} isShow modal status
 * @param {function} setIsShow function to update modal
 * @param {string} title title of the modal
 * @param {array} data array of data for selection
 * @param {function} onSelect function on selection is selected
 * @param {boolean} dismissable Allow tap outside modal to close the modal
 * @returns Custom Alert
 */
export default function SelectModal({
	isShow,
	setIsShow,
	title,
	data,
	onSelect,
	dismissable = false,
}) {
	return (
		<Modal
			transparent={true}
			visible={isShow}
			onRequestClose={() => {
				setIsShow(false);
			}}
		>
			{/* Tap outside modal to close modal */}
			{dismissable ? (
				<TouchableWithoutFeedback onPress={() => setIsShow(false)}>
					<View style={styles.modalOverlay} />
				</TouchableWithoutFeedback>
			) : (
				<View style={styles.modalOverlay} />
			)}

			<View style={styles.modalContainer}>
				<View style={styles.modalView}>
					<View style={styles.modalCloseBtnView}>
						<TouchableOpacity onPress={() => setIsShow(false)}>
							<FontAwesome name="close" size={25} color="#000" />
						</TouchableOpacity>
					</View>
					<Text style={styles.modalTitle}>{title}</Text>
					{data.map((value, index) => {
						return (
							<TouchableOpacity
								key={index}
								onPress={() => onSelect(value.value)}
								style={styles.selectItem}
							>
								<Text>{value.label}</Text>
							</TouchableOpacity>
						);
					})}
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	container: {
		...styleBase.container,
	},
	modalTitle: {
		fontSize: styleVar.fonts.md,
		alignSelf: 'center',
		marginBottom: styleVar.margin.sm,
	},
	modalContainer: {
		...styleBase.center,
		...styleBase.container,
	},
	modalOverlay: {
		...styleBase.overlay,
	},
	modalView: {
		...styleBase.modal,
	},
	modalCloseBtnView: {
		alignItems: 'flex-end',
	},
	selectItem: {
		borderWidth: 1,
		padding: styleVar.padding.md,
		marginVertical: styleVar.margin.sm,
	},
});
