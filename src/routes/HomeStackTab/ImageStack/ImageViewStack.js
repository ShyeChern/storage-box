import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ImageView from 'src/views/Home/ImageView';
import DrawerToggle from 'src/routes/components/DrawerToggle';

const Stack = createStackNavigator();

export default function ImageViewStack({ navigation }) {
	return (
		<Stack.Navigator initialRouteName={'ImageView'}>
			<Stack.Screen
				name="ImageView"
				component={ImageView}
				options={{
					headerLeft: (props) => <DrawerToggle props={props} navigation={navigation} />,
				}}
			/>
		</Stack.Navigator>
	);
}
