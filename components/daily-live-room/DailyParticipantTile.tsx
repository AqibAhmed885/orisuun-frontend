'use client';

import { useEffect, useRef } from 'react';
import type { DailyParticipant } from '@daily-co/daily-js';
import { MicOff } from 'lucide-react';

type Props = {
    participant: DailyParticipant;
};

export default function DailyParticipantTile({ participant }: Props) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const videoTrack = participant.tracks?.video?.persistentTrack;
    const audioTrack = participant.tracks?.audio?.persistentTrack;
    const screenVideoTrack = participant.tracks?.screenVideo?.persistentTrack;
    const activeVideoTrack = screenVideoTrack || videoTrack;

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (!activeVideoTrack) {
            video.srcObject = null;
            return;
        }

        video.srcObject = new MediaStream([activeVideoTrack]);
        void video.play().catch(() => undefined);

        return () => {
            video.srcObject = null;
        };
    }, [activeVideoTrack]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || participant.local) return;

        if (!audioTrack) {
            audio.srcObject = null;
            return;
        }

        audio.srcObject = new MediaStream([audioTrack]);
        void audio.play().catch(() => undefined);

        return () => {
            audio.srcObject = null;
        };
    }, [audioTrack, participant.local]);

    const displayName =
        participant.user_name || (participant.local ? 'You' : 'Participant');
    const cameraOff = !activeVideoTrack;
    const microphoneOff =
        participant.tracks?.audio?.state === 'off' || !audioTrack;
    const isScreenShare = Boolean(screenVideoTrack);

    return (
        <div className="relative min-h-[220px] overflow-hidden rounded-xl ">
            <div
                className="absolute inset-0"
                style={{
                    background:
                        'radial-gradient(circle at 20% 20%, rgba(45, 91, 209, 0.38), transparent 34%)',
                }}
            />
            <div className="absolute inset-0 " />
            {!cameraOff ? (
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted={participant.local}
                    className={`h-full w-full object-cover ${participant.local && !isScreenShare ? '-scale-x-100' : ''
                        }`}
                />
            ) : (
                <div className="relative flex h-full min-h-[220px] items-center justify-center">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(45,91,209,0.16),transparent_40%)]" />
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[#2d5bd1] text-2xl font-semibold text-white shadow-[0_0_0_12px_rgba(45,91,209,0.12)]">
                        {displayName.charAt(0).toUpperCase()}
                    </div>
                </div>
            )}

            {!participant.local ? <audio ref={audioRef} autoPlay /> : null}

            <div className="absolute bottom-3 left-3 rounded-lg bg-black/60 px-3 py-1.5 text-sm text-white">
                {displayName}
                {participant.local ? ' (You)' : ''}
                {isScreenShare ? ' · Screen' : ''}
            </div>

            {microphoneOff ? (
                <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-red-600 px-2.5 py-1 text-xs text-white">
                    <MicOff className="h-3.5 w-3.5" />
                    Muted
                </div>
            ) : null}
        </div>
    );
}
