# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.1.5](https://github.com/BlackGlory/pubsub/compare/v1.1.4...v1.1.5) (2022-07-27)

### [1.1.4](https://github.com/BlackGlory/pubsub/compare/v1.1.3...v1.1.4) (2022-06-08)


### Bug Fixes

* subscribe ([edc2489](https://github.com/BlackGlory/pubsub/commit/edc24897ea39016e5bf3c0f0bb9d781d7897f8cb))

### [1.1.3](https://github.com/BlackGlory/pubsub/compare/v1.1.2...v1.1.3) (2022-06-08)

### [1.1.2](https://github.com/BlackGlory/pubsub/compare/v1.1.1...v1.1.2) (2022-02-16)

### [1.1.1](https://github.com/BlackGlory/pubsub/compare/v1.1.0...v1.1.1) (2022-02-13)

## [1.1.0](https://github.com/BlackGlory/pubsub/compare/v1.0.0...v1.1.0) (2022-01-16)


### Features

* add accept-version support ([26affd5](https://github.com/BlackGlory/pubsub/commit/26affd5df97db8a38a2e385e847629f2c460259b))
* add cache-control header ([d882070](https://github.com/BlackGlory/pubsub/commit/d882070faefbb716d672c0bb0fd8df2771320ed1))

## [1.0.0](https://github.com/BlackGlory/pubsub/compare/v0.3.5...v1.0.0) (2021-11-21)


### Bug Fixes

* **docker:** healthcheck ([f6fb12a](https://github.com/BlackGlory/pubsub/commit/f6fb12a290b4e912978587eb0520edbfb0fe9376))

### [0.3.5](https://github.com/BlackGlory/pubsub/compare/v0.3.4...v0.3.5) (2021-10-14)

### [0.3.4](https://github.com/BlackGlory/pubsub/compare/v0.3.3...v0.3.4) (2021-07-13)

### [0.3.3](https://github.com/BlackGlory/pubsub/compare/v0.3.2...v0.3.3) (2021-07-12)

### [0.3.2](https://github.com/BlackGlory/pubsub/compare/v0.3.1...v0.3.2) (2021-07-03)

### [0.3.1](https://github.com/BlackGlory/pubsub/compare/v0.3.0...v0.3.1) (2021-06-21)


### Features

* add /health ([e8952ad](https://github.com/BlackGlory/pubsub/commit/e8952ad67a41153c0ab21e0ba172e25953e75197))


### Bug Fixes

* dependencies ([80267db](https://github.com/BlackGlory/pubsub/commit/80267db3eec974d224c1cc58137e713578dcee1d))
* docker build ([c6a6a33](https://github.com/BlackGlory/pubsub/commit/c6a6a33aa490f79126e8c65e9f6e0daf7089e2c2))

## [0.3.0](https://github.com/BlackGlory/pubsub/compare/v0.2.2...v0.3.0) (2021-04-27)


### ⚠ BREAKING CHANGES

* The database schema has been upgraded.

* rename ([f5f654d](https://github.com/BlackGlory/pubsub/commit/f5f654d7f7ffea7a3e8128e9345b52af7c588411))

### [0.2.2](https://github.com/BlackGlory/pubsub/compare/v0.2.1...v0.2.2) (2021-03-17)

### [0.2.1](https://github.com/BlackGlory/pubsub/compare/v0.2.0...v0.2.1) (2021-03-14)


### Bug Fixes

* /admin ([8ea11d3](https://github.com/BlackGlory/pubsub/commit/8ea11d39a34d507da3fdeab8d1cc799848ebf26d))

## 0.2.0 (2021-03-14)


### ⚠ BREAKING CHANGES

* rename /api to /admin
* /stats => /metrics
* the database needs to be rebuilt.
* the database needs to be rebuilt.
* PUBSUB_TOKEN_REQUIRED => PUBSUB_WRITE_TOKEN_REQUIRED
PUBSUB_TOKEN_REQUIRED => PUBSUB_READ_TOKEN_REQUIRED
* PUBSUB_DISABLE_NO_TOKENS => PUBSUB_TOKEN_REQUIRED

### Features

* add /stats ([9af95f6](https://github.com/BlackGlory/pubsub/commit/9af95f65357f45fc4e31c37bc240b7fee1affd5d))
* add an assertion ([ec6a42a](https://github.com/BlackGlory/pubsub/commit/ec6a42a549360615921ae1f077575b3a86f40958))
* add permission default constraints ([d0096a8](https://github.com/BlackGlory/pubsub/commit/d0096a83f36c0fe7191f33a66ce6cfa3f36acd47))
* add permission default constraints ([73aee0f](https://github.com/BlackGlory/pubsub/commit/73aee0f790ab0708cc871815764dedddb65c7ef6))
* add pubsub based on SSE ([d929caa](https://github.com/BlackGlory/pubsub/commit/d929caa1677286c0d04d0c6813e40199cde63eb6))
* add robots ([2c5bd37](https://github.com/BlackGlory/pubsub/commit/2c5bd370a19885e3b4db13b42a8f52d909f65a32))
* custom ajv options ([669d4bb](https://github.com/BlackGlory/pubsub/commit/669d4bb4daf2bc6371f276f4ba304e288d35149b))
* disable auto_vacuum ([d6fc7ed](https://github.com/BlackGlory/pubsub/commit/d6fc7ed99311c74d19a8c4ebd7bf97c908f766fa))
* handle SIGHUP ([5579c3e](https://github.com/BlackGlory/pubsub/commit/5579c3ec5b8b1168160d24834b0ce629d92bf02e))
* memoize environments ([880692f](https://github.com/BlackGlory/pubsub/commit/880692f276943ef87d289ef4a82b872686d5bcc7))
* oneOf => anyOf ([462b2e9](https://github.com/BlackGlory/pubsub/commit/462b2e953662ff598ad102e7769b4e252a087d22))
* port features from MPMC ([3a4c934](https://github.com/BlackGlory/pubsub/commit/3a4c9344da3b1c67ce432d26cae27fdf44af2d5d))
* port mpmc features for websocket ([1295f5a](https://github.com/BlackGlory/pubsub/commit/1295f5a436a50fb1a5b637aa0277692188abc530))
* prometheus metrics ([f5d8c91](https://github.com/BlackGlory/pubsub/commit/f5d8c917e4158f9ce93549cda338bdd94b9ff7bf))
* proof of concept ([e3fd059](https://github.com/BlackGlory/pubsub/commit/e3fd059d7391ef7b76f49b35515cab4ffbbb1332))
* rename /api to /admin ([7c962f5](https://github.com/BlackGlory/pubsub/commit/7c962f53fa13e3528142db1b35511cf09fffbcf4))
* rename stats to metrics ([cb66747](https://github.com/BlackGlory/pubsub/commit/cb6674768b6da760c90f5afc20dd8b75b739a8da))
* rewrite token-based access-control ([2349cab](https://github.com/BlackGlory/pubsub/commit/2349cabd6ea27c4cb46437363e83dc1df6af420b))
* split PUBSUB_TOKEN_REQUIRED ([307556b](https://github.com/BlackGlory/pubsub/commit/307556b5c6dbebe4cc8809a2414b79fb350b6e91))
* support pm2 ([438f0e3](https://github.com/BlackGlory/pubsub/commit/438f0e359f0a453434a61c499fce79a251b6b80a))
* support PUBSUB_DATA ([b198935](https://github.com/BlackGlory/pubsub/commit/b1989355072966adcdb5adaf12ffc227ff70acd3))
* support PUBSUB_PAYLOAD_LIMIT, PUBSUB_PUBLISH_PAAYLOAD_LIMIT ([6177d5a](https://github.com/BlackGlory/pubsub/commit/6177d5ae582ea536d30d3614f7369591fab3d39a))
* support schema migration ([13df4cb](https://github.com/BlackGlory/pubsub/commit/13df4cb05365c1823601e110447e832c7520443e))
* support sse heartbeat ([d974308](https://github.com/BlackGlory/pubsub/commit/d974308aa6d584d30e46ed0ff23dda48430ae66e))
* support ws heartbeat ([979c31a](https://github.com/BlackGlory/pubsub/commit/979c31adfd8cb08721883ce964208bc347f225be))


### Bug Fixes

* /stats ([2cb9c45](https://github.com/BlackGlory/pubsub/commit/2cb9c45a1a34846985fbc3cc30a9d140baa04068))
* assertions ([263132d](https://github.com/BlackGlory/pubsub/commit/263132dcad92fdafde51350ef1415f6b7921af72))
* docker build ([6f92f57](https://github.com/BlackGlory/pubsub/commit/6f92f57615d4fc64f597a13d9936aacb3b0f2d53))
* docker build ([7c08411](https://github.com/BlackGlory/pubsub/commit/7c0841136765c3db10fb1d2ca555ca3bf2545318))
* docker build ([4a60af9](https://github.com/BlackGlory/pubsub/commit/4a60af98d395c33e4647185e6943f7dab5f148dd))
* examples ([b795766](https://github.com/BlackGlory/pubsub/commit/b795766b2f9bdf0c068ee1a7b0f26868726d4988))
* payload limit ([79f3bcb](https://github.com/BlackGlory/pubsub/commit/79f3bcba231b6f3f804c359a0d73caf0a3d9e592))
* port ([31b1747](https://github.com/BlackGlory/pubsub/commit/31b17474de23c7a33bbb823fac363f7a9a1caa2b))
* process.on ([d2811fd](https://github.com/BlackGlory/pubsub/commit/d2811fda379366f6c0a931af3a189423891f9294))
* schema ([e6f9cac](https://github.com/BlackGlory/pubsub/commit/e6f9caca69e41749a3a933f6263a8cceaefccff2))
* start ([ca07764](https://github.com/BlackGlory/pubsub/commit/ca07764119979300c34aa39a128f895c032f4c46))
* support multiline text for SSE ([74f45ff](https://github.com/BlackGlory/pubsub/commit/74f45ff23602e4fc23ed1af4ffcbfed649a6cc49))
* tests ([7c40e8b](https://github.com/BlackGlory/pubsub/commit/7c40e8b601a06be81f630802160916c98410c8c6))
* token-based access control ([86e88bf](https://github.com/BlackGlory/pubsub/commit/86e88bfb59033a8ba64e45264107acbe841deb53))
* typoes ([0260372](https://github.com/BlackGlory/pubsub/commit/026037233a16ef91add0be41dedda61b1ca5ff7f))
* typoes ([499d04c](https://github.com/BlackGlory/pubsub/commit/499d04c3671a59751407d7a2c1899eace9edf401))
* websocket token-based access control ([d5ab00d](https://github.com/BlackGlory/pubsub/commit/d5ab00d1a8ba77f9e23c05f6fc36fa9babd02ed6))


* databases ([3eee9d5](https://github.com/BlackGlory/pubsub/commit/3eee9d58c9dbb9bd025ed693d290a7ac8be067b6))
* rename ([2bd6b5d](https://github.com/BlackGlory/pubsub/commit/2bd6b5d8324db154524c258ead1c16720ed9670f))
* rename ([c60cd10](https://github.com/BlackGlory/pubsub/commit/c60cd1003f315b97f208b3d950352d6ec20d878a))
