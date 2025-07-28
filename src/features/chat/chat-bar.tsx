"use client";

import { useState } from "react";

export function ChatBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  return isExpanded ? (
    <ExpandedChatBar setIsExpanded={setIsExpanded} />
  ) : (
    <FoldedChatBar setIsExpanded={setIsExpanded} />
  );
}
function FoldedChatBar({ setIsExpanded }: { setIsExpanded: (isExpanded: boolean) => void }) {
  return (
    <div className="flex flex-col items-center justify-between">
      <div></div>
      <button className="group mx-4 my-6 flex flex-row items-center justify-center" onClick={() => setIsExpanded(true)}>
        <svg className="text-primary-cta h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
          />
        </svg>
      </button>
    </div>
  );
}

function ExpandedChatBar({ setIsExpanded }: { setIsExpanded: (isExpanded: boolean) => void }) {
  return (
    <div className="flex min-w-sm flex-col px-4 py-2">
      {/* <div className="flex h-full w-full justify-between p-4"> */}
      {/* Chat Header */}
      <div className="flex flex-row items-center justify-between">
        <span className="text-primary text-lg font-medium tracking-tight">Chat</span>

        {/* Action buttons */}
        <div>
          <button
            className="group text-primary-cta flex flex-row items-center justify-center"
            onClick={() => setIsExpanded(false)}
          >
            <p className="mb-0.5 pr-1 text-sm font-thin">close</p>
            <svg
              className="h-6 w-6"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {" "}
              <path stroke="none" d="M0 0h24v24H0z" /> <line x1="20" y1="12" x2="10" y2="12" />{" "}
              <line x1="20" y1="12" x2="16" y2="16" /> <line x1="20" y1="12" x2="16" y2="8" />{" "}
              <line x1="4" y1="4" x2="4" y2="20" />
            </svg>
          </button>
        </div>
      </div>
      {/* </div> */}

      <div className="flex h-full flex-col"></div>
      {/* Chat Input */}
      <div className="flex w-full space-x-4">
        <input
          type="text"
          className="text-primary placeholder:text-primary-cta my-2 w-full rounded-md bg-gray-400/40 px-2 py-1 outline-none placeholder:text-sm"
          placeholder="Message"
        />
        <button className="group my-4 flex flex-row">
          <svg
            className="h-8 w-8 rounded-md bg-amber-600 text-white group-hover:opacity-80"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {" "}
            <path stroke="none" d="M0 0h24v24H0z" /> <line x1="12" y1="5" x2="12" y2="19" />{" "}
            <line x1="18" y1="11" x2="12" y2="5" /> <line x1="6" y1="11" x2="12" y2="5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
