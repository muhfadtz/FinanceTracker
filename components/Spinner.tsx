
import React from 'react';

const Spinner = () => {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-evvo-green-dark"></div>
    </div>
  );
};

const FullPageSpinner = () => {
    return (
        <div className="fixed inset-0 bg-white bg-opacity-75 flex justify-center items-center z-50">
            <Spinner />
        </div>
    )
}

export { Spinner, FullPageSpinner };
