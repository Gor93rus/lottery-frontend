/**
 * Ticket Processing Indicator
 * Visual feedback for lottery operations
 */

export function TicketLoader({ text = 'Processing' }: { text?: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 bg-purple-600 rounded-full"
            style={{
              animation: `bounce 1s infinite ${i * 0.15}s`,
            }}
          />
        ))}
      </div>
      <span className="text-sm">{text}</span>
    </div>
  );
}

export function DrawLoader({ overlayScreen = false }: { overlayScreen?: boolean }) {
  const content = (
    <div className="text-center p-6">
      <div className="inline-flex gap-2 mb-3">
        {[1, 2, 3, 4, 5].map((num) => (
          <div
            key={num}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold"
            style={{
              animation: `pulse 1.5s ease-in-out infinite ${num * 0.2}s`,
            }}
          >
            {num}
          </div>
        ))}
      </div>
      <p className="text-gray-600 dark:text-gray-400">Loading lottery data...</p>
    </div>
  );

  return overlayScreen ? (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl">{content}</div>
    </div>
  ) : content;
}
