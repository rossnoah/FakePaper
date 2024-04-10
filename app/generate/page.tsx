"use client";

import { SearchInput } from "@/components/search-input";
import { Search } from "lucide-react";
import { useState } from "react";
import { JSX, SVGProps } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function GeneratePage() {
  const [pdfItems, setPdfItems] = useState([
    {
      url: "https://34bmow0mkp2ttlja.public.blob.vercel-storage.com/817d26a5-d4f1-4068-8971-f41e12bedf7f-2ht1EoJXtrSNjihPLg2AT6zPvIsQIo.pdf",
      name: "Warlocks are the best class [Premium]",
    },
    {
      url: "https://34bmow0mkp2ttlja.public.blob.vercel-storage.com/79c904ec-e27b-4c99-86ea-a63873bdd8cc-YBWJyfG4N3amuY2BnBqVpGmb2qCvQi.pdf",
      name: "The Moon is made of cheese [Premium]",
    },
    {
      url: "https://34bmow0mkp2ttlja.public.blob.vercel-storage.com/01c76e9f-51db-4cd7-aa3d-862632b5659c-MmP3rN9yGAuf2kdTpkSMjHpPuB60YT.pdf",
      name: "The Boeing 787 doors might fall off [Premium]",
    },
  ]);
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return; // Don't proceed if the topic is empty

    setIsLoading(true);
    try {
      const response = await axios.post("https://fakepaper.app/api/generate", {
        topic: topic,
        isPremium: true, // Set this based on your application's logic
      });
      const { message, url } = response.data;
      setPdfItems([
        ...pdfItems,
        { name: `Paper #${pdfItems.length + 1}`, url },
      ]);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    }
    setIsLoading(false);
    setTopic(""); // Clear the input field
  };

  return (
    <main>
      <div className="flex flex-row items-center justify-around">
        <div className="flex-1 max-w-lg">
          {/* Adjust 'max-w-xs' to your desired maximum width */}
          <Generate
            pdfItems={pdfItems}
            onGenerate={handleGenerate}
            isLoading={isLoading}
            topic={topic}
            setTopic={setTopic}
          />
        </div>
      </div>
    </main>
  );
}

function Generate({
  pdfItems,
  onGenerate,
  isLoading,
  topic,
  setTopic,
}: {
  pdfItems: Array<{ url: string; name: string }>;
  onGenerate: any;
  isLoading: any;
  topic: any;
  setTopic: any;
}) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold">Generate Papers!</h2>
      <Input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="input input-bordered w-full"
        placeholder="Enter topic"
        disabled={isLoading}
      />
      <Button
        onClick={onGenerate}
        className={`btn ${isLoading ? "loading" : ""}`}
        disabled={isLoading}
      >
        {isLoading ? "Generating..." : "Generate"}
      </Button>
      <div className="grid gap-2">
        {pdfItems.map((item, index) => (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full justify-start items-center p-2 border border-gray-200 rounded hover:bg-gray-100"
            key={index}
          >
            <FileIcon className="mr-2 h-4 w-4" />
            {item.name}
          </a>
        ))}
      </div>
    </div>
  );
}

function FileIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}
