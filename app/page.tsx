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

// --- Step Progress Constants ---
const LOADING_STEPS = [
  "Submitting",
  "Queued",
  "Prompting",
  "Generating",
  "Finalizing",
  "Done",
] as const;
type LoadingStep = (typeof LOADING_STEPS)[number];

const localStorageKey = "pdfItems";

// --- Main Page ---
export default function GeneratePage() {
  return <GenerateWrapper />;
}

// --- Wrapper: Handles State and Logic ---
function GenerateWrapper() {
  const { toast } = useToast();

  const [pdfItems, setPdfItems] = useState(() => {
    const defaultItems = [
      {
        url: "/s3/7f39a0fe-f2c7-44cf-b85d-594a86a71a6f.pdf",
        name: "The Moon is made of cheese",
      },
      {
        url: "/s3/e3b413af-20cd-497a-b493-6d778eea3dfc.pdf",
        name: "Water is Not Wet: An Inquiry into the Nature of Moisture",
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
  const [loadingStep, setLoadingStep] = useState<LoadingStep | null>(null);

  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(pdfItems));
  }, [pdfItems]);

  // --- Enhanced Generate Handler with Steps ---
  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);
    setLoadingStep("Submitting");
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_EXTERNAL_SERVER}/api/generate`,
        {
          topic: topic,
          isPremium: false,
        }
      );
      const { jobId } = response.data;

      // --- Polling with Step Updates ---
      const pollStatus = async () => {
        try {
          const statusResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_EXTERNAL_SERVER}/api/status/${jobId}`
          );
          const job = statusResponse.data;

          // --- Step Mapping ---
          if (job.status === "queued") setLoadingStep("Queued");
          else if (job.status === "prompting") setLoadingStep("Prompting");
          else if (job.status === "generating") setLoadingStep("Generating");
          else if (job.status === "finalizing") setLoadingStep("Finalizing");

          if (job.status === "completed") {
            setLoadingStep("Done");
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
            setTimeout(() => setLoadingStep(null), 1000);
          } else if (job.status === "error") {
            toast({
              title: "Uh oh! Something went wrong.",
              description: job.message,
            });
            setIsLoading(false);
            setLoadingStep(null);
          } else {
            setTimeout(pollStatus, 2000);
          }
        } catch (error) {
          toast({
            title: "Uh oh! Something went wrong.",
            description:
              (error as any).response?.data ??
              "There was a problem while checking the job status.",
          });
          setIsLoading(false);
          setLoadingStep(null);
        }
      };

      pollStatus();
    } catch (error) {
      toast({
        title: "Uh oh! Something went wrong.",
        description:
          (error as any).response?.data ??
          "There was a problem while generating your paper.",
      });
      setIsLoading(false);
      setLoadingStep(null);
    }
  };

  return (
    <main>
      <div className="flex flex-row items-center justify-around">
        <div className="flex-1 max-w-lg">
          <GenerateForm
            pdfItems={pdfItems}
            onGenerate={handleGenerate}
            isLoading={isLoading}
            loadingStep={loadingStep}
            topic={topic}
            setTopic={setTopic}
          />
        </div>
      </div>
    </main>
  );
}

// --- Generate Form Component ---
function GenerateForm({
  pdfItems,
  onGenerate,
  isLoading,
  loadingStep,
  topic,
  setTopic,
}: {
  pdfItems: Array<{ url: string; name: string }>;
  onGenerate: () => void;
  isLoading: boolean;
  loadingStep: LoadingStep | null;
  topic: string;
  setTopic: (t: string) => void;
}) {
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
        <LoadingSteps currentStep={loadingStep} />
      ) : (
        <NonSsr>
          <ServerStatusBadge />
        </NonSsr>
      )}
      <NonSsr>
        <PdfList pdfItems={pdfItems} />
      </NonSsr>
    </div>
  );
}

// --- Loading Steps Component ---
function LoadingSteps({ currentStep }: { currentStep: LoadingStep | null }) {
  // For progress bar
  const currentIndex = currentStep ? LOADING_STEPS.indexOf(currentStep) : 0;
  const percent = ((currentIndex + 1) / LOADING_STEPS.length) * 100;

  return (
    <div className="w-full">
      <div className="flex items-center mb-2">
        {LOADING_STEPS.map((step, idx) => (
          <React.Fragment key={step}>
            <div
              className={`flex items-center ${
                idx <= currentIndex
                  ? "text-blue-600 font-bold"
                  : "text-gray-400"
              }`}
            >
              <span className="text-sm">{step}</span>
              {idx < LOADING_STEPS.length - 1 && (
                <span className="mx-2">→</span>
              )}
            </div>
          </React.Fragment>
        ))}
      </div>
      <div className="relative pt-1">
        <div className="flex h-2 overflow-hidden bg-gray-200 rounded">
          <div
            style={{ width: `${percent}%` }}
            className="h-full bg-blue-500 transition-all"
          ></div>
        </div>
      </div>
    </div>
  );
}

// --- PDF List Component ---
function PdfList({
  pdfItems,
}: {
  pdfItems: Array<{ url: string; name: string }>;
}) {
  return (
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
  );
}

// --- File Icon Component ---
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

// --- Server Status Badge ---
const serverStatus = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_EXTERNAL_SERVER}`
    );
    return response.data;
  } catch (error) {
    return null;
  }
};

const ServerStatusBadge = () => {
  const [status, setStatus] = useState<{ status: string } | null>(null);
  const [retryInterval, setRetryInterval] = useState<NodeJS.Timeout | null>(
    null
  );

  useEffect(() => {
    const fetchStatus = async () => {
      const serverData = await serverStatus();
      setStatus(serverData);

      if (!serverData) {
        const interval = setTimeout(fetchStatus, 30000);
        setRetryInterval(interval);
      } else {
        if (retryInterval) {
          clearTimeout(retryInterval);
          setRetryInterval(null);
        }
      }
    };

    if (!status) {
      fetchStatus();
    }

    return () => {
      if (retryInterval) {
        clearTimeout(retryInterval);
      }
    };
  }, [status, retryInterval]);

  if (status === null) {
    return (
      <span className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
        Generation Server Offline
      </span>
    );
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
