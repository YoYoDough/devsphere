import React from 'react'

type AnalysisModalProps = {
    analysisText: string,
    isOpen: boolean,
    onClose: () => void,
}

const AnalysisModal = ({ analysisText, isOpen, onClose }: AnalysisModalProps) => {
    if (!isOpen){
        return null;
    }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center cursor-default"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }} onClick = {onClose}>
      <div className="bg-white dark:bg-gray-900 max-w-3xl w-full p-6 rounded-lg shadow-lg overflow-y-auto max-h-[80vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">AI Analysis</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 dark:hover:text-white font-bold text-xl cursor-pointer"
          >
            ✕
          </button>
        </div>
        <div className="prose dark:prose-invert max-w-full whitespace-pre-wrap">
          {analysisText}
        </div>
      </div>
    </div>
  )
}

export default AnalysisModal