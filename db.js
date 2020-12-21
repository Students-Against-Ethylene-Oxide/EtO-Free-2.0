document.addEventListener("DOMContentLoaded", () => {
	cardrow = document.getElementById("reviews-cards");
	let firebaseRef = firebase.database().ref();

	// Attach an asynchronous callback to read the data at our posts reference
	firebaseRef.on(
		"value",
		function (snapshot) {
			// Setting firebase data to a variable called "data"
			data = snapshot.val();

			dataArray = [];

			idArray = Object.keys(data);
			dataArrayValues = Object.values(data);

			document.getElementById("tBody").innerHTML = "";
			// Tables are repeating user information when firebase information updates.
			for (let i = 0; i < idArray.length; i++) {
				$("#reviews-cards").append(
					`<div class="review col-lg-4 p-2 m-0 d-flex flex-column" data-company="${dataArrayValues[i].company}" 
                    data-date="${dataArrayValues[i].date}"
                    data-name="${idArray[i]}" 
                    data-prodtype="${dataArrayValues[i].producttype}" 
                    data-skintype="${dataArrayValues[i].skintype}">
                        <a href="#" onclick="createModal.call(this);" class=" list-group-item-action flex-column align-items-start" data-toggle="modal" data-target="#modal">
                            <div class="card">
                                <img class="card-img-top" src="assets/images/thesis-cleansing-oil-4.jpeg" alt="Card image cap">
                                <div class="card-body">
                                    <h5 class="card-title">${idArray[i]}</h5>
                                    <div class="content">
                                        <div class="embed-responsive embed-responsive-1by1 align-self-center w-50 mt-3 mb-5">
                                            <iframe src="${dataArrayValues[i].youtubelink}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                        </div>
                                        <p class="card-text">
                                            ${dataArrayValues[i].description}
                                        </p>
                                        <p class="card-text">
                                            <b>Ingredients:</b>
                                        </p>
                                        <ul>
                                            ${dataArrayValues[i].ingredients}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>`
				);
			}
		},
		function (errorObject) {
			console.log("The read failed: " + errorObject.code);
		}
	);
});
