import { StyleSheet } from 'react-native';
import { variables } from 'src/assets/styles/variables';

export const styleVar = variables;
export const styleBase = StyleSheet.create({
	container: {
		flex: 1,
	},
	center: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	btn: {
		borderWidth: 1,
		borderRadius: 10,
		marginVertical: styleVar.margin.sm,
		padding: styleVar.padding.md,
	},
	btnText: {
		fontSize: styleVar.fonts.md,
	},
	btnRow: {
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
	centalicText: {
		textAlign: 'center',
		fontStyle: 'italic',
	},
	modal: {
		padding: styleVar.padding.sm,
		paddingBottom: styleVar.padding.lg,
		backgroundColor: styleVar.color.light,
		borderWidth: 1,
		borderRadius: 10,
		width: '80%',
	},
	overlay: {
		backgroundColor: styleVar.color.dark,
		opacity: 0.5,
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
	},
	floatButton: {
		justifyContent: 'center',
		alignItems: 'center',
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
});
