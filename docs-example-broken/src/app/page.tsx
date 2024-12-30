'use client';

import { ToolInvocation } from 'ai';
import { Message, useChat } from 'ai/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, addToolResult } =
    useChat({
      maxSteps: 5,
      async onToolCall({ toolCall }) {
        if (toolCall.toolName === 'getLocation') {
          const cities = ['New York', 'Los Angeles', 'Chicago', 'San Francisco'];
          return cities[Math.floor(Math.random() * cities.length)];
        }
      },
    });

  return (
    <div style={{ padding: '1rem' }}>
      {messages.length === 0 ? (
        <p>No messages yet. Type something below!</p>
      ) : (
        messages.map((m: Message) => (
          <div key={m.id} style={{ marginBottom: '1rem' }}>
            <strong>{m.role}:</strong> {m.content}
            {m.toolInvocations?.map((toolInvocation: ToolInvocation) => {
              const toolCallId = toolInvocation.toolCallId;
              const addResult = (result: string) =>
                addToolResult({ toolCallId, result });

              if (toolInvocation.toolName === 'askForConfirmation') {
                return (
                  <div key={toolCallId}>
                    {toolInvocation.args.message}
                    <div>
                      {'result' in toolInvocation ? (
                        <b>{toolInvocation.result}</b>
                      ) : (
                        <>
                          <button onClick={() => addResult('Yes')}>Yes</button>
                          <button onClick={() => addResult('No')}>No</button>
                        </>
                      )}
                    </div>
                  </div>
                );
              }

              return 'result' in toolInvocation ? (
                <div key={toolCallId}>
                  Tool call {toolInvocation.toolName}: {toolInvocation.result}
                </div>
              ) : (
                <div key={toolCallId}>Calling {toolInvocation.toolName}...</div>
              );
            })}
          </div>
        ))
      )}

      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
