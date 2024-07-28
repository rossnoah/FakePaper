"use client";

import { useEffect, useState } from "react";
import { JSX, SVGProps } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import NonSsr from "@/components/non-ssr";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import Link from "next/link";

const localStorageKey = "pdfItems"; // Key used to store data in localStorage

export default function GeneratePage() {
  return <GenerateWrapper />;
}

function GenerateWrapper() {
  const { toast } = useToast();

  const [pdfItems, setPdfItems] = useState(() => {
    // Initialize state from local storage or fall back to default

    const defaultItems = [
      {
        url: "/storage/817d26a5-d4f1-4068-8971-f41e12bedf7f-2ht1EoJXtrSNjihPLg2AT6zPvIsQIo.pdf",
        name: "Warlocks are the best class",
      },
      {
        url: "/storage/79c904ec-e27b-4c99-86ea-a63873bdd8cc-YBWJyfG4N3amuY2BnBqVpGmb2qCvQi.pdf",
        name: "The Moon is made of cheese",
      },
      {
        url: "/storage/01c76e9f-51db-4cd7-aa3d-862632b5659c-MmP3rN9yGAuf2kdTpkSMjHpPuB60YT.pdf",
        name: "The Boeing 787 doors might fall off",
      },
      {
        url: "/storage/9c004692-206f-4867-a134-e551a18ffaee-zbkq7jniJ6N4L9rhqozVzsDVYEvheh.pdf",
        name: "Water is Not Wet: A Comprehensive Analysis of Liquid Perception",
      },
    ];

    try {
      const storedItems = localStorage.getItem(localStorageKey);

      return storedItems ? JSON.parse(storedItems) : defaultItems;
    } catch (e) {
      return defaultItems;
    }
  });
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Store the pdfItems state to local storage whenever it changes
    localStorage.setItem(localStorageKey, JSON.stringify(pdfItems));
  }, [pdfItems]);

  const handleGenerate = async () => {
    if (!topic.trim()) return; // Don't proceed if the topic is empty

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_EXTERNAL_SERVER}/api/generate`,
        {
          topic: topic,
          isPremium: false, // Set this based on your application's logic
        }
      );
      const { message, title, url } = response.data;
      const name = title ?? `Paper #${pdfItems.length + 1}`;
      setPdfItems([...pdfItems, { name: name, url }]);
      setTopic(""); // Clear the input field
      toast({
        title: "Your paper is ready!",
        description: "Click to view or download it.",
        action: (
          <Link href={url} target="_blank">
            <ToastAction altText="Open">Open</ToastAction>
          </Link>
        ),
      });
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      toast({
        title: "Uh oh! Something went wrong.",
        description:
          (error as any).response.data ??
          "There was a problem while generating your paper.",
      });
      if ((error as any).response.status === 429) {
        toast({
          title: "Rate limited",
          description:
            (error as any).response.data ??
            "You have reached the rate limit for generating papers. Please try again later.",
        });
      }
    }
    setIsLoading(false);
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
      <h2 className="text-2xl font-semibold">Generate a fake paper!</h2>
      <Input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="input input-bordered w-full"
        placeholder="Enter topic. Ex: 'The Moon is made of cheese'"
        disabled={isLoading}
        onKeyDownCapture={(e) => {
          if (e.key === "Enter") {
            onGenerate();
          }
        }}
      />
      <Button
        onClick={onGenerate}
        className={`btn ${isLoading ? "loading" : ""}`}
        disabled={isLoading}
      >
        {isLoading ? "Generating..." : "Generate"}
      </Button>
      <NonSsr>
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
      </NonSsr>
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
