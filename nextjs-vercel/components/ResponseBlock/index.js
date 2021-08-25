const ResponseBlock = ({ responseData }) => {
  return (
    <div className="flex flex-col justify-start items-start w-1/2">
      <div className="border-0 border-b-2 border-gray-200  w-full">
        <span className="text-primary">Response:</span>
      </div>
      <div className="bg-gray-200 rounded-md p-3 text-lg w-full h-auto overflow-auto my-2">
        <code>{responseData && JSON.stringify(responseData)}</code>
      </div>
    </div>
  );
};

export default ResponseBlock;
