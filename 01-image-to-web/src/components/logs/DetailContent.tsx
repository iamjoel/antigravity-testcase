import React from 'react';
import { Copy, Maximize2 } from 'lucide-react';

interface JsonViewerProps {
  title: string;
  data: any;
}

const JsonViewer = ({ title, data }: JsonViewerProps) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {title}
        </h3>
        <div className="flex items-center gap-2">
          <button className="text-gray-400 hover:text-gray-600">
            <Copy size={14} />
          </button>
          <button className="text-gray-400 hover:text-gray-600">
            <Maximize2 size={14} />
          </button>
        </div>
      </div>
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 font-mono text-xs text-gray-800 overflow-x-auto">
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
};

interface DetailContentProps {
  activeTab: string;
  log: any; // Should be LogEntry but avoiding circular deps or just import it
}

export const DetailContent = ({ activeTab, log }: DetailContentProps) => {
  if (activeTab !== 'DETAIL') {
    return <div className="p-6 text-gray-500 text-sm">Content for {activeTab} not implemented yet.</div>;
  }

  return (
    <div className="p-6 overflow-y-auto flex-1">
      {log.input && <JsonViewer title="Input" data={log.input} />}
      {log.output && <JsonViewer title="Output" data={log.output} />}

      {/* Metadata Footer */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Metadata</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-gray-500">Status</div>
          <div className="text-gray-900">{log.status}</div>
          <div className="text-gray-500">Version</div>
          <div className="text-gray-900">1.02</div>
        </div>
      </div>
    </div>
  );
};
