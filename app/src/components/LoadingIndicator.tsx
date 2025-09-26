import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { COLORS } from '~/config/constants';

const LoadingIndicator: React.FC = () => {
  return (
    <View className="mb-3 items-start">
      <View className="mr-12 rounded-br-2xl rounded-tl-2xl rounded-tr-2xl bg-gray-100 px-4 py-3">
        <View className="flex-row items-center">
          <ActivityIndicator size="small" color={COLORS.PRIMARY} className="mr-2" />
          <Text className="text-gray-600">Nutricionista está digitando...</Text>
        </View>
      </View>
    </View>
  );
};

export default LoadingIndicator;
