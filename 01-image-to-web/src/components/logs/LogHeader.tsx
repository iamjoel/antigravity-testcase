import React from 'react';

export const LogHeader = () => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold text-gray-900">Logs</h1>
      <p className="text-sm text-gray-500 mt-1">
        The log recorded the operation of automate.{' '}
        <a href="#" className="text-blue-600 hover:underline">
          Learn more
        </a>
      </p>
    </div>
  );
};
