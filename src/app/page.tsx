"use client";
import {
  FC,
  MouseEventHandler,
  ChangeEventHandler,
  useRef,
  useState,
} from "react";
import { testConnection } from "@/postgres/client";
import { addPaper } from "@/weaviate/store";
import { PaperEntry } from "@/weaviate/types";
import { cn } from "@/lib/utils";
import { summarizeDocument } from "@/openai/summary";

const PlusIcon: FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={cn("size-6", className)}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
  );
};

const SubmitIcon: FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={cn("size-6", className)}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
      />
    </svg>
  );
};

export default function Home() {
  const history = ["paper 1", "paper 2", "paper 3"];

  const [summary, setSummary] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = async (
    event,
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const handleClick: MouseEventHandler<HTMLButtonElement> = () => {
    inputRef.current?.click();
  };

  const summarize = async () => {
    if (!file) return;
    const encoded = Buffer.from(await file.arrayBuffer()).toString("base64");
    const summary = await summarizeDocument(file);
    setSummary(summary);
  };

  const entry: PaperEntry = {
    title: "How to cook sunny side up",
    abstract: "Instruction: 1. aaa. 2. bbb",
    authors: "Master. Egg",
    comments: "This is really impressive literacture",
  };

  const add = async (): Promise<void> => {
    try {
      const r = await testConnection();
      alert(r);
    } catch (error) {
      alert(error);
    }
    const res = await addPaper(entry);
    switch (res.__typename) {
      case "AddPaperResponse":
        alert(res.id);
        return;
      case "Err":
        alert(res.message);
        return;
    }
  };

  return (
    <div className="w-full flex">
      <div className="w-1/4 h-[calc(100vh)] flex flex-col gap-2 p-4 bg-gray-100">
        <div className="w-full h-12 rounded-lg text-center shadow-sm bg-sky-100">
          <div className="w-full h-full flex items-center justify-center">
            New Chat!
          </div>
        </div>
        {history.map((item, index) => {
          return (
            <div
              key={index}
              className="w-full h-12 rounded-lg text-center shadow-sm bg-white"
            >
              <div className="w-full h-full flex items-center justify-center">
                {item}
              </div>
            </div>
          );
        })}
      </div>
      <div className="w-3/4 h-[calc(100vh)] flex flex-col gap-2 p-4">
        <div className="w-full px-16  flex flex-col gap-2">
          <div className="w-full pb-4">
            <div className="border-b-1 border-sky-800 text-2xl font-extrabold text-sky-600">
              Let's Summarize Academic Paper!
            </div>
          </div>
          <div className="w-full flex flex-row gap-2 p-2">
            <input
              type="file"
              multiple={false}
              ref={inputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            {file === null ? (
              <button
                className="w-10 h-10 flex flex-col justify-center items-center rounded-lg p-1 bg-sky-500 hover:border-2 hover:border-solid hover:border-sky-600"
                onClick={handleClick}
              >
                <PlusIcon className="text-white" />
              </button>
            ) : (
              <button
                className="w-10 h-10 flex flex-col justify-center items-center rounded-lg p-1 bg-sky-500 hover:border-2 hover:border-solid hover:border-sky-600"
                onClick={summarize}
              >
                <SubmitIcon className="text-white" />
              </button>
            )}
            {file && (
              <div className="h-10 flex flex-col justify-center gap-1">
                {file.name}
                {file.size}
              </div>
            )}
          </div>
          <div className="w-full rounded-xl text-center shadow-sm px-8 flex flex-col gap-2">
            <div>TITLE</div>
            <div>{entry.title}</div>
            <div>AUTHORS</div>
            <div>{entry.authors}</div>
            <div>ABSTRACT</div>
            <div>{entry.abstract}</div>
            {summary && <div>SUMMARY: {summary}</div>}
          </div>

          <div className="w-full flex flex-row justify-end">
            <div className="w-1/5 h-12 rounded-lg text-center text-white shadow-sm bg-sky-500">
              <button
                className="w-full h-full flex items-center justify-center"
                onClick={add}
              >
                Save document!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
