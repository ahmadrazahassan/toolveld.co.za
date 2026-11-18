"use client";

import { useState, useSyncExternalStore, useTransition } from "react";
import { ThumbsUp } from "lucide-react";
import { toast } from "sonner";
import { markReviewHelpful } from "@/lib/actions/forms";
import { cn } from "@/lib/utils";

const VOTER_KEY = "toolveld-voter";
const VOTES_KEY = "toolveld-helpful";

function voterId() {
  try {
    let id = window.localStorage.getItem(VOTER_KEY);
    if (!id) {
      id = crypto.randomUUID();
      window.localStorage.setItem(VOTER_KEY, id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

function readVotes(): string {
  try {
    return window.localStorage.getItem(VOTES_KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

const noop = () => () => {};

/** One vote per browser. The count is kept by a database trigger. */
export function HelpfulButton({ reviewId, count }: { reviewId: string; count: number }) {
  const stored = useSyncExternalStore(noop, readVotes, () => "[]");
  const [localVoted, setLocalVoted] = useState(false);
  const [extra, setExtra] = useState(0);
  const [pending, start] = useTransition();
  const voted = localVoted || (JSON.parse(stored) as string[]).includes(reviewId);

  const vote = () => {
    if (voted) return;
    start(async () => {
      const res = await markReviewHelpful(reviewId, voterId());
      if (res.ok) {
        setExtra(1);
        setLocalVoted(true);
        try {
          const list = JSON.parse(readVotes()) as string[];
          window.localStorage.setItem(VOTES_KEY, JSON.stringify([...list, reviewId]));
        } catch {
          // Storage blocked; the vote still counted on the server.
        }
      } else {
        toast(res.message);
      }
    });
  };

  return (
    <button
      type="button"
      onClick={vote}
      disabled={pending || voted}
      aria-pressed={voted}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[13px] font-medium transition",
        voted ? "bg-ink text-white" : "bg-bone text-ink ring-1 ring-inset ring-border-strong hover:bg-border",
      )}
    >
      <ThumbsUp size={13} aria-hidden="true" />
      Helpful <span className="tabular">({count + extra})</span>
    </button>
  );
}
