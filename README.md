# POC of npm cache poison

* start fake registry
```bash
cd server
npm start
```
* set npm to use this registry
```bash
npm config set registry http://localhost:6790
```
* run sandbox install(this command will drop cache to rewrite it with wrong metadata)
```bash
cd sandbox
npm start
```
**NOTE** this project has cyclic dependency(install will never end) drop this process after 20 sec
* hide registry rewrite
```bash
npm config delete registry
```
* you cache has invalid metadata if you will try install modules from sandbox malware meta will cause infinite install

# POC of npm endless data problem

* start fake registry
```bash
cd server
npm run endless
```
* set npm to use this registry
```bash
npm config set registry http://localhost:6790
```
* run sandbox install(this command will drop cache to rewrite it with wrong metadata)
```bash
cd sandbox
npm start
```
This install never ends, because fake registry emits endless archive

# POC of npm slow package retrieval

* start fake registry
```bash
cd server
npm run slow
```
* set npm to use this registry
```bash
npm config set registry http://localhost:6790
```
* run sandbox install(this command will drop cache to rewrite it with wrong metadata)
```bash
cd sandbox
npm start
```
This install will take 3 hours, because fake registry emits package content slowly.
