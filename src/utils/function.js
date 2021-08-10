import RNFS from 'react-native-fs';

// Sort array according to field
export const sortBy = (field, reverse, primer) => {
	const key = primer ? (x) => primer(x[field]) : (x) => x[field];

	reverse = reverse ? -1 : 1;

	return function (a, b) {
		a = key(a);
		b = key(b);

		return reverse * ((a > b) - (b > a));
	};
};

// Write file into device
export const writeFile = async (path, content) => {
	// Android 10 Issue - workaround by delete the original file first #ISSUE-002
	const deleteResult = await RNFS.unlink(path).catch((err) => {
		return {
			result: false,
			message: err.message,
		};
	});
	// if delete error direct return
	if (deleteResult && !deleteResult.result) {
		return deleteResult;
	}

	return RNFS.writeFile(path, content, 'utf8')
		.then(() => {
			return {
				result: true,
			};
		})
		.catch((err) => {
			return {
				result: false,
				message: err.message,
			};
		});
};

// Read file from device
export const readFile = async (path) => {
	const prevPin = await RNFS.readFile(path)
		.then((content) => {
			return {
				result: true,
				data: content,
			};
		})
		.catch((err) => {
			return {
				result: false,
				message: err.message,
			};
		});
	return prevPin;
};
