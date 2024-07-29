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
      {
        url: "storage/f439c498-091d-435a-86cb-ffc7bae9bdf6-5Pmx1QloI1UnQ2uGQRVzrXNb5oChkD.pdf",
        name: "On the Definitive Assertion That Water is Wet",
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
      const { jobId } = response.data;

      const pollStatus = async () => {
        try {
          const statusResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_EXTERNAL_SERVER}/api/status/${jobId}`
          );
          const job = statusResponse.data;

          if (job.status === "completed") {
            setPdfItems([...pdfItems, { name: job.title, url: job.url }]);
            toast({
              title: "Your paper is ready!",
              description: "Click to view or download it.",
              action: (
                <Link href={job.url} target="_blank">
                  <ToastAction altText="Open">Open</ToastAction>
                </Link>
              ),
            });
            setIsLoading(false);
          } else if (job.status === "error") {
            toast({
              title: "Uh oh! Something went wrong.",
              description: job.message,
            });
            setIsLoading(false);
          } else {
            setTimeout(pollStatus, 3000); // Poll every 3 seconds
          }
        } catch (error) {
          console.error("Failed to fetch job status:", error);
          toast({
            title: "Uh oh! Something went wrong.",
            description:
              (error as any).response.data ??
              "There was a problem while checking the job status.",
          });
          setIsLoading(false);
        }
      };

      pollStatus(); // Start polling for job status
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      toast({
        title: "Uh oh! Something went wrong.",
        description:
          (error as any).response.data ??
          "There was a problem while generating your paper.",
      });
      setIsLoading(false);
    }
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
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;

    if (isLoading) {
      progressInterval = setInterval(() => {
        setLoadingProgress((prevProgress) => {
          // Calculate the increment dynamically based on current progress
          const remainingProgress = 100 - prevProgress;
          const increment = Math.max(remainingProgress / 300, 0.05); // More aggressive slowing, minimum increment of 0.05

          // Increment loading progress
          if (prevProgress < 100) {
            return prevProgress + increment;
          } else {
            clearInterval(progressInterval);
            return prevProgress;
          }
        });
      }, 100); // Interval in milliseconds
    } else {
      setLoadingProgress(0); // Reset progress when loading is done
    }

    return () => clearInterval(progressInterval);
  }, [isLoading]);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold">
        Bring your scientific paper to life!
      </h2>
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
        {isLoading
          ? `Generating... (Normally takes about 25 seconds)`
          : `Generate`}
      </Button>
      {isLoading ? (
        <div className="relative pt-1">
          <div className="flex h-2 overflow-hidden bg-gray-200 rounded">
            <div
              style={{ width: `${loadingProgress}%` }}
              className="h-full bg-blue-500"
            ></div>
          </div>
        </div>
      ) : (
        <NonSsr>
          <ServerStatusBadge />
        </NonSsr>
      )}
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

const serverStatus = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_EXTERNAL_SERVER}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch server status:", error);
    return null;
  }
};

const ServerStatusBadge = () => {
  const [status, setStatus] = useState<{ status: string } | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      const serverData = await serverStatus();
      setStatus(serverData);
    };

    if (!status) {
      fetchStatus();
    }
  }, [status]);

  if (status === null) {
    return <div></div>;
  }

  return (
    <>
      {status.status === "ok" ? (
        <span className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
          Generation Server Ready
        </span>
      ) : (
        <span className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-800">
          Generation Server Offline
        </span>
      )}
    </>
  );
};
