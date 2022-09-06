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
    <div className="flex flex-row max-w-fit h-9 border border-black mb-3">
      <button
        type="button"
        onClick={subtract}
        className="border-r p-2 flex hover:opacity-40 transition-all duration-300 ease-in-out"
        disabled={amount < 1}
      >
        <Minus width={18} height={18} />
      </button>

      <div className="py-2 px-4 border-r">{amount}</div>

      <button
        type="button"
        onClick={add}
        className="p-2 border-r hover:opacity-40 transition-all duration-300 ease-in-out"
        disabled={amount >= max}
      >
        <Plus width={18} height={18} />
      </button>
    </div>
  );
};

export default Adder;
