interface ContractAlertProps {
    title: string;
    description: string;
    buttonText: string;
    onButtonClick: () => void;
  }
  
  const ContractAlert = ({ title, description, buttonText, onButtonClick }: ContractAlertProps) => {
    return (
      <div className="mb-8 md:mb-0 px-6 py-4 bg-warning-75 rounded-tl-lg rounded-tr-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h6 className="text-h6 2xl:text-scaled-h6 text-warning-700 font-semibold mb-1">
            {title}
          </h6>
          <p className="text-h7 2xl:text-scaled-h7 text-warning-800 font-medium mb-1">
            {description}
          </p>
        </div>
        <div>
          <button
            onClick={onButtonClick}
            className="bg-blue-500 py-3 px-6 rounded-md text-h9 2xl:text-scaled-h9 font-semibold text-white"
          >
            {buttonText}
          </button>
        </div>
      </div>
    );
  };
  
  export default ContractAlert;