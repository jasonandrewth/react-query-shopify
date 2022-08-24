import React from "react";

interface IProps {
  amount: number;
  add: () => void;
  subtract: () => void;
}
const Adder: React.FC<IProps> = ({ amount, add, subtract }) => {
  return (
    <div className="flex border border-black w-fit mb-3">
      <button onClick={subtract} className="border-r p-2 flex">
        -
      </button>

      <div className="p-2 border-r">{amount}</div>
      <button onClick={add} className="p-2">
        +
      </button>
    </div>
  );
};

export default Adder;
