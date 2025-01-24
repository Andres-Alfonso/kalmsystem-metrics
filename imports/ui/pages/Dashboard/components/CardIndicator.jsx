import React from 'react';

export const CardIndicator = () => {
    return(
        <>
            <div className='bg-white shadow sm:rounded-lg'>
                <div className='px-4 py-5 sm:p-6'>
                    <div className='sm:flex sm:items-start sm:justify-between'>
                        <div className='flex items-center'>
                            <div className='flex-shrink-0 bg-indigo-500 rounded-md p-3'>
                                {/* Heroicon name: users */}
                                <svg className='h-6 w-6 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9s9-4.03 9-9s-4.03-9-9-9zm0 2a2 2 0 100 4a2 2 0 000-4zm-4 6a4 4 0 018 0h2a6 6 0 00-12 0h2z'/>
                                </svg>
                            </div>
                            <div className='ml-4'>
                                <p className='text-sm font-medium text-gray-900'>Total Subscribers</p>
                                <p className='text-lg font-bold text-gray-900'>71,897</p>
                            </div>
                        </div>
                        <div className='mt-5 flex sm:mt-0 sm:ml-6 sm:flex-shrink-0 sm:flex sm:items-center'>
                            <button type='button' className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
                                View all
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}