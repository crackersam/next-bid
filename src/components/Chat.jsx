"use client";

import { useEffect, useState, useRef } from "react";
import { socket } from "@/helpers/Socket";

export default function Home({ username }) {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [messages, setMessages] = useState({});
  const [users, setUsers] = useState({});
  const [recipient, setRecipient] = useState(null);
  const [hidden, setHidden] = useState(true);
  const [notify, setNotify] = useState(false);
  const hiddenRef = useRef(hidden);
  const messagesEndRef = useRef(null); // Ref for the messages container

  useEffect(() => {
    hiddenRef.current = hidden;
  }, [hidden]);

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);
      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });

      socket.emit("join", {
        username,
        socketId: socket.id,
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
      setMessages({});
      socket.emit("leave", socket.id);
    }
    function onMessage(message) {
      if (hiddenRef.current) {
        setNotify(true);
      } else {
        setNotify(false);
      }
      setMessages((prevMessages) => ({
        ...prevMessages,
        [Object.keys(prevMessages).length]: message,
      }));
    }
    function onJoin(users) {
      setUsers(users);
    }

    function onLeave(users) {
      setUsers(users);
    }
    socket.on("leave", onLeave);
    socket.on("join", onJoin);
    socket.on("message", onMessage);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("leave", onLeave);
      socket.off("join", onJoin);
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("message", onMessage);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]); // Scroll to bottom when messages update

  function formHandler(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const message = formData.get("message");
    if (!recipient) {
      socket.emit("message", {
        message: `Global: ${message}`,
        username,
        senderSocket: socket.id,
      });
    } else {
      socket.emit("message", {
        message: ` ${message}`,
        username,
        recipient: recipient[1],
        senderSocket: socket.id,
      });
    }
    e.target.reset();
  }
  const recipientHandler = (recipient) => {
    setRecipient(recipient);
  };

  return (
    <>
      {hidden && (
        <button
          onClick={() => {
            setHidden(false);
            setNotify(false);
          }}
          className={`bg-blue-500 ${
            notify && "bg-yellow-500"
          } text-white p-2 rounded-md absolute left-1 bottom-1`}
        >
          Chat
        </button>
      )}
      <div
        className={`bg-gray-200 p-2 rounded-md mt-3 absolute left-1 bottom-1 ${
          hidden && "hidden"
        }`}
      >
        <button
          className="absolute bg-red-800 text-white p-1 rounded-md right-1 top-1"
          onClick={() => setHidden(true)}
        >
          Close
        </button>
        <form onSubmit={formHandler}>
          <p>
            Status:{" "}
            {isConnected ? "connected" : "disconnected"}
          </p>
          <input
            type="text"
            name="message"
            className="p-2 m-2 rounded-sm w-96"
            placeholder={
              recipient
                ? `Message to ${recipient[0]}`
                : "Message"
            }
          />
          <button
            className="bg-blue-500 text-white rounded-md m-4 p-2"
            type="submit"
          >
            Send
          </button>
        </form>
        <ul className="flex flex-row overflow-y-auto">
          {Object.entries(users)
            .filter(([userEmail]) => userEmail !== username)
            .map(([username, socket]) => (
              <li key={username}>
                <span
                  onClick={() =>
                    recipientHandler([username, socket])
                  }
                  className="bg-blue-500 rounded-md text-white cursor-pointer mx-1 p-1"
                >
                  {username}
                </span>
              </li>
            ))}
        </ul>

        <ul className="mt-3 h-20 overflow-y-auto">
          {Object.entries(messages).map(
            ([key, message]) => (
              <li key={key}>
                {message.message}{" "}
                <span
                  className="bg-blue-500 text-white rounded-md cursor-pointer"
                  onClick={() =>
                    recipientHandler([
                      message.username,
                      message.senderSocket,
                    ])
                  }
                >
                  {message.username}
                </span>
              </li>
            )
          )}
          <div ref={messagesEndRef} />{" "}
          {/* Scroll target element */}
        </ul>
      </div>
    </>
  );
}
