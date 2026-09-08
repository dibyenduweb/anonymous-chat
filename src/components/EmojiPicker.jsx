import Picker from 'emoji-picker-react';

export default function EmojiPicker({ onEmojiClick }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-xl">
      <Picker 
        onEmojiClick={onEmojiClick}
        width={300}
        height={350}
        lazyLoadEmojis={true}
        theme="light"
        searchDisabled={false}
      />
    </div>
  );
}