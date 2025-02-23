import sseclient
import gevent
import uuid
import random
from locust import HttpUser, TaskSet, task, between, User


class SseSubscribe(TaskSet):
    def __init__(self, parent: User):
        super().__init__(parent)
        self.order_id = None
        self.customer_id = None

    def on_start(self):
        # 在开始时生成唯一的 customerId 并建立 SSE 连接
        self.customer_id = str(uuid.uuid4())
        self.order_id = random.randint(1, 1543)
        self.connect_to_sse()

    def connect_to_sse(self):
        url = f"/sse/subscribe?id={self.order_id}&customerId={self.customer_id}"
        try:
            with self.client.get(url, stream=True) as response:
                client = sseclient.SSEClient(response)
                for event in client.events():
                    # 处理接收到的 SSE 消息
                    print(event.data)
                    self.parent.environment.events.request.fire(
                        request_type="GET",
                        name=url,
                        response_time=0,  # 可以根据需要设置实际响应时间
                        response_length=len(event.data)
                    )
        except Exception as e:
            self.parent.environment.events.request.fire(
                request_type="GET",
                name=url,
                response_time=0,  # 可以根据需要设置实际响应时间
                exception=e
            )

    @task
    def keep_connection(self):
        # 保持连接，不断接收消息
        gevent.sleep(20)


# class UpdateOrder(TaskSet):
#     def __init__(self, parent: User):
#         super().__init__(parent)
#
#     @task
#     def update_order(self):
#         order_id = str(random.randint(1, 1543))
#         item_id = str(random.randint(1, 9999)).zfill(4)
#         data = {
#             "id": order_id,
#             "items": [{
#                 "id": item_id,
#                 "qty": random.randint(1, 1000),
#                 "name": f"item_{item_id}"
#             }]
#         }
#         self.client.post("/sse/add_items", json=data,
#                          headers={"Content-Type": "application/json"})


class SubscriberUser(HttpUser):
    tasks = [SseSubscribe]
    wait_time = between(1, 5)

    def on_stop(self):
        # 在停止时关闭 SSE 连接
        self.client.close()


# class UpdateOrderUser(HttpUser):
#     tasks = [UpdateOrder]
#     wait_time = between(1, 5)
