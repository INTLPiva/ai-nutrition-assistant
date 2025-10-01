const LoadingIndicator = () => {
  return (
    <div className="flex justify-start mb-3">
      <div className="bg-gray-100 px-4 py-3 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl max-w-[70%]">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div
              className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
          <span className="text-gray-600 text-sm">
            Nutricionista está digitando...
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
