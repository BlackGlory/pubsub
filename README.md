# PubSub
提供基于HTTP, SSE和WebSocket的PubSub服务,
受到[patchbay], [smee.io]和[hookbot]启发.

[patchbay]: https://patchbay.pub/
[smee.io]: https://smee.io/
[hookbot]: https://github.com/sensiblecodeio/hookbot

## Quickstart
- sse-cat: https://github.com/BlackGlory/sse-cat
- websocat: https://github.com/vi/websocat

```sh
# 启动服务
docker run \
  --detach \
  --publish 8080:8080 \
  blackglory/pubsub

# 第一个终端(接收)
sse-cat http://localhost:8080/channel/hello-world

# 第二个终端(接收)
websocat ws://localhost:8080/channel/hello-world

# 第三个终端(发送)
curl http://localhost:8080/channel/hello-world \
  --data 'hello'
```

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
`POST /channels/<channel>`

往特定频道发布消息, 所有订阅此频道的客户端都会收到消息.

#### Example
##### curl
```sh
curl \
  --data 'message' \
  "http://localhost:8080/channel/$channel"
```

##### JavaScript
```js
fetch(`http://localhost:8080/channel/${channel}`, {
  method: 'POST'
, body: 'message'
})
```

### subscribe via Server-Sent Events(SSE)
`GET /channels/<channel>`

通过SSE订阅特定频道.

##### heartbeat
通过环境变量`PUBSUB_SSE_HEARTBEAT_INTERVAL`可以设置SSE心跳包的发送间隔, 单位为毫秒.
在默认情况下, 服务不会发送SSE心跳包,
半开连接的检测依赖于服务端和客户端的运行平台的TCP Keepalive配置.

当`PUBSUB_SSE_HEARTBEAT_INTERVAL`大于零时,
服务会通过SSE的heartbeat事件按指定间隔发送空白数据.
客户端若要实现半开连接检测, 则需要自行根据heartbeat事件设定计时器, 以判断连接是否正常.

#### Example
##### sse-cat
```sh
sse-cat "http://localhost:8080/channel/$channel"
```

##### JavaScript
```js
const es = new EventSource(`http://localhost:8080/channel/${channel}`)
es.addEventListener('message', event => {
  console.log(event.data)
})
```

### subscribe via WebSocket
`WS /channels/<channel>`

通过WebSocket订阅特定频道.

#### heartbeat
通过环境变量`PUBSUB_WS_HEARTBEAT_INTERVAL`可以设置WS心跳包(ping帧)的发送间隔, 单位为毫秒.
在默认情况下, 服务不会发送心跳包,
半开连接的检测依赖于服务端和客户端的运行平台的TCP Keepalive配置.

当`PUBSUB_WS_HEARTBEAT_INTERVAL`大于零时,
服务会通过WS的ping帧按间隔发送心跳包.

客户端若要实现半开连接检测, 可以定期发送空白字符串到服务端, 以判断连接是否正常.
为防止带宽滥用, 如果客户端发送的不是空白字符串, 则服务端会主动关闭连接.

#### Example
##### websocat
```sh
websocat "ws://localhost:8080/channel/$channel"
```

##### JavaScript
```js
const ws = new WebSocket(`ws://localhost:8080/channel/${channel}`)
ws.addEventListener('message', event => {
  console.log(event.data)
})
```
