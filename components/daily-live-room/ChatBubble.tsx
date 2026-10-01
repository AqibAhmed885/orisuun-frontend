'use client';

import type { ChatMessage } from './types';
import type { ThemePalette } from './live-room-theme';
import { getAvatarTone } from './live-room-utils';

type Props = {
  message: ChatMessage;
  theme: ThemePalette;
  isSelf: boolean;
};

export default function ChatBubble({ message, theme, isSelf }: Props) {
  return (
    <div className={`flex items-end gap-3  ${isSelf ? 'flex-row-reverse' : ''}`}>
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xs font-semibold uppercase ${getAvatarTone(
          message.author,
          isSelf
        )}`}
        aria-hidden="true"
      >
        {message.avatar}
      </div>
      <div
        className={`flex-1 rounded-t-[16px] rounded-br-[16px] rounded-bl px-5 py-4 ${
          isSelf ? 'bg-[#E8EEFF]' : theme.mutedPanel
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-medium">
            {message.author} <span className="text-[#4f7cff]">{message.target}</span>
          </p>
          <span className={`text-sm ${theme.subtleText}`}>{message.time}</span>
        </div>
        <p className="mt-2 text-sm leading-6">{message.body}</p>
      </div>
    </div>
  );
}
