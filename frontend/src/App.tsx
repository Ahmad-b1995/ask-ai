import React from 'react';
import FileUpload from './components/FileUpload';
import Question from './components/Question';

const App: React.FC = () => {
  return (
    <div className=' md:w-2/3 lg:w-1/3 mt-10 m-auto p-5'>
      <h1 className='font-semibold text-lg'>Document Processing and Q&A System</h1>
      <div className='mt-5'>
        <FileUpload />
        <hr className='my-10'/>
        <Question />
      </div>
    </div>
  );
};

export default App;
