import { FormEvent, useRef, useState } from "react";

import {
  useQueryClient,
  useIsMutating,
  useMutation,
} from "@tanstack/react-query";
import axios from "axios";
import clsx from "clsx";

//Components
import Button from "components/UI/Button";

const Newsletter = () => {
  const inputRef = useRef(null);
  const [response, setResponse] = useState<any>({});
  const [show, setShow] = useState(true);

  const subscribeUser = async (email: string) => {
    // this is where the mail request is made

    const res = await axios.post(
      "/api/subscribeUser",
      { email: email },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    return res.data;
  };

  const { mutate, isLoading, isError } = useMutation(subscribeUser, {
    onSuccess: (data) => {
      console.log("response", data); //This is the response you get back
      setResponse(data);
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutate(inputRef.current.value as string);
    if (response?.data?.customerCreate?.customer === null) {
      setShow(() => false);
    }
  };

  return (
    <div
      className={clsx(
        !show && "opacity-0",
        "absolute w-full flex justify-between items-center z-50 bg-white py-4 px-4 md:px-6 xl:px-8 border-b border-black"
      )}
    >
      <form onSubmit={handleSubmit}>
        <label htmlFor="email-input" className="hidden">
          Mailing List
        </label>

        <input
          type="email"
          id="email-input"
          name="email"
          placeholder="MAILING LIST"
          ref={inputRef}
          required
          autoCapitalize="off"
          autoCorrect="off"
          className="border border-black text-sm rounded-xl px-2 py-1 shadow-xl md:shadow-none md:hover:shadow-xl mr-4"
        />

        <Button
          Component={"button"}
          type="submit"
          value=""
          name="subscribe"
          loading={isLoading}
          className="border uppercase text-sm border-black rounded-xl px-2 py-1 shadow-xl md:shadow-none md:hover:shadow-xl transition-all duration-150 ease-in-out hover:bg-lime"
        >
          {isLoading ? "signing up" : "sign up"}
        </Button>
      </form>
      {response?.data?.customerCreate?.customer === null && (
        <span className="hidden md:block text-pink text-sm uppercase ml-3 align-bottom">
          Already subscribed!
        </span>
      )}
      {isError && (
        <span className="hidden md:block text-pink text-sm uppercase ml-3 align-bottom">
          Error Subscribing!
        </span>
      )}
    </div>
  );
};

export default Newsletter;
