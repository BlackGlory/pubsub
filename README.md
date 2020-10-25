# PubSub

一个受[patchbay], [smee.io], [hookbot]启发的Web友好的自托管ad-hoc微服务,
提供基于 HTTP, SSE 和 WebSocket 的 PubSub 功能,
带有基于token和名单的访问控制策略,
支持JSON Schema.

受原理所限, 此服务不能实现消息的可靠传递(reliable delivery), 也无法重发消息.
因此当遭遇网络故障时, 消息可能会丢失.

所有URL都采用了反射性的CORS, 没有提供针对`Origin`的访问控制策略.

[patchbay]: https://patchbay.pub/
[smee.io]: https://smee.io/
[hookbot]: https://github.com/sensiblecodeio/hookbot

## Quickstart

- sse-cat: <https://github.com/BlackGlory/sse-cat>
- websocat: <https://github.com/vi/websocat>

```sh
# 运行
docker run --detach --publish 8080:8080 blackglory/pubsub

# 打开第一个终端
sse-cat http://localhost:8080/pubsub/hello-world

# 打开第二个终端
websocat ws://localhost:8080/pubsub/hello-world

# 打开第三个终端
curl http://localhost:8080/pubsub/hello-world --data 'hello'
```

## Install & Run

### 从源代码运行

可以使用环境变量`PUBSUB_HOST`和`PUBSUB_PORT`决定服务器监听的地址和端口, 默认值为localhost和8080.

```sh
git clone https://github.com/BlackGlory/pubsub
cd pubsub
yarn install
yarn build
yarn --silent start
```

### Docker

```sh
docker run \
  --detach \
  --publish 8080:8080 \
  blackglory/pubsub
```

#### 从源代码构建

```sh
git clone https://github.com/BlackGlory/pubsub
cd pubsub
yarn install
yarn docker:build
```

#### Recipes

##### 公开服务器

docker-compose.yml
```yml
version: '3.8'

services:
  pubsub:
    image: 'blackglory/pubsub'
    restart: always
    environment:
      - PUBSUB_HOST=0.0.0.0
    volumes:
      - 'pubsub-data:/data'
    ports:
      - '8080:8080'

volumes:
  pubsub-data:
```

##### 私人服务器

docker-compose.yml
```yml
version: '3.8'

services:
  pubsub:
    image: 'blackglory/pubsub'
    restart: always
    environment:
      - PUBSUB_HOST=0.0.0.0
      - PUBSUB_ADMIN_PASSWORD=password
      - PUBSUB_TOKEN_BASED_ACCESS_CONTROL=true
      - PUBSUB_DISABLE_NO_TOKENS=true
    volumes:
      - 'pubsub-data:/data'
    ports:
      - '8080:8080'

volumes:
  pubsub-data:
```

## Usage

对id的要求: `^[a-zA-Z0-9\.\-_]{1,256}$`

### publish

`POST /pubsub/<id>`

往特定频道发布消息, 所有订阅此频道的客户端都会收到消息.
id用于标识频道.

如果开启基于token的访问控制, 则可能需要在Querystring提供具有publish权限的token:
`POST /pubsub/<id>?token=<token>`

#### Example

curl
```sh
curl \
  --data 'message' \
  "http://localhost:8080/pubsub/$id"
```

JavaScript
```js
fetch(`http://localhost:8080/pubsub/${id}`, {
  method: 'POST'
, body: 'message'
})
```

### subscribe via Server-Sent Events(SSE)

`GET /pubsub/<id>`

通过SSE订阅特定频道.
id用于标识频道.

使用SSE时, 建议服务器提供 HTTP/2 协议的反向代理.

如果开启基于token的访问控制, 则可能需要在Querystring提供具有subscribe权限的token:
`/pubsub/<id>?token=<token>`

#### Example

sse-cat
```sh
sse-cat "http://localhost:8080/pubsub/$id"
```

JavaScript
```js
const es = new EventSource(`http://localhost:8080/pubsub/$id`)
es.addEventListener('message', event => {
  console.log(event.data)
})
```

### subscribe via WebSocket

`WS /pubsub/<id>`

通过WebSocket订阅特定频道.
id用于标识频道.

如果开启基于token的访问控制, 则可能需要在Querystring提供具有subscribe权限的token:
`/pubsub/<id>?token=<token>`

注: 如果可以通过SSE订阅, 则推荐使用SSE订阅.
SSE在HTTP/2协议下可以多路复用, 而WebSocket会给每个连接单独开启新的连接.

#### Example

websocat
```sh
websocat "ws://localhost:8080/pubsub/$id"
```

JavaScript
```js
const ws = new WebSocket('ws://localhost:8080')
ws.addEventListener('message', event => {
    console.log(event.data);
})
```

## 为publish添加JSON验证

通过设置环境变量`PUBSUB_JSON_VALIDATION=true`可开启publish的JSON Schema验证功能.
任何带有`Content-Type: application/json`的请求都会被验证,
即使没有设置JSON Schema, 也会拒绝不合法的JSON文本.
JSON验证仅用于验证, 不会重新序列化消息, 因此subscribe得到的消息会与publish发送的消息相同.

在开启验证功能的情况下, 通过环境变量`PUBSUB_DEFAULT_JSON_SCHEMA`可设置默认的JSON Schema,
该验证仅对带有`Content-Type: application/json`的请求有效.

通过设置环境变量`PUBSUB_JSON_PAYLOAD_ONLY=true`,
可以强制enqueue只接受带有`Content-Type: application/json`的请求.
此设置在未开启JSON Schema验证的情况下也有效, 但在这种情况下服务器能够接受不合法的JSON.

### 单独为id设置JSON Schema

可单独为id设置JSON Schema, 被设置的id将仅接受`Content-Type: application/json`请求.

#### 获取所有具有JSON Schema的频道id

`GET /api/pubsub-with-json-schema`

获取所有具有JSON Schema的频道id, 返回由JSON表示的字符串数组`string[]`

##### Example

curl
```sh
curl \
  --header "Authorization: Bearer $ADMIN_PASSWORD" \
  "http://localhost:8080/api/pubsub-with-json-schema"
```

fetch
```js
await fetch('http://localhost:8080/api/pubsub-with-json-schema', {
  headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
}).then(res => res.json())
```

#### 获取JSON Schema

`GET /api/pubsub/<id>/json-schema`

##### Example

curl
```sh
curl \
  --header "Authorization: Bearer $ADMIN_PASSWORD" \
  "http://localhost:8080/api/pubsub/$id/json-schema"
```

fetch
```js
await fetch(`http://localhost:8080/api/pubsub/${id}/json-schema`, {
  headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
}).then(res => res.json())
```

#### 设置JSON Schema

`PUT /api/pubsub/<id>/json-schema`

##### Example

curl
```sh
curl \
  --request PUT \
  --header "Authorization: Bearer $ADMIN_PASSWORD" \
  --header "Content-Type: application/json" \
  --data "$JSON_SCHEMA" \
  "http://localhost:8080/api/pubsub/$id/jsonschema"
```

fetch
```js
await fetch(`http://localhost:8080/api/pubsub/${id}/json-schema`, {
  method: 'PUT'
, headers: {
    'Authorization': `Bearer ${adminPassword}`
    'Content-Type': 'application/json'
  }
, body: JSON.stringify(jsonSchema)
})
```

#### 移除JSON Schema

`DELETE /api/pubsub/<id>/json-schema`

##### Example

curl
```sh
curl \
  --request DELETE \
  --header "Authorization: Bearer $ADMIN_PASSWORD" \
  "http://localhost:8080/api/pubsub/$id/json-schema"
```

fetch
```js
await fetch(`http://localhost:8080/api/pubsub/${id}/json-schema`, {
  method: 'DELETE'
, headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
})
```

## 访问控制

PubSub提供两种访问控制策略, 可以一并使用.

所有访问控制API都使用基于口令的Bearer Token Authentication.
口令需通过环境变量`PUBSUB_ADMIN_PASSWORD`进行设置.

访问控制规则是通过[WAL模式]的SQLite3持久化的, 开启访问控制后,
服务器的吞吐量和响应速度会受到硬盘性能的影响.

已经存在的阻塞连接不会受到新的访问控制规则的影响.

[WAL模式]: https://www.sqlite.org/wal.html

### 基于名单的访问控制

通过设置环境变量`PUBSUB_LIST_BASED_ACCESS_CONTROL`开启基于名单的访问控制:
- `whitelist`
  启用基于频道白名单的访问控制, 只有在名单内的频道允许被访问.
- `blacklist`
  启用基于频道黑名单的访问控制, 只有在名单外的频道允许被访问.

#### 黑名单

##### 获取黑名单

`GET /api/blacklist`

获取位于黑名单中的所有频道id, 返回JSON表示的字符串数组`string[]`.

###### Example

curl
```sh
curl \
  --header "Authorization: Bearer $ADMIN_PASSWORD" \
  "http://localhost:8080/api/blacklist"
```

fetch
```js
await fetch('http://localhost:8080/api/blacklist', {
  headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
}).then(res => res.json())
```

##### 添加黑名单

`PUT /api/blacklist/<id>`

将特定频道加入黑名单.

###### Example

curl
```sh
curl \
  --request PUT \
  --header "Authorization: Bearer $ADMIN_PASSWORD" \
  "http://localhost:8080/api/blacklist/$id"
```

fetch
```js
await fetch(`http://localhost:8080/api/blacklist/${id}`, {
  method: 'PUT'
, headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
})
```

##### 移除黑名单

`DELETE /api/blacklist/<id>`

将特定频道从黑名单中移除.

###### Example

curl
```sh
curl \
  --request DELETE \
  --header "Authorization: Bearer $ADMIN_PASSWORD" \
  "http://localhost:8080/api/blacklist/$id"
```

fetch
```js
await fetch(`http://localhost:8080/api/blacklist/${id}`, {
  method: 'DELETE'
, headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
})
```

#### 白名单

##### 获取白名单

`GET /api/whitelist`

获取位于黑名单中的所有频道id, 返回JSON表示的字符串数组`string[]`.

##### Example

curl
```sh
curl \
  --header "Authorization: Bearer $ADMIM_PASSWORD" \
  "http://localhost:8080/api/whitelist"
```

fetch
```js
await fetch('http://localhost:8080/api/whitelist', {
  headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
}).then(res => res.json())
```

##### 添加白名单

`PUT /api/whitelist/<id>`

将特定频道加入白名单.

###### Example

curl
```sh
curl \
  --request PUT \
  --header "Authorization: Bearer $ADMIN_PASSWORD" \
  "http://localhost:8080/api/whitelist/$id"
```

fetch
```js
await fetch(`http://localhost:8080/api/whitelist/${id}`, {
  method: 'PUT'
, headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
})
```

##### 移除白名单

`DELETE /api/whitelist/<id>`

将特定频道从白名单中移除.

###### Example

curl
```sh
curl \
  --request DELETE \
  --header "Authorization: Bearer $ADMIN_PASSWORD" \
  "http://localhost:8080/api/whitelist/$id"
```

fetch
```js
await fetch(`http://localhost:8080/api/whitelist/${id}`, {
  method: 'DELETE'
, headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
})
```

### 基于token的访问控制

对token的要求: `^[a-zA-Z0-9\.\-_]{1,256}$`

通过设置环境变量`PUBSUB_TOKEN_BASED_ACCESS_CONTROL=true`开启基于token的访问控制.

基于token的访问控制将根据频道具有的token决定其访问规则, 具体行为见下方表格.
一个频道可以有多个token, 每个token可以单独设置publish权限和subscribe权限.
不同频道的token不共用.

| 此频道存在具有subscribe权限的token | 此频道存在具有publish权限的token | 行为 |
| --- | --- | --- |
| YES | YES | 只有使用具有相关权限的token才能执行操作 |
| YES | NO | 无token可以publish, 只有具有subscribe权限的token可以subscribe |
| NO | YES | 无token可以subscribe, 只有具有publish权限的token可以publish |
| NO | NO | 无token可以publish和subscribe |

在开启基于token的访问控制时,
可以通过将环境变量`PUBSUB_DISABLE_NO_TOKENS`设置为`true`将无token的频道禁用.

基于token的访问控制作出了如下假定, 因此不使用加密和消息验证码(MAC):
- token的传输过程是安全的
- token难以被猜测
- token的意外泄露可以被迅速处理

#### 获取所有具有token的频道id

`GET /api/pubsub-with-tokens`

获取所有具有token的频道id, 返回由JSON表示的字符串数组`string[]`

##### Example

curl
```sh
curl \
  --header "Authorization: Bearer $ADMIN_PASSWORD" \
  "http://localhost:8080/api/pubsub-with-tokens"
```

fetch
```js
await fetch(`http://localhost:8080/api/pubsub-with-tokens`, {
  headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
}).then(res => res.json())
```

#### 获取特定频道的所有token信息

`GET /api/pubsub/<id>/tokens`

获取特定频道的所有token信息, 返回JSON表示的token信息数组
`Array<{ token: string, publish: boolean, subscribe: boolean }>`.

##### Example

curl
```sh
curl \
  --header "Authorization: Bearer $ADMIN_PASSWORD" \
  "http://localhost:8080/api/pubsub/$id/tokens"
```

fetch
```js
await fetch(`http://localhost:8080/api/pubsub/${id}/tokens`, {
  headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
}).then(res => res.json())
```

#### 为特定频道的token设置publish权限

`PUT /api/pubsub/<id>/tokens/<token>/publish`

添加/更新token, 为token设置publish权限.

##### Example

curl
```sh
curl \
  --request PUT \
  --header "Authorization: Bearer $ADMIN_PASSWORD" \
  "http://localhost:8080/api/pubsub/$id/tokens/$token/publish"
```

fetch
```js
await fetch(`http://localhost:8080/api/pubsub/${id}/tokens/$token/publish`, {
  method: 'PUT'
, headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
})
```

#### 取消特定频道的token的publish权限

`DELETE /api/pubsub/<id>/tokens/<token>/publish`

取消token的publish权限.

##### Example

curl
```sh
curl \
  --request DELETE \
  --header "Authorization: Bearer $ADMIN_PASSWORD" \
  "http://localhost:8080/api/pubsub/$id/tokens/$token/publish"
```

fetch
```js
await fetch(`http://localhost:8080/api/pubsub/${id}/tokens/${token}/publish`, {
  method: 'DELETE'
, headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
})
```

#### 为特定频道的token设置subscribe权限

`PUT /api/pubsub/<id>/tokens/<token>/subscribe`

添加/更新token, 为token设置subscribe权限.

##### Example

curl
```sh
curl \
  --request PUT \
  --header "Authorization: Bearer $ADMIN_PASSWORD" \
  "http://localhost:8080/api/pubsub/$id/tokens/$token/subscribe"
```

fetch
```js
await fetch(`http://localhost:8080/api/pubsub/${id}/tokens/$token/subscribe`, {
  method: 'PUT'
, headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
})
```

#### 取消特定频道的token的publish权限

`DELETE /api/pubsub/<id>/tokens/<token>/subscribe`

取消token的subscribe权限.

##### Example

curl
```sh
curl \
  --request DELETE \
  --header "Authorization: Bearer $ADMIN_PASSWORD" \
  "http://localhost:8080/api/pubsub/$id/tokens/$token/subscribe"
```

fetch
```js
await fetch(`http://localhost:8080/api/pubsub/${id}/tokens/${token}/subscribe`, {
  method: 'DELETE'
, headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
})
```

## HTTP/2

PubSub支持HTTP/2, 以多路复用反向代理时的连接, 可通过设置环境变量`PUBSUB_HTTP2=true`开启.

此HTTP/2支持不提供从HTTP/1.1自动升级的功能, 亦不提供HTTPS.
因此, 在本地curl里进行测试时, 需要开启`--http2-prior-knowledge`选项.

## 限制Payload大小

设置环境变量`PUBSUB_PAYLOAD_LIMIT`可限制服务接受的单个Payload字节数, 默认值为1048576(1MB).

设置环境变量`PUBSUB_PUBLISH_PAYLOAD_LIMIT`可限制enqueue接受的单个Payload字节数, 默认值继承自`PUBSUB_PAYLOAD_LIMIT`.

## Webhook

PubSub的publish端点可用于Webhook,
但它不会转发请求头, IP地址等信息, 因此无法用于需要这些信息的场景.

在此项目的早期阶段, 曾设计过一个`/pubsub/<id>/webhook`端点,
该端点会生成包含必要信息的新JSON.
但随即便发现它无法与基于JSON Schema的JSON验证进行整合, 也无法防止伪造消息.
解决这些问题需要单独为Webhook创建新的数据库表和API接口,
这为PubSub添加了过多的职责, 严重增加了项目的复杂性, 因此该设计被放弃.

推荐的解决方案是为Webhook单独创建HTTP服务器, 生成包含所需信息的请求,
将其发送给PubSub.
在这种情况下, 可以通过添加具有publish权限的token的方式, 防止伪造请求.
