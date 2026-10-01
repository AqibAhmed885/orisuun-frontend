import { EmojiIcon } from '@/icons/chats/textarea-icons';
import React, { useEffect, useMemo, useState } from 'react';

const EmojiPicker = ({ handleEmojiSelector }) => {
  const [isPickerVisible, setPickerVisible] = useState(false);

  const togglePicker = () => setPickerVisible(!isPickerVisible);

  const handleEmojiClick = (emoji: string) => {
    handleEmojiSelector(emoji);
    setPickerVisible(false);
  };

  const emojis = Array.from({ length: 80 }, (_, i) =>
    (0x1f600 + i).toString(16).toUpperCase()
  );

  return (
    <div className="flex h-full">
      <button onClick={togglePicker}>
        <EmojiIcon className=' 3xl:min-h-[24px] 3xl:w-[24px] 2k:min-h-[36px] 2k:w-[36px]' />
      </button>

      {isPickerVisible && (
        <div className="absolute bottom-12 right-4 mt-2 w-48 max-h-44 overflow-auto bg-white border rounded-md shadow-md p-2 grid grid-cols-4 z-30">
          {emojis.map((unicode) => (
            <button
              key={unicode}
              className="text-2xl hover:bg-gray-100 rounded p-1 transition-colors duration-200"
              onClick={() => handleEmojiClick(unicode)}
            >
              {String.fromCodePoint(parseInt(unicode, 16))}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmojiPicker;
