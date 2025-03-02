document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".searchBar").addEventListener("submit", (event)=> {
        event.preventDefault();
        searchArtists();
    });

    document.querySelector(".cross").addEventListener("click", (event)=> {
        event.preventDefault();
        document.querySelector("#artistInput").value = "";
        document.querySelector("#results").innerHTML = "";
        document.querySelector("#details").innerHTML = "";
    });

    let artist_id = null;

    function searchArtists() {
        const query = document.querySelector("#artistInput").value.trim();
        document.querySelector("#loading").classList.remove("hidden");
        document.querySelector("#details").innerHTML = "";
        artist_id=null;

        fetch(`/api/search?keyword=${query}`)
            .then(response => response.json())
            .then(data => {
                document.querySelector("#loading").classList.add("hidden");
                const resultsContainer = document.querySelector("#results");
                resultsContainer.innerHTML = "";

                if (data.length === 0) {
                    resultsContainer.innerHTML = `<span class="resultNone">No results found.</span>`;
                } else {
                    data.forEach(artist => {
                        if (artist.pic_url === "/assets/shared/missing_image.png") {
                            artist.pic_url = "/static/artsy_logo.svg";
                        }

                        const resCard = document.createElement("div");
                        resCard.classList.add("resCard");
                        resCard.id = artist.id;

                        resCard.innerHTML = `
                            <img src="${artist.pic_url}" alt="${artist.title}">
                            <p>${artist.title}</p>`;

                        resultsContainer.appendChild(resCard);
                    });
                }
            })
            .catch((e) => {
                console.log(e);
                document.querySelector("#loading").classList.add("hidden");
                alert("An error occurred while searching.");
            });
    }

    document.addEventListener("click", (event)=> {
        const resCard = event.target.closest(".resCard");
        if (resCard) {
            event.preventDefault();
            artistInfo(resCard.id);
        }
    });

    function artistInfo(id) {
        document.querySelector("#loading").classList.remove("hidden");

        fetch(`/api/artist?id=${id}`)
            .then(response => response.json())
            .then(data => {
                document.querySelector("#loading").classList.add("hidden");
                const detailsContainer = document.querySelector("#details");
                if (artist_id) {
                    document.getElementById(artist_id).style.removeProperty("background-color");
                }
                artist_id = id;
                const selectedCard = document.getElementById(id);
                selectedCard.style.backgroundColor = "#112B3C";

                if (data.length === 0) {
                    detailsContainer.innerHTML = `<p>No results found.</p>`;
                } else {
                    detailsContainer.innerHTML = `
                        <p>
                            <center>
                                <b>${data.name} (${data.birthday} - ${data.deathday})</b><br>
                                ${data.nationality}
                            </center>
                            <br><br>
                            ${data.biography}
                        </p>`;
                }
            })
            .catch(() => {
                console.log(e);
                document.querySelector("#loading").classList.add("hidden");
                alert("An error occurred while searching.");
            });
    }
});
