const btnSearch = document.querySelector("#btn-search");
const zoneResult = document.querySelector("#search-result");
const tableResult = document.querySelector("#result-zone");
const tblhead1 = document.querySelector("#tbl-head-1");
const tblhead2 = document.querySelector("#tbl-head-2");
const tblhead3 = document.querySelector("#tbl-head-3");
const tblhead4 = document.querySelector("#tbl-head-4");
const tblhead5 = document.querySelector("#tbl-head-5");
const messagedefault = document.querySelector("#default-message-content");

btnSearch.addEventListener("click", function (ev) {
   
    ev.preventDefault();
    const searchmessage = document.querySelector("#search-input").value;
    if (searchmessage == "" ){
        setModalContent("Recherche non valide", function (message) {
            const pAlert = document.createElement("p");
            pAlert.textContent = "Veuillez saisir une recherche";                    
            message.appendChild(pAlert);
        });
        showModal();
    }
    else{
    const typeSearch = document.querySelector("#type-search").value;
    const limit = 100;
    let offset = 0;
    if (typeSearch == "everything") {
        getEverything(searchmessage, limit, offset)
    }
    else if (typeSearch == "artist") {
        getArtist(searchmessage, limit, offset)
    }
    else if (typeSearch == "title") {
        getTitle(searchmessage, limit, offset);
    }
    else if (typeSearch == "album") {
        getAlbum(searchmessage, limit, offset);
    }
}
})

function getEverything(value, limit, offset) {
    reset();
    let count = 0;
    let countResults = 0;
    const requestGetCount = new XMLHttpRequest();
    requestGetCount.open("GET", "https://musicbrainz.org/ws/2/recording?query=" + encodeURIComponent('"' + value + '"') + "&limit=" + limit + "&offset=" + offset + "&fmt=json", true);
    requestGetCount.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    requestGetCount.addEventListener("readystatechange", function () {
        if (requestGetCount.readyState === XMLHttpRequest.DONE) {
            if (requestGetCount.status === 200) {
                const responseGetCount = JSON.parse(requestGetCount.responseText);
                if (responseGetCount.count == 0) {
                    
                    messagedefault.textContent = "Aucun résultat";
                    tableResult.appendChild(messagedefault);

                } else {
                    let pCount = document.createElement("p");
                    if (responseGetCount.count > 1){
                        pCount.textContent = "Il y a : "+ responseGetCount.count + " Résultats";
                    }
                    else
                    {
                        pCount.textContent = "Il y a : "+ responseGetCount.count + " Résultat";
                    }
                    tableResult.appendChild(pCount);

                    let nbResults = 0;
                    function getEverythingRes() {
                        const requestGetEverything = new XMLHttpRequest();
                        requestGetEverything.open("GET", "https://musicbrainz.org/ws/2/recording?query=" + encodeURIComponent('"' + value + '"') + "&limit=" + limit + "&offset=" + nbResults + "&fmt=json", true);
                        requestGetEverything.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                        requestGetEverything.addEventListener("readystatechange", function () {
                            if (requestGetEverything.readyState === XMLHttpRequest.DONE) {
                                if (requestGetEverything.status === 200) {
                                    const responseGetEverything = JSON.parse(requestGetEverything.responseText);
                                  
                        

                                    for (let i = 0; i < 100; i++) {
                                        countResults = i + count * 100 + 1;
                                        if (countResults > responseGetCount.count) {
                                            clearInterval(stop);
                                            break;
                                        }
                                        let artist = "";
                                        if (responseGetEverything.recordings[i]['artist-credit'] == undefined) {
                                            artist = "Inconnue";
                                        } else {
                                            artist = responseGetEverything.recordings[i]['artist-credit'][0].name;
                                        }
                                        const title = responseGetEverything.recordings[i].title;
                                        const length = millisToMinutes(responseGetEverything.recordings[i].length);
                                        const genre = responseGetEverything.recordings[i].tag;
                                
                                        let album = "";
                                        let id = []
                                        if (responseGetEverything.recordings[i]['releases'] == undefined) {
                                            album = "Inconnue";
                                        } else {
                                            album = responseGetEverything.recordings[i]['releases'][0].title;
                                            for (let j = 0; j < responseGetEverything.recordings[i].releases.length; j++) {
                                                id.push(responseGetEverything.recordings[i].releases[j].id);
                                            }
                                        }

                                        const trRes = document.createElement("tr");
                                        const tdCol1 = document.createElement("td");
                                        const tdCol2 = document.createElement("td");
                                        const tdCol3 = document.createElement("td");
                                        const tdCol4 = document.createElement("td");
                                        const tdCol5 = document.createElement("td");
                                        const btnAction = document.createElement("button");

                                        btnAction.className = "btn btn-outline-primary";

                                        btnAction.setAttribute("type", "button");
                                        btnAction.setAttribute("id", "btn-info");

                                        tableResult.appendChild(trRes);
                                        trRes.appendChild(tdCol1);
                                        trRes.appendChild(tdCol2);
                                        trRes.appendChild(tdCol3);
                                        trRes.appendChild(tdCol4);
                                        trRes.appendChild(tdCol5);
                                        tdCol5.appendChild(btnAction);

                                        tdCol1.textContent = countResults;
                                        tdCol2.textContent = artist;
                                        tdCol3.textContent = title;
                                        tdCol4.textContent = album;
                                        btnAction.textContent = "+";

                                        btnAction.addEventListener('click', function (e) {

                                            setModalContent("Information", function (root) {

                                                const pArtist = document.createElement("p");
                                                const pAlbum = document.createElement("p");
                                                const pGenre = document.createElement("p");
                                                const pLenght = document.createElement("p");
                                               
                                                const titleCover = document.createElement("h2");
                                                pArtist.textContent = "Artist : " + artist;
                                                pAlbum.textContent = "Album : " + album;
                                                pGenre.textContent = "Genre : " + genre;
                                                pLenght.textContent = "Length : " + length;
                                               
                                                titleCover.textContent = "Cover";

                                                root.appendChild(pArtist);
                                                root.appendChild(pAlbum);
                                                root.appendChild(pGenre);
                                                root.appendChild(pLenght);
                                              
                                                root.appendChild(titleCover);
                                            });
                                            showModal();
                                            for (k in id) {
                                                const requestGetCover = new XMLHttpRequest();
                                                const zoneCover = document.querySelector("#modal .modal-content");
                                                requestGetCover.open("GET", "https://coverartarchive.org/release/" + id[k]);
                                                requestGetCover.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                                                requestGetCover.addEventListener("readystatechange", function () {
                                                    if (requestGetCover.readyState === XMLHttpRequest.DONE) {
                                                        if (requestGetCover.status === 200) {
                                                            const responseCover = JSON.parse(requestGetCover.responseText);
                                                           
                                                            
                                                            for (let i = 0; i < responseCover.images.length; i++) {
                                                                let image = "";
                                                                if (responseCover.images[i].thumbnails.small === undefined) {
                                                                    const textNoCover = document.createElement("p");
                                                                    textNoCover.textContent = "No cover";
                                                                    zoneCover.appendChild(textNoCover);
                                                                }
                                                                else {
                                                                    image = responseCover.images[i].thumbnails.small;
                                                                
                                                                    const cover = document.createElement("img");
                                                                    cover.className = 'img-cover'
                                                                    cover.setAttribute('src', image);
                                                                    cover.setAttribute('alt', "Cover of the album");
                                                                    zoneCover.appendChild(cover);
                                                                }
                                                            }
                                                        
                                                        }
                                              

                                                    }
                                                    
                                                });
                                             
                                               
                                                requestGetCover.send();
                                            }

                                        });
                                    }
                                    count += 1;

                                }
                                else {
                                    setModalContent("Alert", function (message) {
                                        const pAlert = document.createElement("p");
                                        pAlert.textContent = "Une erreur réseau est survenue : veuillez contacter l'administrateur !";                    
                                        message.appendChild(pAlert);
                                    });
                                    showModal();
                                }
                            }
                        });
                        requestGetEverything.send();
                        nbResults += 100;
                       
                    }
                    const stop = setInterval(getEverythingRes, 1001);
                  
                }

            }
            else {
                setModalContent("Alert", function (message) {
                    const pAlert = document.createElement("p");
                    pAlert.textContent = "Une erreur réseau est survenue : veuillez contacter l'administrateur !";                    
                    message.appendChild(pAlert);
                });
                showModal();
            }
        }
    });
    requestGetCount.send();
}

function getAlbum(value, limit, offset) {
   reset();
    let count = 0;
    let countResults = 0;
    const requestGetCount = new XMLHttpRequest();
    requestGetCount.open("GET", "https://musicbrainz.org/ws/2/recording?query=release:" + encodeURIComponent('"' + value + '"') + "&limit=" + limit + "&offset=" + offset + "&fmt=json", true);
    requestGetCount.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    requestGetCount.addEventListener("readystatechange", function () {
        if (requestGetCount.readyState === XMLHttpRequest.DONE) {
            if (requestGetCount.status === 200) {
                const responseGetCount = JSON.parse(requestGetCount.responseText);
                if (responseGetCount.count == 0) {
                    messagedefault.textContent = "Aucun résultat"
                    tableResult.appendChild(messagedefault);

                } else {
                    let pCount = document.createElement("p");
                    if (responseGetCount.count > 1){
                        pCount.textContent = "Il y a : "+ responseGetCount.count + " Résultats";
                    }
                    else
                    {
                        pCount.textContent = "Il y a : "+ responseGetCount.count + " Résultat";
                    }
                    tableResult.appendChild(pCount);
                    let nbResults = 0;
                    function getArtistRes() {
                        const requestGetArtist = new XMLHttpRequest();
                        requestGetArtist.open("GET", "https://musicbrainz.org/ws/2/recording?query=release:" + encodeURIComponent('"' + value + '"') + "&limit=" + limit + "&offset=" + nbResults + "&fmt=json", true);
                        requestGetArtist.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                        requestGetArtist.addEventListener("readystatechange", function () {
                            if (requestGetArtist.readyState === XMLHttpRequest.DONE) {
                                if (requestGetArtist.status === 200) {
                                    const responseGetArtist = JSON.parse(requestGetArtist.responseText);
                                    

                                    for (let i = 0; i < 100; i++) {
                                        countResults = i + count * 100 + 1;
                                        if (countResults > responseGetCount.count) {
                                            clearInterval(stop);
                                            break;
                                        }
                                        let artist = "";
                                        if (responseGetArtist.recordings[i]['artist-credit'] == undefined) {
                                            artist = "Inconnue";
                                        } else {
                                            artist = responseGetArtist.recordings[i]['artist-credit'][0].name;
                                        }
                                        const title = responseGetArtist.recordings[i].title;
                                        const length = millisToMinutes(responseGetArtist.recordings[i].length);
                                        const genre = responseGetArtist.recordings[i].tag;
                                
                                        let album = "";
                                        let id = []
                                        if (responseGetArtist.recordings[i]['releases'] == undefined) {
                                            album = "Inconnue";
                                        } else {
                                            album = responseGetArtist.recordings[i]['releases'][0].title;
                                            for (let j = 0; j < responseGetArtist.recordings[i].releases.length; j++) {
                                                id.push(responseGetArtist.recordings[i].releases[j].id);
                                            }
                                        }

                                        const trRes = document.createElement("tr");
                                        const tdCol1 = document.createElement("td");
                                        const tdCol2 = document.createElement("td");
                                        const tdCol3 = document.createElement("td");
                                        const tdCol4 = document.createElement("td");
                                        const tdCol5 = document.createElement("td");
                                        const btnAction = document.createElement("button");

                                        btnAction.className = "btn btn-outline-primary";

                                        btnAction.setAttribute("type", "button");
                                        btnAction.setAttribute("id", "btn-info");

                                        tableResult.appendChild(trRes);
                                        trRes.appendChild(tdCol1);
                                        trRes.appendChild(tdCol2);
                                        trRes.appendChild(tdCol3);
                                        trRes.appendChild(tdCol4);
                                        trRes.appendChild(tdCol5);
                                        tdCol5.appendChild(btnAction);

                                        tdCol1.textContent = countResults;
                                        tdCol2.textContent = artist;
                                        tdCol3.textContent = title;
                                        tdCol4.textContent = album;
                                        btnAction.textContent = "+";

                                        btnAction.addEventListener('click', function (e) {

                                            setModalContent("Information", function (root) {

                                                const pArtist = document.createElement("p");
                                                const pAlbum = document.createElement("p");
                                                const pGenre = document.createElement("p");
                                                const pLenght = document.createElement("p");
                                     
                                                const titleCover = document.createElement("h2");
                                                pArtist.textContent = "Artist : " + artist;
                                                pAlbum.textContent = "Album : " + album;
                                                pGenre.textContent = "Genre : " + genre;
                                                pLenght.textContent = "Length : " + length;
                                        
                                                titleCover.textContent = "Cover";

                                                root.appendChild(pArtist);
                                                root.appendChild(pAlbum);
                                                root.appendChild(pGenre);
                                                root.appendChild(pLenght);
                                               
                                                root.appendChild(titleCover);
                                            });
                                            showModal();
                                            for (k in id) {
                                                const requestGetCover = new XMLHttpRequest();
                                                const zoneCover = document.querySelector("#modal .modal-content");
                                                requestGetCover.open("GET", "https://coverartarchive.org/release/" + id[k]);
                                                requestGetCover.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                                                requestGetCover.addEventListener("readystatechange", function () {
                                                    if (requestGetCover.readyState === XMLHttpRequest.DONE) {
                                                        if (requestGetCover.status === 200) {
                                                            const responseCover = JSON.parse(requestGetCover.responseText);
                                                           
                                                            
                                                            for (let i = 0; i < responseCover.images.length; i++) {
                                                                let image = "";
                                                                if (responseCover.images[i].thumbnails.small === undefined) {
                                                                    const textNoCover = document.createElement("p");
                                                                    textNoCover.textContent = "No cover";
                                                                    zoneCover.appendChild(textNoCover);
                                                                }
                                                                else {
                                                                    image = responseCover.images[i].thumbnails.small;
                                                         
                                                                    const cover = document.createElement("img");
                                                                    cover.className = 'img-cover'
                                                                    cover.setAttribute('src', image);
                                                                    cover.setAttribute('alt', "Cover of the album");
                                                                    zoneCover.appendChild(cover);
                                                                }
                                                            }
                                                        
                                                        }
                                            

                                                    }
                                                    
                                                });
                                             
                                               
                                                requestGetCover.send();
                                            }

                                        });
                                    }
                                    count += 1;

                                }
                                else {
                                    setModalContent("Alert", function (message) {
                                        const pAlert = document.createElement("p");
                                        pAlert.textContent = "Une erreur réseau est survenue : veuillez contacter l'administrateur !";                    
                                        message.appendChild(pAlert);
                                    });
                                    showModal();
    
                                }
                            }
                        });
                        requestGetArtist.send();
                        nbResults += 100;
                    }
                    const stop = setInterval(getArtistRes, 1001);
                }

            }
            else {
                setModalContent("Alert", function (message) {
                    const pAlert = document.createElement("p");
                    pAlert.textContent = "Une erreur réseau est survenue : veuillez contacter l'administrateur !";                    
                    message.appendChild(pAlert);
                });
                showModal();
            }
        }
    });
    requestGetCount.send();
}

function getTitle(value,limit,offset) {
    reset();
    let count = 0;
    let countResults = 0;
    const requestGetCount = new XMLHttpRequest();
    requestGetCount.open("GET", "https://musicbrainz.org/ws/2/recording?query=recording:" + encodeURIComponent('"' + value + '"') + "&limit=" + limit + "&offset=" + offset + "&fmt=json", true);
    requestGetCount.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    requestGetCount.addEventListener("readystatechange", function () {
        if (requestGetCount.readyState === XMLHttpRequest.DONE) {
            if (requestGetCount.status === 200) {
                const responseGetCount = JSON.parse(requestGetCount.responseText);
                if (responseGetCount.count == 0) {
                    messagedefault.textContent = "Aucun résultat"
                    tableResult.appendChild(messagedefault);

                } else {
                    let pCount = document.createElement("p");
                    if (responseGetCount.count > 1){
                        pCount.textContent = "Il y a : "+ responseGetCount.count + " Résultats";
                    }
                    else
                    {
                        pCount.textContent = "Il y a : "+ responseGetCount.count + " Résultat";
                    }
                    tableResult.appendChild(pCount);
                    let nbResults = 0;
                    function getTitleRes() {
                        const requestGetTitle = new XMLHttpRequest();
                        requestGetTitle.open("GET", "https://musicbrainz.org/ws/2/recording?query=recording:" + encodeURIComponent('"' + value + '"') + "&limit=" + limit + "&offset=" + nbResults + "&fmt=json", true);
                        requestGetTitle.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                        requestGetTitle.addEventListener("readystatechange", function () {
                            if (requestGetTitle.readyState === XMLHttpRequest.DONE) {
                                if (requestGetTitle.status === 200) {
                                    const responseGetTitle = JSON.parse(requestGetTitle.responseText);
                           

                                    for (let i = 0; i < 100; i++) {
                                        countResults = i + count * 100 + 1;
                                        if (countResults > responseGetCount.count) {
                                            clearInterval(stop);
                                            break;
                                        }
                                        let artist = "";
                                        if (responseGetTitle.recordings[i]['artist-credit'] == undefined) {
                                            artist = "Inconnue";
                                        } else {
                                            artist = responseGetTitle.recordings[i]['artist-credit'][0].name;
                                        }
                                        const title = responseGetTitle.recordings[i].title;
                                        const length = millisToMinutes(responseGetTitle.recordings[i].length);
                                        const genre = responseGetTitle.recordings[i].tag;
                                        let album = "";
                                        let id = []
                                        if (responseGetTitle.recordings[i]['releases'] == undefined) {
                                            album = "Inconnue";
                                        } else {
                                            album = responseGetTitle.recordings[i]['releases'][0].title;
                                            for (let j = 0; j < responseGetTitle.recordings[i].releases.length; j++) {
                                                id.push(responseGetTitle.recordings[i].releases[j].id);
                                            }
                                        }

                                        const trRes = document.createElement("tr");
                                        const tdCol1 = document.createElement("td");
                                        const tdCol2 = document.createElement("td");
                                        const tdCol3 = document.createElement("td");
                                        const tdCol4 = document.createElement("td");
                                        const tdCol5 = document.createElement("td");
                                        const btnAction = document.createElement("button");

                                        btnAction.className = "btn btn-outline-primary";

                                        btnAction.setAttribute("type", "button");
                                        btnAction.setAttribute("id", "btn-info");

                                        tableResult.appendChild(trRes);
                                        trRes.appendChild(tdCol1);
                                        trRes.appendChild(tdCol2);
                                        trRes.appendChild(tdCol3);
                                        trRes.appendChild(tdCol4);
                                        trRes.appendChild(tdCol5);
                                        tdCol5.appendChild(btnAction);

                                        tdCol1.textContent = countResults;
                                        tdCol2.textContent = artist;
                                        tdCol3.textContent = title;
                                        tdCol4.textContent = album;
                                        btnAction.textContent = "+";

                                        btnAction.addEventListener('click', function (e) {

                                            setModalContent("Information", function (contentModal) {

                                                const pArtist = document.createElement("p");
                                                const pAlbum = document.createElement("p");
                                                const pGenre = document.createElement("p");
                                                const pLenght = document.createElement("p");
                                               
                                                const titleCover = document.createElement("h2");
                                                pArtist.textContent = "Artist : " + artist;
                                                pAlbum.textContent = "Album : " + album;
                                                pGenre.textContent = "Genre : " + genre;
                                                pLenght.textContent = "Length : " + length;
                                                titleCover.textContent = "Cover";

                                                contentModal.appendChild(pArtist);
                                                contentModal.appendChild(pAlbum);
                                                contentModal.appendChild(pGenre);
                                                contentModal.appendChild(pLenght);
                                                contentModal.appendChild(titleCover);
                                            });
                                            showModal();
                                            for (k in id) {
                                                const requestGetCover = new XMLHttpRequest();
                                                const zoneCover = document.querySelector("#modal .modal-content");
                                                requestGetCover.open("GET", "https://coverartarchive.org/release/" + id[k]);
                                                requestGetCover.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                                                requestGetCover.addEventListener("readystatechange", function () {
                                                    if (requestGetCover.readyState === XMLHttpRequest.DONE) {
                                                        if (requestGetCover.status === 200) {
                                                            const responseCover = JSON.parse(requestGetCover.responseText);
                                                        
                                                            
                                                            for (let i = 0; i < responseCover.images.length; i++) {
                                                                let image = "";
                                                                if (responseCover.images[i].thumbnails.small === undefined) {
                                                                    const textNoCover = document.createElement("p");
                                                                    textNoCover.textContent = "No cover";
                                                                    zoneCover.appendChild(textNoCover);
                                                                }
                                                                else {
                                                                    image = responseCover.images[i].thumbnails.small;
                                                                  
                                                                    const cover = document.createElement("img");
                                                                    cover.className = 'img-cover'
                                                                    cover.setAttribute('src', image);
                                                                    cover.setAttribute('alt', "Cover of the album");
                                                                    zoneCover.appendChild(cover);
                                                                }
                                                            }
                                                        
                                                        }
                       
                                                    }
                                                    
                                                });
                                             
                                               
                                                requestGetCover.send();
                                            }

                                        });
                                    }
                                    count += 1;

                                }
                                else {
                                    setModalContent("Alert", function (message) {
                                        const pAlert = document.createElement("p");
                                        pAlert.textContent = "Une erreur réseau est survenue : veuillez contacter l'administrateur !";                    
                                        message.appendChild(pAlert);
                                    });
                                    showModal();
                                }
                            }
                        });
                        requestGetTitle.send();
                        nbResults += 100;
                    }
                    const stop = setInterval(getTitleRes, 1001);
                }

            }
            else {
                setModalContent("Alert", function (message) {
                    const pAlert = document.createElement("p");
                    pAlert.textContent = "Une erreur réseau est survenue : veuillez contacter l'administrateur !";                    
                    message.appendChild(pArtist);
                });
                showModal();
            }
        }
    });
    requestGetCount.send();
}

function getArtist(value, limit, offset) {
    reset();
    let count = 0;
    let countResults = 0;
    const requestGetCount = new XMLHttpRequest();
    requestGetCount.open("GET", "https://musicbrainz.org/ws/2/recording?query=artist:" + encodeURIComponent('"' + value + '"') + "&limit=" + limit + "&offset=" + offset + "&fmt=json", true);
    requestGetCount.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    requestGetCount.addEventListener("readystatechange", function () {
        if (requestGetCount.readyState === XMLHttpRequest.DONE) {
            if (requestGetCount.status === 200) {
                const responseGetCount = JSON.parse(requestGetCount.responseText);
                if (responseGetCount.count == 0) {
                    messagedefault.textContent = "Aucun résultat"
                    tableResult.appendChild(messagedefault);

                } else {
                    let pCount = document.createElement("p");
                    if (responseGetCount.count > 1){
                        pCount.textContent = "Il y a : "+ responseGetCount.count + " Résultats";
                    }
                    else
                    {
                        pCount.textContent = "Il y a : "+ responseGetCount.count + " Résultat";
                    }
                    tableResult.appendChild(pCount);
                    let nbResults = 0;
                    function getArtistRes() {
                        const requestGetArtist = new XMLHttpRequest();
                        requestGetArtist.open("GET", "https://musicbrainz.org/ws/2/recording?query=artist:" + encodeURIComponent('"' + value + '"') + "&limit=" + limit + "&offset=" + nbResults + "&fmt=json", true);
                        requestGetArtist.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                        requestGetArtist.addEventListener("readystatechange", function () {
                            if (requestGetArtist.readyState === XMLHttpRequest.DONE) {
                                if (requestGetArtist.status === 200) {
                                    const responseGetArtist = JSON.parse(requestGetArtist.responseText);
                                   

                                    for (let i = 0; i < 100; i++) {
                                        countResults = i + count * 100 + 1;
                                        if (countResults > responseGetCount.count) {
                                            clearInterval(stop);
                                            break;
                                        }
                                        let artist = "";
                                        if (responseGetArtist.recordings[i]['artist-credit'] == undefined) {
                                            artist = "Inconnue";
                                        } else {
                                            artist = responseGetArtist.recordings[i]['artist-credit'][0].name;
                                        }
                                        const title = responseGetArtist.recordings[i].title;
                                        const length = millisToMinutes(responseGetArtist.recordings[i].length);
                                        const genre = responseGetArtist.recordings[i]['artist-credit'][0].artist.disambiguation;
                                        let album = "";
                                        let id = []
                                        if (responseGetArtist.recordings[i]['releases'] == undefined) {
                                            album = "Inconnue";
                                        } else {
                                            album = responseGetArtist.recordings[i]['releases'][0].title;
                                            for (let j = 0; j < responseGetArtist.recordings[i].releases.length; j++) {
                                                id.push(responseGetArtist.recordings[i].releases[j].id);
                                            }
                                        }

                                        const trRes = document.createElement("tr");
                                        const tdCol1 = document.createElement("td");
                                        const tdCol2 = document.createElement("td");
                                        const tdCol3 = document.createElement("td");
                                        const tdCol4 = document.createElement("td");
                                        const tdCol5 = document.createElement("td");
                                        const btnAction = document.createElement("button");

                                        btnAction.className = "btn btn-outline-primary";

                                        btnAction.setAttribute("type", "button");
                                        btnAction.setAttribute("id", "btn-info");

                                        tableResult.appendChild(trRes);
                                        trRes.appendChild(tdCol1);
                                        trRes.appendChild(tdCol2);
                                        trRes.appendChild(tdCol3);
                                        trRes.appendChild(tdCol4);
                                        trRes.appendChild(tdCol5);
                                        tdCol5.appendChild(btnAction);

                                        tdCol1.textContent = countResults;
                                        tdCol2.textContent = artist;
                                        tdCol3.textContent = title;
                                        tdCol4.textContent = album;
                                        btnAction.textContent = "+";

                                        btnAction.addEventListener('click', function (e) {

                                            setModalContent("Information", function (contentModal) {

                                                const pArtist = document.createElement("p");
                                                const pAlbum = document.createElement("p");
                                                const pGenre = document.createElement("p");
                                                const pLenght = document.createElement("p");
                                                const titleCover = document.createElement("h2");
                                                pArtist.textContent = "Artist : " + artist;
                                                pAlbum.textContent = "Album : " + album;
                                                pGenre.textContent = "Genre : " + genre;
                                                pLenght.textContent = "Length : " + length;
                                                titleCover.textContent = "Cover";

                                                contentModal.appendChild(pArtist);
                                                contentModal.appendChild(pAlbum);
                                                contentModal.appendChild(pGenre);
                                                contentModal.appendChild(pLenght);
                                                contentModal.appendChild(titleCover);
                                            });
                                            showModal();
                                            for (k in id) {
                                                const requestGetCover = new XMLHttpRequest();
                                                const zoneCover = document.querySelector("#modal .modal-content");
                                                requestGetCover.open("GET", "https://coverartarchive.org/release/" + id[k]);
                                                requestGetCover.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                                                requestGetCover.addEventListener("readystatechange", function () {
                                                    if (requestGetCover.readyState === XMLHttpRequest.DONE) {
                                                        if (requestGetCover.status === 200) {
                                                            const responseCover = JSON.parse(requestGetCover.responseText);
                                                          
                                                            
                                                            for (let i = 0; i < responseCover.images.length; i++) {
                                                                let image = "";
                                                                if (responseCover.images[i].thumbnails.small === undefined) {
                                                                    const textNoCover = document.createElement("p");
                                                                    textNoCover.textContent = "No cover";
                                                                    zoneCover.appendChild(textNoCover);
                                                                }
                                                                else {
                                                                    image = responseCover.images[i].thumbnails.small;
                                                                   
                                                                    const cover = document.createElement("img");
                                                                    cover.className = 'img-cover'
                                                                    cover.setAttribute('src', image);
                                                                    cover.setAttribute('alt', "A cover of the album");
                                                                    zoneCover.appendChild(cover);
                                                                }
                                                            }
                                                        
                                                        }
  

                                                    }
                                                    
                                                });
                                             
                                               
                                                requestGetCover.send();
                                            }

                                        });
                                    }
                                    count += 1;

                                }
                                else {
                                    setModalContent("Alert", function (message) {
                                        const pAlert = document.createElement("p");
                                        pAlert.textContent = "Une erreur réseau est survenue : veuillez contacter l'administrateur !";                    
                                        message.appendChild(pAlert);
                                    });
                                    showModal();
                                }
                            }
                        });
                        requestGetArtist.send();
                        nbResults += 100;
                    }
                    const stop = setInterval(getArtistRes, 1001);
                }

            }
            else {
                setModalContent("Alert", function (message) {
                    const pAlert = document.createElement("p");
                    pAlert.textContent = "Une erreur réseau est survenue : veuillez contacter l'administrateur !";                    
                    message.appendChild(pAlert);
                });
                showModal();
            }
        }
    });
    requestGetCount.send();

}
function millisToMinutes(millis) {
    let minutes = Math.floor(millis / 60000);
    let seconds = ((millis % 60000) / 1000).toFixed(0);
    if (minutes + ":" + (seconds < 10 ? '0' : '') + seconds == 'NaN:NaN') {
        return '??:??';
    }
    else {
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }
}
function reset() {
    tableResult.textContent = '';

}
