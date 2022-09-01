import React from "react";
import { Plus, Minus } from "components/Icons";

interface IProps {
  amount: number;
  add: () => void;
  subtract: () => void;
  max?: number;
}
const Adder: React.FC<IProps> = ({ amount, add, subtract, max = 6 }) => {
  return (
    <div className="flex flex-row w-fit-content h-9 border border-black mb-3">
      <button
        type="button"
        onClick={subtract}
        className="border-r p-2 flex"
        disabled={amount < 1}
      >
        <Minus width={18} height={18} />
      </button>

      <div className="p-2 border-r">{amount}</div>

      <button
        type="button"
        onClick={add}
        className="p-2"
        disabled={amount >= max}
      >
        <Plus width={18} height={18} />
      </button>
    </div>
  );
};

export default Adder;
