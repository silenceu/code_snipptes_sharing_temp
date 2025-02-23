export const addItem = () => {
  fetch('http://192.168.0.10:3000/sse/add_items', {
    method: 'POST',
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/json',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache',
      'Accept-Encoding': 'gzip, deflate, br',
    },
    keepalive: true,
    body: JSON.stringify({
      id: '1',
      items: [
        {
          id: '0017',
          qty: 10,
          name: 'item_0017',
        },
      ],
    }),
  })
    .then((response) => {
      // eslint-disable-next-line
      console.log(response);
    })
    .catch((error) => {
      // eslint-disable-next-line
      console.log(error);
    });
};

export const createOrder = () => {
  fetch('https://sse-ws-demo.k8s.shub.us:443/order/new', {
    method: 'POST',
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/json',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache',
      'Accept-Encoding': 'gzip, deflate, br',
    },
    keepalive: true,
    body: JSON.stringify({
      tableId: '1',
      items: [
        {
          id: '1',
          name: 'item_1',
          qty: 1,
        },
      ],
    }),
  })
    .then((response) => {
      // eslint-disable-next-line
      console.log(response);
    })
    .catch((error) => {
      // eslint-disable-next-line
      console.log(error);
    });
};
