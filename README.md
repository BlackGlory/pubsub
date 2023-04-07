# PubSub
提供基于HTTP的PubSub服务,
受到[patchbay], [smee.io]和[hookbot]启发.

[patchbay]: https://patchbay.pub/
[smee.io]: https://smee.io/
[hookbot]: https://github.com/sensiblecodeio/hookbot

## Install
### 从源代码运行
```sh
git clone https://github.com/BlackGlory/pubsub
cd pubsub
yarn install
yarn build
yarn bundle
yarn --silent start
```

### 从源代码构建
```sh
git clone https://github.com/BlackGlory/pubsub
cd pubsub
yarn install
yarn docker:build
```

### Recipes
#### docker-compose.yml
```yaml
version: '3.8'

services:
  pubsub:
    image: 'blackglory/pubsub'
    restart: always
    ports:
      - '8080:8080'
```

## API
### publish
`POST /namespaces/<namespace>/channels/<channel>`

往特定频道发布消息, 所有订阅此频道的客户端都会收到消息.

发送JSON:
```
JSONValue
```

#### Example
##### curl
```sh
curl \
  --header "Content-Type: application/json" \
  --data "$payload" \
  "http://localhost:8080/namespaces/$namespace/channels/$channel"
```

##### JavaScript
```js
fetch(`http://localhost:8080/namespaces/${namespace}/channels/${channel}`, {
  method: 'POST'
, headers: {
    'Content-Type': 'application/json'
  }
, body: JSON.stringify(content)
})
```

### subscribe
`GET /namespaces/<namespace>/channels/<channel>`

通过Server-Sent Events(SSE)订阅特定频道.

收到的每条JSON:
```
JSONValue
```

#### Example
##### sse-cat
```sh
sse-cat "http://localhost:8080/namespaces/$namespace/channels/$channel"
```

##### JavaScript
```js
const es = new EventSource(
  `http://localhost:8080/namespaces/${namespace}/channels/${channel}`
)
es.addEventListener('message', event => {
  const payload = event.data
  const content = JSON.parse(payload)
  console.log(content)
})
```

## 环境变量
### `PUBSUB_HOST`, `PUBSUB_PORT`
通过环境变量`PUBSUB_HOST`和`PUBSUB_PORT`决定服务器监听的地址和端口,
默认值为`localhost`和`8080`.

### heartbeat
#### `PUBSUB_SSE_HEARTBEAT_INTERVAL`
通过环境变量`PUBSUB_SSE_HEARTBEAT_INTERVAL`可以设置SSE心跳包的发送间隔, 单位为毫秒.
在默认情况下, 服务不会发送SSE心跳包,
此时半开连接的检测依赖于服务端和客户端的运行平台的TCP Keepalive配置.

当`PUBSUB_SSE_HEARTBEAT_INTERVAL`大于零时,
服务会通过SSE的heartbeat事件按指定间隔时间发送空白数据.
客户端若要实现半开连接检测, 则需要自行根据heartbeat事件设定计时器, 以判断连接是否正常.

## 客户端
- JavaScript/TypeScript(Node.js, Browser): <https://github.com/BlackGlory/pubsub-js>
