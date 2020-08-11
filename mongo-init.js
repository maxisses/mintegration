/*automated skript execution doesnt work... so  docker exec; mongo -u admin; use submissions;  */
db.createUser(
    {
        user: "maxisses",
        pwd: "051213",
        roles: [
            {
                role: "readWrite",
                db : "submissions"
            }
        ]
    }
);