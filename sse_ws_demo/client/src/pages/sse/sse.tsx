import { useEffect, useState, useRef } from 'react';
// eslint-disable-next-line
import { addItem, createOrder } from './api-request';

const eventSource = new EventSource(
  'http://192.168.0.10:3000/sse/subscribe?id=1&customerId=consumer_postman',
  { withCredentials: false },
);
// eslint-disable-next-line
console.log(eventSource);
console.log(eventSource.readyState);

export const SSETest = () => {
  const [message, setMessage] = useState('');
  const messageRef = useRef<string>();

  useEffect(() => {
    messageRef.current = message;
  }, [message]);

  useEffect(() => {
    console.log('UseEffect: ', message);
  }, [message]);

  useEffect(() => {
    console.log(111);

    eventSource.onmessage = (e) => {
      console.log(`on message server event: ${e}`);
    };

    eventSource.addEventListener('orderUpdate', (event) => {
      // 处理从服务器端发送的消息
      console.log(`server event: ${event}`);
    });

    eventSource.addEventListener('error', (error) => {
      console.log(error);
      setMessage(`SSE error:${JSON.stringify(error)}`);
    });
    // eventSource.onmessage = (event) => {
    //   // 处理从服务器端发送的消息
    //   console.log(event);
    //   setMessage(`Received message:${JSON.stringify(event.data)}`);
    // };

    // eventSource.onerror = (error) => {
    //   // 处理连接错误
    //   setMessage(`SSE error:${JSON.stringify(error)}`);
    // };

    return () => {
      // 在组件卸载时关闭连接
      eventSource.close();
    };
  }, []);

  return (
    <div className="App">
      <button
        data-test-id="test2"
        onClick={() => {
          addItem();
        }}
      >
        add item
      </button>
      <button
        data-test-id="test1"
        onClick={() => {
          createOrder();
        }}
      >
        create order
      </button>
      <p>{message}</p>
    </div>
  );
};

SSETest.displayName = 'SSETest';

export default SSETest;
