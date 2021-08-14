import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import HomeStack from 'src/routes/HomeStackTab/HomeStack/HomeStack';
import ImageViewStack from 'src/routes/HomeStackTab/ImageStack/ImageViewStack';

const Tab = createBottomTabNavigator();

export default function HomeStackTab() {
	return (
		<Tab.Navigator initialRouteName={'Item'}>
			<Tab.Screen
				name="Item"
				component={HomeStack}
				options={{
					tabBarIcon: (props) => <FontAwesome {...props} name="file" />,
				}}
			/>
			<Tab.Screen
				name="Image"
				component={ImageViewStack}
				options={{
					tabBarIcon: (props) => <FontAwesome {...props} name="image" />,
				}}
			/>
		</Tab.Navigator>
	);
}
