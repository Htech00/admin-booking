import React from "react";

const NotificationBox = ({ notifications, onClose, onNotificationClick, chatBoxOpen }) => {
  return (
    <div
      className="
        fixed inset-x-4 top-16 z-50
        sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-3
        w-auto sm:w-80 md:w-96
        rounded-xl bg-[#ffffff] shadow-lg ring-1 ring-[#e5e7eb]
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#e5e7eb] bg-[#ffffff] rounded-xl">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <button
          className="text-sm text-[#4f46e5] hover:underline"
          onClick={onClose}
        >
          Close
        </button>
      </div>

      {/* Notification List */}
      <div className="max-h-[60vh] sm:max-h-80 overflow-y-auto px-4 py-2 bg-[#ffffff]">
        {notifications.length === 0 && (
          <p className="text-center text-gray-500 py-4">No new messages</p>
        )}

        {notifications.map((n, idx) => (
          <div
            key={idx}
            onClick={() => {
                onNotificationClick(n)
                chatBoxOpen(true)
            }
        }
            className={`flex gap-3 rounded-lg px-2 py-3 hover:bg-[#f9fafb] cursor-pointer ${
              !n.read ? "font-bold bg-[#f3f4f6]" : ""
            }`}
          >
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[#e5e7eb] text-[#374151] font-semibold">
              {n.senderType === "user" ? "U" : "A"}
            </div>

            <div className="text-sm whitespace-normal break-words">
              <span className="font-medium">
                {n.senderType === "user" ? `User ${n.senderId}` : "Admin"}
              </span>{" "}
              <span className="text-[#4b5563]">{n.message}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 pb-4 pt-3 bg-[#ffffff] ">
        <button
          onClick={onClose}
          className="
            w-full rounded-md bg-[#fa6328] px-4 py-2 text-sm font-medium text-[#ffffff] shadow
            hover:bg-[#e4571f] focus:outline-none focus:ring-2 focus:ring-[#fa6328]
          "
        >
          View All
        </button>
      </div>
    </div>
  );
};

export default NotificationBox;
