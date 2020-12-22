# Website für das Projekt MINTegration

Die Website basiert auf dem Node.JS Express Framework. Die Website ist hier deployed:
https://mintegration-halle.de


## Deployment
### kubernetes
Mit helm-chart:
helm install ${PROJEKTNAME} . 
Falls man ein eigenes Image gebaut hat mit:
helm install ${PROJEKTNAME} . --set image.repository=${MYREGISTRY}/${MYNAMESPACE}/${MYIMAGENAME}

--> damit TLS und Zertifikat funktionieren wird cert-manager (https://cert-manager.io/docs/installation/kubernetes/) im Cluster erforderlich oder man kümmert sich selber um das Zertifikat

### lokal
docker build -t mintegration .
docker run -p 3000:3000 mintegration
--> im Browser localhost:3000

Alternativ:
npm install
npm start
--> im Browser localhost:3000

Datenbank Nutzung ist vorbereitet (mongodb), wird aber aktuell noch nicht genutzt, die Anwendung kann aber auch mit docker-compose up gestartet werden. Die dann gestartete Datenbank wird aber noch nicht gebraucht.


