"use client";
import { useState, useEffect } from "react";
import { getAllPapers } from "@/weaviate/retrieve";
import { GetAllResult, PaperEntry } from "@/weaviate/types";

export default function Home() {
  const history = ["paper 1", "paper 2", "paper 3"];
  const [papers, setPapers] = useState<GetAllResult[]>([]);

  useEffect(() => {
    // if it has error, no card will be shown
    const getAll = async () => {
      const res = await getAllPapers();
      switch (res.__typename) {
        case "GetAllResponse":
          setPapers(res.results);
          break;
        case "Err":
          alert(res.message);
          break;
      }
    };
    getAll();
  }, []);

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
        </div>
        <div className="w-full flex flex-col gap-2">
          {papers.map((item, index) => {
            return (
              <div
                key={index}
                className="w-full h-12 rounded-lg text-center shadow-sm bg-white"
              >
                <div className="w-full h-full flex items-center justify-center">
                  <div>TITLE</div>
                  <div>{item.title}</div>
                  <div>AUTHORS</div>
                  <div>{item.authors}</div>
                  <div>ABSTRACT</div>
                  <div>{item.abstract}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
