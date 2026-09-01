"use client";

import { useEffect, useRef } from "react";

const YOUTUBE_VIDEO_ID = "Uv4FgV3Hhog";

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    YT?: any;
  }
}

export default function BackgroundAudio({ enabled }: { enabled: boolean }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);
  const playerReadyRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    function initPlayer() {
      if (!window.YT || !window.YT.Player || playerRef.current) return;

      playerRef.current = new window.YT.Player("youtube-bg-audio-player", {
        height: "0",
        width: "0",
        videoId: YOUTUBE_VIDEO_ID,
        playerVars: {
          autoplay: enabled ? 1 : 0,
          start: 10,
          loop: 1,
          playlist: YOUTUBE_VIDEO_ID,
          controls: 0,
          showinfo: 0,
          autohide: 1,
          modestbranding: 1,
        },
        events: {
          onReady: (event: {
            target: {
              playVideo: () => void;
              seekTo: (seconds: number, allowSeekAhead: boolean) => void;
              setVolume: (v: number) => void;
            };
          }) => {
            if (!isMounted) return;
            playerReadyRef.current = true;
            try {
              event.target.setVolume(50);
              if (enabled) {
                event.target.seekTo(6, true);
                event.target.playVideo();
              }
            } catch (e) {
              // Ignore player initialization errors
            }
          },
        },
      });
    }

    if (typeof window !== "undefined") {
      if (!window.YT) {
        const existingScript = document.getElementById("youtube-iframe-api");
        if (!existingScript) {
          const script = document.createElement("script");
          script.id = "youtube-iframe-api";
          script.src = "https://www.youtube.com/iframe_api";
          document.head.appendChild(script);
        }

        const prevCallback = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
          if (prevCallback) prevCallback();
          initPlayer();
        };
      } else {
        initPlayer();
      }
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // React to toggle changes & play/pause
  useEffect(() => {
    if (playerRef.current && playerReadyRef.current) {
      try {
        if (enabled) {
          if (
            playerRef.current.getCurrentTime &&
            playerRef.current.getCurrentTime() < 6
          ) {
            playerRef.current.seekTo(6, true);
          }
          playerRef.current.playVideo();
        } else {
          playerRef.current.pauseVideo();
        }
      } catch (e) {
        // Ignore play/pause exceptions
      }
    }
  }, [enabled]);

  // Fallback for browser autoplay policies: play on user interaction if enabled
  useEffect(() => {
    if (!enabled) return;

    const handleUserInteraction = () => {
      if (playerRef.current && playerReadyRef.current && enabled) {
        try {
          if (
            playerRef.current.getCurrentTime &&
            playerRef.current.getCurrentTime() < 6
          ) {
            playerRef.current.seekTo(6, true);
          }
          playerRef.current.playVideo();
        } catch (e) {
          // Ignore
        }
      }
    };

    window.addEventListener("click", handleUserInteraction, { once: true });
    window.addEventListener("keydown", handleUserInteraction, { once: true });
    window.addEventListener("mousemove", handleUserInteraction, { once: true });
    window.addEventListener("touchstart", handleUserInteraction, { once: true });

    return () => {
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("keydown", handleUserInteraction);
      window.removeEventListener("mousemove", handleUserInteraction);
      window.removeEventListener("touchstart", handleUserInteraction);
    };
  }, [enabled]);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: -9999,
        left: -9999,
        width: 1,
        height: 1,
        opacity: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <div id="youtube-bg-audio-player" />
    </div>
  );
}
