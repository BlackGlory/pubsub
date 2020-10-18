# PubSub

一个受[patchbay], [smee.io], [hookbot]启发的Web友好的自托管ad-hoc微服务,
提供基于 HTTP SSE 和 WebSocket 的 PubSub 功能,
带有基于token和名单的访问控制策略,
支持JSON Schema.

受原理所限, 此服务不能实现消息的可靠传递(reliable delivery), 也无法重发消息.
因此当遭遇网络故障时, 消息可能会丢失.

所有URL都采用了反射性的CORS, 没有提供针对`Origin`的访问控制策略.

[patchbay]: https://patchbay.pub/
[smee.io]: https://smee.io/
[hookbot]: https://github.com/sensiblecodeio/hookbot

## Quickstart

sse-cat: <https://github.com/BlackGlory/sse-cat>
websocat: <https://github.com/vi/websocat>

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
    ports:
      - '8080:8080'
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

### publish via Webhook

`POST /pubsub/<id>/hook`

这是为带有headers的Webhook准备的HTTP端点, 它会按以下JSON格式转发HTTP请求:
```ts
{
  timestamp: number
  headers: { [name: string]: string }
  body: string
}
```

如果开启基于token的访问控制, 则可能需要在Querystring提供具有publish权限的token:
`POST /pubsub/<id>/hook?token=<token>`

#### publish via FormData

`POST /pubsub/<id>/form`

这是为FromData准备的HTTP端点, 它会按以下JSON格式转发FormData:
```ts
{
  [name: string]: string | string[]
}
```

如果开启基于token的访问控制, 则可能需要在Querystring提供具有publish权限的token:
`POST /pubsub/<id>/form?token=<token>`

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

#### Example

websocat
```sh
websocat ws://localhost:8080/pubsub/<id>
```

JavaScript
```js
const ws = new WebSocket('ws://localhost:8080')
ws.addEventListener('message', event => {
    console.log(event.data);
})
```

## 为publish添加JSON Schema验证

通过设置环境变量`PUBSUB_JSON_SCHEMA_VALIDATION=true`可开启publish的JSON Schema验证功能.

通过环境变量`PUBSUB_DEFAULT_JSON_SCHEMA`可设置默认的JSON Schema, 该验证仅对带有`Content-Type: application/json`的请求有效.

通过设置环境变量`PUBSUB_JSON_PAYLOAD_ONLY=true`, 可以强制publish只接受带有`Content-Type: application/json`的请求, 此设置在未开启JSON Schema验证的情况下也有效.

### 单独为id设置JSON Schema

可单独为id设置JSON Schema, 被设置的id将仅接受`Content-Type: application/json`请求.

#### 获取所有具有JSON Schema的消息队列id

`GET /api/pubsub-with-json-schema`

获取所有具有token的消息队列id, 返回由JSON表示的字符串数组`string[]`

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

PUBSUB提供两种访问控制策略, 可以一并使用.

所有访问控制API都使用基于口令的Bearer Token Authentication.
口令需通过环境变量`PUBSUB_ADMIN_PASSWORD`进行设置.

访问控制规则是通过[WAL模式]的SQLite3持久化的, 开启访问控制后,
服务器的吞吐量和响应速度会受到硬盘性能的影响.

已经存在的阻塞连接不会受到新的访问控制规则的影响.

[WAL模式]: https://www.sqlite.org/wal.html

### 基于名单的访问控制

通过设置环境变量`PUBSUB_LIST_BASED_ACCESS_CONTROL`开启基于名单的访问控制:
- `whitelist`
  启用基于消息队列白名单的访问控制, 只有在名单内的消息队列允许被访问.
- `blacklist`
  启用基于消息队列黑名单的访问控制, 只有在名单外的消息队列允许被访问.

#### 黑名单

##### 获取黑名单

`GET /api/blacklist`

获取位于黑名单中的所有消息队列id, 返回JSON表示的字符串数组`string[]`.

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

将特定消息队列加入黑名单.

###### Example

curl
```sh
curl \
  --request PUT \
  --header "Authorization: Bearer $ADMIN_PASSWORD"
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

将特定消息队列从黑名单中移除.

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

获取位于黑名单中的所有消息队列id, 返回JSON表示的字符串数组`string[]`.

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

将特定消息队列加入白名单.

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

将特定消息队列从白名单中移除.

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

基于token的访问控制将根据消息队列具有的token决定其访问规则, 具体行为见下方表格.
一个消息队列可以有多个token, 每个token可以单独设置入列权限和出列权限.
不同消息队列的token不共用.

| 此消息队列存在具有出列权限的token | 此消息队列存在具有入列权限的token | 行为 |
| --- | --- | --- |
| YES | YES | 只有使用具有相关权限的token才能执行操作 |
| YES | NO | 无token可以入列, 只有具有出列权限的token可以出列 |
| NO | YES | 无token可以出列, 只有具有入列权限的token可以入列 |
| NO | NO | 无token可以入列和出列 |

在开启基于token的访问控制时,
可以通过将环境变量`PUBSUB_DISABLE_NO_TOKENS`设置为`true`将无token的消息队列禁用.

基于token的访问控制作出了如下假定, 因此不使用加密和消息验证码(MAC):
- token的传输过程是安全的
- token难以被猜测
- token的意外泄露可以被迅速处理

#### 获取所有具有token的消息队列id

`GET /api/pubsub-with-tokens`

获取所有具有token的消息队列id, 返回由JSON表示的字符串数组`string[]`

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

#### 获取特定消息队列的所有token信息

`GET /api/pubsub/<id>/tokens`

获取特定消息队列的所有token信息, 返回JSON表示的token信息数组
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

#### 为特定消息队列的token设置入列权限

`PUT /api/pubsub/<id>/tokens/<token>/publish`

添加/更新token, 为token设置入列权限.

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

#### 取消特定消息队列的token的入列权限

`DELETE /api/pubsub/<id>/tokens/<token>/publish`

取消token的入列权限.

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

#### 为特定消息队列的token设置出列权限

`PUT /api/pubsub/<id>/tokens/<token>/subscribe`

添加/更新token, 为token设置出列权限.

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

#### 取消特定消息队列的token的入列权限

`DELETE /api/pubsub/<id>/tokens/<token>/subscribe`

取消token的出列权限.

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

PUBSUB支持HTTP/2, 以多路复用反向代理时的连接, 可通过设置环境变量`PUBSUB_HTTP2=true`开启.

此HTTP/2支持不提供从HTTP/1.1自动升级的功能, 亦不提供HTTPS.
因此, 在本地curl里进行测试时, 需要开启`--http2-prior-knowledge`选项.

## TODO
- [ ] 在更新访问控制规则时, 断开受影响的连接
- [ ] 配套的将STDOUT(指定分隔符)发布的工具/方法
- [ ] 配套的将订阅转发至本地Webhook的工具/方法
