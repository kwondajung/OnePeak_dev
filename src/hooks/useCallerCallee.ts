"use client";

import { createClient } from "@/utils/supabase/client";
import { useRef, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export const useCallerCallee = (roomId: string) => {
  const supabase = createClient();
  const [role, setRole] = useState<"Caller" | "Callee" | null>(null);
  const userId = useRef<string>(uuidv4()); // 고유 사용자 ID 생성

  useEffect(() => {
    const channel = supabase.channel(`video-${roomId}`, {
      config: {
        presence: {
          key: userId.current // 고유 사용자 ID를 Presence key로 사용
        }
      }
    });

    // 역할 설정이 아직 안 된 경우에만 설정
    const handlePresenceSync = () => {
      const users = channel.presenceState();
      const allUsers = Object.keys(users).map((key) => ({
        id: key
      }));

      // 접속 시간 기준 정렬
      allUsers.sort((a, b) => a.id.localeCompare(b.id));

      if (!role && allUsers.length === 2) {
        // 역할 설정
        if (allUsers[0]?.id === userId.current) {
          setRole("Callee"); // 가장 먼저 접속한 사용자는 Callee
        } else {
          setRole("Caller"); // 그 외 사용자는 Caller
        }
      }
    };

    channel.on("presence", { event: "sync" }, handlePresenceSync).subscribe(async (status) => {
      if (status !== "SUBSCRIBED") return;
      await channel.track({});
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [role, roomId, supabase]);

  return { role };
};
