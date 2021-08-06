import { StyleSheet } from 'react-native';
import { variables } from 'src/assets/styles/variables';

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
	centalicText: {
		textAlign: 'center',
		fontStyle: 'italic',
	},
	overlay: {
		backgroundColor: variables.color.dark,
		opacity: 0.5,
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
	},
});

export const styleVar = variables;
