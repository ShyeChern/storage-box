import React, { useState, useEffect, useRef } from 'react';
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	TouchableWithoutFeedback,
	SafeAreaView,
	FlatList,
	Image,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import RNFS from 'react-native-fs';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CustomAlert from 'src/components/CustomAlert';
import SelectModal from 'src/components/SelectModal';
import { styleVar, styleBase } from 'src/assets/styles/styles';
import { constant } from 'src/utils/constants';
import { sortBy, readDirectory } from 'src/utils/function';

export default function ImageView({ navigation }) {
	const [isLoading, setIsLoading] = useState(true);
	const [selectedImage, setSelectedImage] = useState({});
	const [imageList, setImageList] = useState([]);
	const [imageRef, setImageRef] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [showImage, setShowImage] = useState(false);
	const isFocused = useIsFocused();
	const zoomImageRef = useRef(null);

	useEffect(() => {
		getImageList();
	}, [isLoading, isFocused]);

	const getImageList = async () => {
		setImageRef([]);
		const items = await readDirectory(constant.IMG_DIRECTORY_PATH);
		if (!items.result) {
			CustomAlert(items.message);
		}
		setImageList(items.data.filter((value) => value.isFile()).sort(sortBy('mtime', true)));
		setIsLoading(false);
	};

	const onSelect = (value) => {
		switch (value) {
			case 'NEW': {
				launchCamera({}, (cb) => {
					if (cb.assets) {
						copyFile(cb.assets[0]);
					}
				});
				break;
			}
			case 'IMPORT': {
				launchImageLibrary({}, (cb) => {
					if (cb.assets) {
						copyFile(cb.assets[0]);
					}
				});
				break;
			}
		}
		setShowModal(false);
	};

	const copyFile = (file) => {
		const ext = file.fileName.split('.')[1];
		RNFS.copyFile(file.uri, constant.IMG_DIRECTORY_PATH + `/${Date.now()}.${ext}`)
			.then(() => {
				setIsLoading(true);
			})
			.catch((err) => {
				CustomAlert(err.message);
			});
	};

	const deleteFile = () => {
		RNFS.unlink(selectedImage.path)
			.then(() => {
				setShowImage(false);
				setIsLoading(true);
			})
			.catch((err) => {
				CustomAlert(err.message);
			});
	};

	return (
		<View style={styles.container}>
			<SafeAreaView style={styles.container}>
				{/* zoom selected image */}
				{showImage && (
					<View>
						<TouchableWithoutFeedback onPress={() => setShowImage(false)}>
							<Image
								style={styles.imageZoom}
								ref={zoomImageRef}
								source={{
									uri: `file://${selectedImage.path}`,
								}}
								onError={() => {
									zoomImageRef.current.setNativeProps({
										src: [{ uri: constant.NOT_IMAGE_PLACEHOLDER }],
									});
								}}
								defaultSource={require('src/assets/img/default-image.jpg')}
							/>
						</TouchableWithoutFeedback>
						<View style={styles.imageDeleteBtnView}>
							<TouchableOpacity
								style={styles.imageDeleteBtn}
								onPress={() => {
									CustomAlert(
										'Confirm to delete this image? Once delete it cannot be recover anymore.',
										[
											{ text: 'Cancel' },
											{
												text: 'Okay',
												onPress: deleteFile,
											},
										],
									);
								}}
							>
								<Text style={styles.imageDeleteBtnText}>Delete Image</Text>
							</TouchableOpacity>
						</View>
					</View>
				)}

				{/* Image list */}
				<FlatList
					data={imageList}
					onRefresh={() => getImageList()}
					refreshing={isLoading}
					renderItem={({ item, index }) => (
						<TouchableOpacity
							key={index}
							style={styles.imageView}
							onPress={() => {
								item.index = index;
								setSelectedImage(item);
								setShowImage(true);
							}}
						>
							<Image
								style={styles.image}
								ref={(ref) => (imageRef[index] = ref)}
								source={{
									uri: `file://${item.path}`,
								}}
								onError={() => {
									imageRef[index].setNativeProps({
										src: [{ uri: constant.NOT_IMAGE_PLACEHOLDER }],
									});
								}}
								defaultSource={require('src/assets/img/default-image.jpg')}
							/>
						</TouchableOpacity>
					)}
					keyExtractor={(item) => item.path}
					initialNumToRender={5}
					maxToRenderPerBatch={10}
					numColumns={2}
					ListHeaderComponent={() => (
						<View style={styles.listHeaderView}>
							<Text style={styles.listHeaderText}>Image List</Text>
						</View>
					)}
					ListEmptyComponent={() =>
						!isLoading &&
						imageList.length === 0 && (
							<Text style={styles.listEmpty}>No item saved in your list</Text>
						)
					}
					ListFooterComponent={() =>
						imageList.length > 0 && <Text style={styles.listFooter}>End of List</Text>
					}
				/>
			</SafeAreaView>

			{!showImage && (
				<TouchableOpacity style={styles.floatButton} onPress={() => setShowModal(true)}>
					<FontAwesome name="plus" size={25} color="#000" />
				</TouchableOpacity>
			)}

			{/* Action modal */}
			<SelectModal
				isShow={showModal}
				setIsShow={setShowModal}
				title={'Select your action'}
				data={[
					{ label: 'Take New Image', value: 'NEW' },
					{ label: 'Import Image', value: 'IMPORT' },
				]}
				onSelect={onSelect}
				dismissable={true}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		...styleBase.container,
	},
	floatButton: {
		...styleBase.floatButton,
	},
	listHeaderView: {
		borderWidth: 1,
		paddingVertical: styleVar.padding.md,
		marginBottom: styleVar.margin.sm,
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
	imageView: {
		borderWidth: 1,
		flex: 1,
		maxWidth: '50%',
	},
	image: {
		height: 150,
	},
	imageZoom: {
		height: '100%',
	},
	imageDeleteBtnView: {
		position: 'absolute',
		left: '50%',
		bottom: 20,
	},
	imageDeleteBtn: {
		...styleBase.btn,
		backgroundColor: styleVar.color.danger,
		position: 'relative',
		left: '-50%',
	},
	imageDeleteBtnText: {
		color: styleVar.color.light,
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
});
