import React from "react";
import { Text, SafeAreaView, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';

const AllAppScreen = () => {
   return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#ccc' }}>
         <WebView source={{ uri: 'https://www.tncclever.com/all-school-test-app.html' }} />
      </SafeAreaView>
   );
}

export default AllAppScreen