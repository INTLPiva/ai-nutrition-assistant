import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Ionicons } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';
import { exportPDF } from '../services/apiService';
import { COLORS } from '~/config/constants';

interface NutritionPlanScreenProps {
  planText: string;
  apiResponse: any;
  onGoBack: () => void;
}

const NutritionPlanScreen: React.FC<NutritionPlanScreenProps> = ({
  planText,
  apiResponse,
  onGoBack,
}) => {
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const cleanedPlanText = planText.replace(/##EXPORT_PDF.*$/s, '').trim();

  const handleDownloadPDF = async () => {
    setIsExportingPDF(true);

    try {
      const pdfBlob = await exportPDF(apiResponse);

      const reader = new FileReader();
      reader.readAsDataURL(pdfBlob);
      reader.onloadend = async () => {
        try {
          const base64data = (reader.result as string).split(',')[1];
          const fileUri = FileSystem.documentDirectory + 'plano_alimentar.pdf';

          await FileSystem.writeAsStringAsync(fileUri, base64data, {
            encoding: FileSystem.EncodingType.Base64,
          });

          if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(fileUri, {
              mimeType: 'application/pdf',
              dialogTitle: 'Compartilhar Plano Nutricional',
            });
          } else {
            Alert.alert('Sucesso', 'PDF salvo em: ' + fileUri);
          }
        } catch (error) {
          console.error('Error saving PDF:', error);
          Alert.alert('Erro', 'Não foi possível salvar o PDF.');
        }
      };
    } catch (error) {
      console.error('Error exporting PDF:', error);
      Alert.alert('Erro', 'Não foi possível exportar o PDF. Tente novamente.');
    } finally {
      setIsExportingPDF(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center bg-green-500 px-4 py-6">
        <TouchableOpacity onPress={onGoBack} className="mr-3">
          <Ionicons name="arrow-back" size={24} color={COLORS.WHITE} />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-lg font-bold text-white">Nutricionista IA</Text>
          <Text className="text-sm text-green-100">Seu plano nutricional personalizado</Text>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingVertical: 16 }}
        showsVerticalScrollIndicator={false}>
        <View className="rounded-lg bg-white">
          <Markdown
            style={{
              body: {
                color: COLORS.GRAY_800,
                fontSize: 16,
                lineHeight: 24,
              },
              heading1: {
                fontSize: 24,
                fontWeight: 'bold',
                color: COLORS.PRIMARY,
                marginBottom: 16,
                marginTop: 8,
              },
              heading2: {
                fontSize: 20,
                fontWeight: 'bold',
                color: '#059669',
                marginBottom: 12,
                marginTop: 16,
              },
              heading3: {
                fontSize: 18,
                fontWeight: '600',
                color: '#065f46',
                marginBottom: 8,
                marginTop: 12,
              },
              paragraph: {
                marginBottom: 12,
                lineHeight: 22,
              },
              strong: {
                fontWeight: 'bold',
                color: '#374151',
              },
              em: {
                fontStyle: 'italic',
                color: '#6b7280',
              },
              list_item: {
                marginBottom: 6,
                paddingLeft: 8,
              },
              bullet_list: {
                marginBottom: 12,
              },
              ordered_list: {
                marginBottom: 12,
              },
              table: {
                borderWidth: 1,
                borderColor: '#d1d5db',
                marginBottom: 16,
              },
              th: {
                backgroundColor: COLORS.GRAY_100,
                padding: 8,
                fontWeight: 'bold',
                borderWidth: 1,
                borderColor: '#d1d5db',
              },
              td: {
                padding: 8,
                borderWidth: 1,
                borderColor: '#d1d5db',
              },
            }}>
            {cleanedPlanText}
          </Markdown>
        </View>
      </ScrollView>

      <View className="border-t border-gray-200 bg-gray-50 px-4 py-4">
        <TouchableOpacity
          className="flex-row items-center justify-center rounded-lg bg-green-500 py-3"
          onPress={handleDownloadPDF}
          disabled={isExportingPDF}
          activeOpacity={0.8}>
          {isExportingPDF ? (
            <ActivityIndicator color={COLORS.WHITE} />
          ) : (
            <>
              <Ionicons name="download" size={20} color={COLORS.WHITE} />
              <Text className="ml-2 text-base font-semibold text-white">
                Baixar / Compartilhar em PDF
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NutritionPlanScreen;
