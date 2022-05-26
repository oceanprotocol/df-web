### Automating Dispense
In order to automate dispensing rewards inside of any vm, you will need both `df-py` and `df-web` repositories setup and configured properly.

You can then follow these steps in order to cron and dispense rewards. 


Make sure that dfpy_docker is executable: 
```
chmod a+x dfpy_docker
```
Edit Dockerfile to add the following (I was unable to execute this via setting up .env)
```
ENV DFTOOL_KEY=MY_PK
ENV WEB3_INFURA_PROJECT_ID=MY_INFURA_KEY
```
Copy rewards-TST.csv over to the df-py docker folder.
 ```
 cp rewards-TST.csv /tmp/dfpy/rewards/
```
Copy dispense-docker.js + package.json over to df-py
```
cp ../../../package.json /df-py/
cp dispense-docker.js /df-py/
```
Execute npm install inside df-py
```
cd /df-py/ && npm install
```
Start dispenser-docker inside of pm2
```
sudo pm2 start dispense-docker.js
```
