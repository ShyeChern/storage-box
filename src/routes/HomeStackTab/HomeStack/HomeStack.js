import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from 'src/views/Home/Home';
import DrawerToggle from 'src/routes/components/DrawerToggle';

const Stack = createStackNavigator();

export default function HomeStack({ navigation }) {
	return (
		<Stack.Navigator initialRouteName={'Home'}>
			<Stack.Screen
				name="Home"
				component={Home}
				options={{
					headerLeft: (props) => <DrawerToggle props={props} navigation={navigation} />,
				}}
			/>
		</Stack.Navigator>
	);
}
