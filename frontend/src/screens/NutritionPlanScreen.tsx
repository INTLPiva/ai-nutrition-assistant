import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, DownloadSimple, CircleNotch } from "phosphor-react";
import { exportPDF, type MessageResponse } from "../services/apiService";

interface NutritionPlanScreenProps {
  planText: string;
  apiResponse: MessageResponse;
  onGoBack: () => void;
}

const NutritionPlanScreen: React.FC<NutritionPlanScreenProps> = ({
  planText,
  apiResponse,
  onGoBack,
}) => {
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const cleanedPlanText = planText.replace(/##EXPORT_PDF.*$/s, "").trim();

  const handleDownloadPDF = async () => {
    setIsExportingPDF(true);

    try {
      const pdfBlob = await exportPDF(apiResponse);

      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "plano_alimentar.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      alert("Não foi possível exportar o PDF. Tente novamente.");
    } finally {
      setIsExportingPDF(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      <div className="bg-green-500 px-4 py-3 flex items-center shadow-md">
        <button
          onClick={onGoBack}
          className="mr-3 text-white hover:bg-green-600 rounded-full p-2 transition-colors"
        >
          <ArrowLeft size={24} weight="bold" />
        </button>
        <div className="flex-1">
          <h1 className="text-white text-lg font-bold">NutriFácil</h1>
          <p className="text-green-100 text-sm">
            Seu plano nutricional personalizado
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-2xl font-bold text-green-600 mb-4 mt-2">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-xl font-bold text-green-600 mb-3 mt-6">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-lg font-semibold text-green-700 mb-2 mt-4">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-gray-700 mb-3 leading-relaxed">
                    {children}
                  </p>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-gray-800">
                    {children}
                  </strong>
                ),
                em: ({ children }) => (
                  <em className="italic text-gray-600">{children}</em>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-6 my-3 space-y-2">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-6 my-3 space-y-2">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-gray-700">{children}</li>
                ),
                table: ({ children }) => (
                  <table className="border-collapse my-4 w-full">
                    {children}
                  </table>
                ),
                thead: ({ children }) => (
                  <thead className="bg-gray-100">{children}</thead>
                ),
                th: ({ children }) => (
                  <th className="p-2 border border-gray-300 font-semibold text-left">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="p-2 border border-gray-300">{children}</td>
                ),
              }}
            >
              {cleanedPlanText}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 bg-gray-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto">
          <button
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors"
            onClick={handleDownloadPDF}
            disabled={isExportingPDF}
          >
            {isExportingPDF ? (
              <div className="flex items-center space-x-2">
                <CircleNotch size={20} weight="bold" className="animate-spin" />
                <span>Gerando PDF...</span>
              </div>
            ) : (
              <>
                <DownloadSimple size={20} weight="bold" />
                <span>Baixar / Compartilhar PDF</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NutritionPlanScreen;
