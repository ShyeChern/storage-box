import React, { useState, useEffect } from 'react';
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	TouchableWithoutFeedback,
	SafeAreaView,
	FlatList,
	Modal,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { styleVar, styleBase } from 'src/assets/styles/styles';
import CustomAlert from 'src/components/CustomAlert';
import { constant } from 'src/utils/constants';
import { sortBy, writeFile, readFile } from 'src/utils/function';

export default function DeletedItem({ navigation }) {
	const [isLoading, setIsLoading] = useState(true);
	const [selectedItem, setSelectedItem] = useState({});
	const [itemList, setItemList] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [itemLength, setItemLength] = useState(0);
	const isFocused = useIsFocused();

	useEffect(() => {
		getItemList();
	}, [isLoading, isFocused]);

	const getItemList = async () => {
		let items = await readFile(constant.NOTE_PATH);
		if (!items.result) {
			CustomAlert(items.message);
		}
		items = JSON.parse(items.data);
		setItemList(items.sort(sortBy('deletedAt', true)));
		setItemLength(items.filter((value) => value.deletedAt).length);
		setIsLoading(false);
	};

	const recoverItem = async () => {
		const recoverItemIndex = itemList.findIndex((value) => value.id === selectedItem.id);
		itemList[recoverItemIndex].deletedAt = null;
		const result = await writeFile(constant.NOTE_PATH, JSON.stringify(itemList));
		if (result.result) {
			CustomAlert('Recover item success');
			setIsLoading(true);
		} else {
			CustomAlert(result.message);
		}
		setShowModal(false);
	};

	const deleteItem = async () => {
		const result = await writeFile(
			constant.NOTE_PATH,
			JSON.stringify(itemList.filter((value) => value.id !== selectedItem.id)),
		);
		if (result.result) {
			CustomAlert('Delete item success');
			setIsLoading(true);
		} else {
			CustomAlert(result.message);
		}
		setShowModal(false);
	};

	return (
		<View style={styles.container}>
			<SafeAreaView style={styles.container}>
				<FlatList
					data={itemList.filter((value) => value.deletedAt)}
					onRefresh={() => getItemList()}
					refreshing={isLoading}
					renderItem={({ item }) => (
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
							<Text style={styles.deletedAt}>
								Deleted At: {new Date(item.deletedAt).toDateString()}
							</Text>
						</TouchableOpacity>
					)}
					keyExtractor={(item) => item.id}
					initialNumToRender={5}
					maxToRenderPerBatch={10}
					ListHeaderComponent={() => (
						<View style={styles.listHeaderView}>
							<Text style={styles.listHeaderText}>Deleted Item List</Text>
							<Text style={styles.listHeaderInfoText}>
								(Item will be auto deleted after{' '}
								{Math.round(constant.DELETE_INTERVAL_MILLISECOND / constant.ONE_DAY_MILLISECOND)}{' '}
								days)
							</Text>
						</View>
					)}
					ListEmptyComponent={() =>
						!isLoading && itemLength === 0 && <Text style={styles.listEmpty}>No deleted item</Text>
					}
					ListFooterComponent={() =>
						itemLength > 0 && <Text style={styles.listFooter}>End of List</Text>
					}
				/>
			</SafeAreaView>

			{/* View Modal */}
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

						{/* Text justify with selectable align issue #ISSUE-001 */}
						<Text selectable style={styles.itemText}>
							{selectedItem.note}
						</Text>

						<View style={styles.btnView}>
							<TouchableOpacity style={styles.itemRecoverBtn} onPress={recoverItem}>
								<Text style={styles.btnText}>Recover</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={styles.itemDeleteBtn}
								onPress={() => {
									CustomAlert(
										'Confirm to delete this item? Once delete it cannot be recover anymore.',
										[
											{ text: 'Cancel' },
											{
												text: 'Okay',
												onPress: deleteItem,
											},
										],
									);
								}}
							>
								<Text style={styles.deleteBtnText}>Delete Item</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		...styleBase.container,
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
	listHeaderInfoText: {
		...styleBase.centalicText,
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
	deletedAt: {
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
		...styleBase.modal,
	},
	modalCloseBtnView: {
		alignItems: 'flex-end',
	},
	btnView: {
		...styleBase.btnRow,
	},
	itemDeleteBtn: {
		...styleBase.btn,
		backgroundColor: styleVar.color.danger,
	},
	itemRecoverBtn: {
		...styleBase.btn,
		backgroundColor: styleVar.color.info,
	},
	deleteBtnText: {
		color: styleVar.color.light,
	},
});
