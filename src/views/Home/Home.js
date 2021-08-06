import React, { useState, useEffect } from 'react';
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	TouchableWithoutFeedback,
	SafeAreaView,
	FlatList,
	TextInput,
	Modal,
} from 'react-native';
import RNFS from 'react-native-fs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Swipeable } from 'react-native-gesture-handler';
import { styleVar, styleBase } from 'src/assets/styles/styles';
import CustomAlert from 'src/components/CustomAlert';
import { constant } from 'src/utils/constants';
import { sortBy } from 'src/utils/function';

export default function Home({ navigation }) {
	const [isLoading, setIsLoading] = useState(true);
	const [itemText, setItemText] = useState('');
	const [selectedItem, setSelectedItem] = useState({});
	const [isEdit, setIsEdit] = useState(false);
	const [itemList, setItemList] = useState([]);
	const [itemRef, setItemRef] = useState([]);
	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		getItemList();
	}, [isLoading]);

	const getItemList = () => {
		setItemRef([]);
		RNFS.readFile(constant.NOTE_PATH)
			.then((result) => {
				setItemList(JSON.parse(result).sort(sortBy('lastUpdate', true)));
			})
			.catch((err) => {
				CustomAlert(err.message);
			});
		setIsLoading(false);
	};

	const addItem = () => {
		if (!itemText) {
			CustomAlert('Please input note');
			return;
		}
		const currentItem = [...itemList];
		currentItem.push({
			id: Date.now(),
			note: itemText,
			lastUpdate: Date.now(),
		});
		writeFile(currentItem, 'Add item success');
		setItemText('');
		setShowModal(false);
	};

	const editItem = () => {
		if (!isEdit) {
			setIsEdit(true);
			setItemText(selectedItem.note);
		} else {
			const newArray = itemList.filter((value) => value.id !== selectedItem.id);
			selectedItem.note = itemText;
			selectedItem.lastUpdate = Date.now();
			newArray.push(selectedItem);
			writeFile(newArray, 'Edit item success');
			setIsEdit(false);
			setItemText('');
			setShowModal(false);
		}
	};

	const deleteItem = (id) => {
		writeFile(
			itemList.filter((value) => value.id !== id),
			'Delete item success',
		);
	};

	const writeFile = (array, successMessage) => {
		// Android 10 Issue - workaround by delete the original file first #ISSUE-002
		RNFS.unlink(constant.NOTE_PATH).then(() => {
			RNFS.writeFile(constant.NOTE_PATH, JSON.stringify(array), 'utf8')
				.then(() => {
					CustomAlert(successMessage);
					setIsLoading(true);
				})
				.catch((err) => {
					CustomAlert(err.message);
				});
		});
	};

	const renderLeftActions = (progress, dragX) => {
		return (
			<View style={styles.deleteView}>
				<Text style={styles.deleteViewText}>Delete</Text>
			</View>
		);
	};
	return (
		<View style={styles.container}>
			<SafeAreaView style={styles.container}>
				<FlatList
					data={itemList}
					onRefresh={() => getItemList()}
					refreshing={isLoading}
					renderItem={({ item, index }) => (
						<Swipeable
							ref={(ref) => (itemRef[index] = ref)}
							renderRightActions={renderLeftActions}
							overshootRight={false}
							onSwipeableRightOpen={() => {
								CustomAlert('Confirm to delete this item?', [
									{ text: 'Cancel' },
									{
										text: 'Okay',
										onPress: () => {
											deleteItem(item.id);
										},
									},
								]);
								itemRef[index].close();
							}}
						>
							<TouchableOpacity
								style={styles.itemView}
								onPress={() => {
									setSelectedItem(item);
									setShowModal(true);
								}}
							>
								<Text style={styles.itemText}>
									{item.note.length > 300 ? `${item.note.substr(0, 300)} ...` : item.note}
								</Text>
								<Text style={styles.lastUpdate}>{new Date(item.lastUpdate).toDateString()}</Text>
							</TouchableOpacity>
						</Swipeable>
					)}
					keyExtractor={(item) => item.id}
					initialNumToRender={5}
					maxToRenderPerBatch={10}
					ListHeaderComponent={() => (
						<View style={styles.listHeaderView}>
							<Text style={styles.listHeaderText}>Item List</Text>
						</View>
					)}
					ListEmptyComponent={() =>
						!isLoading &&
						itemList.length === 0 && (
							<Text style={styles.listEmpty}>No item saved in your list</Text>
						)
					}
					ListFooterComponent={() =>
						itemList.length > 0 && <Text style={styles.listFooter}>End of List</Text>
					}
				/>
			</SafeAreaView>

			{/* Add, Edit & View Modal */}
			<Modal
				transparent={true}
				visible={showModal}
				onRequestClose={() => {
					setShowModal(false);
				}}
			>
				{/* Tap outside modal to close modal */}
				<TouchableWithoutFeedback onPress={() => setShowModal(false)}>
					<View style={styles.modalOverlay} />
				</TouchableWithoutFeedback>

				<View style={styles.modalContainer}>
					<View style={styles.modalView}>
						<View style={styles.modalCloseBtnView}>
							<TouchableOpacity onPress={() => setShowModal(false)}>
								<FontAwesome name="close" size={25} color="#000" />
							</TouchableOpacity>
						</View>

						{/* No selected item = add item */}
						{/* Edit/Add Item or View Item */}
						{isEdit || Object.keys(selectedItem).length === 0 ? (
							<View style={styles.itemInput}>
								<TextInput
									onChangeText={setItemText}
									value={itemText}
									editable={true}
									placeholder="Enter your note here..."
									multiline={true}
									numberOfLines={7}
								/>
							</View>
						) : (
							// Text justify with selectable align issue #ISSUE-001
							<Text selectable style={styles.itemText}>
								{selectedItem.note}
							</Text>
						)}

						{/* Show add or edit button base on condition */}
						{Object.keys(selectedItem).length === 0 ? (
							<TouchableOpacity style={styles.itemAddBtn} onPress={addItem}>
								<Text>Add Item</Text>
							</TouchableOpacity>
						) : (
							<TouchableOpacity style={styles.itemEditBtn} onPress={editItem}>
								<Text>Edit Item</Text>
							</TouchableOpacity>
						)}
					</View>
				</View>
			</Modal>

			{/* Show button if modal is not open */}
			{!showModal && (
				<TouchableOpacity
					style={styles.floatButton}
					onPress={() => {
						setItemText('');
						setSelectedItem({});
						setShowModal(true);
					}}
				>
					<FontAwesome name="plus" size={25} color="#000" />
				</TouchableOpacity>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		...styleBase.container,
	},
	floatButton: {
		...styleBase.center,
		backgroundColor: styleVar.color.light,
		borderRadius: 50,
		height: 50,
		width: 50,
		position: 'absolute',
		right: 20,
		bottom: 20,
		shadowColor: styleVar.color.dark,
		elevation: 5,
		shadowRadius: 15,
		shadowOpacity: 0.75,
		shadowOffset: { width: 1, height: 13 },
	},
	listHeaderView: {
		borderWidth: 1,
		paddingVertical: styleVar.padding.md,
		backgroundColor: styleVar.color.light,
	},
	listHeaderText: {
		textAlign: 'center',
		fontSize: styleVar.fonts.md,
	},
	listFooter: {
		...styleBase.centalicText,
	},
	listEmpty: {
		...styleBase.centalicText,
		fontSize: styleVar.fonts.md,
	},
	itemView: {
		backgroundColor: styleVar.color.light,
		paddingVertical: styleVar.padding.md,
		marginVertical: styleVar.margin.sm,
		borderWidth: 1,
		flex: 1,
	},
	itemText: {
		marginHorizontal: styleVar.margin.md,
		textAlign: 'justify',
	},
	lastUpdate: {
		fontStyle: 'italic',
		fontSize: styleVar.fonts.sm,
		textAlign: 'right',
		marginHorizontal: styleVar.fonts.md,
	},
	modalContainer: {
		...styleBase.center,
		...styleBase.container,
	},
	modalOverlay: {
		...styleBase.overlay,
	},
	modalView: {
		padding: styleVar.padding.sm,
		paddingBottom: styleVar.padding.lg,
		backgroundColor: styleVar.color.light,
		borderWidth: 1,
		borderRadius: 10,
		width: '80%',
	},
	modalCloseBtnView: {
		alignItems: 'flex-end',
	},
	deleteView: {
		...styleBase.center,
		backgroundColor: styleVar.color.danger,
		paddingVertical: styleVar.padding.md,
		marginVertical: styleVar.margin.sm,
		borderWidth: 1,
	},
	deleteViewText: {
		color: styleVar.color.light,
		paddingHorizontal: styleVar.padding.lg,
	},
	itemInput: {
		borderWidth: 1,
		height: 150,
	},
	itemAddBtn: {
		...styleBase.btn,
		alignSelf: 'center',
		backgroundColor: styleVar.color.info,
	},
	itemEditBtn: {
		...styleBase.btn,
		alignSelf: 'center',
		backgroundColor: styleVar.color.warning,
	},
});
