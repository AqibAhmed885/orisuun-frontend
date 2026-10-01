const ContractDetails = ({
  amount,
  expiryDate,
}: {
  amount: string;
  expiryDate: string;
}) => (
  <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
    <div>
      <p className="text-h9 2xl:text-scaled-h9 font-medium text-black-400 mb-0.5">
        Full monetary amount of contract
      </p>
      <p className="text-h8 2xl:text-scaled-h8 text-blue-500 font-semibold">
        {amount}
      </p>
    </div>
    <div>
      <p className="text-h9 2xl:text-scaled-h9 font-medium text-black-400 mb-0.5">
        Expiry date
      </p>
      <p className="text-h8 2xl:text-scaled-h8 text-blue-500 font-semibold">
        {expiryDate}
      </p>
    </div>
  </div>
);

export default ContractDetails;
