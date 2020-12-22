document.addEventListener("DOMContentLoaded", () => {
	cardrow = document.getElementById("reviews-cards");
	let firebaseRef = firebase
		.database()
		.ref("1CWF0D-CWs-MV4Kr1qCJSyUk0EVzy7LeRsn9WMrIT7BA/Sheet1/");

	// Attach an asynchronous callback to read the data at our posts reference
	firebaseRef.on(
		"value",
		function (snapshot) {
			// Setting firebase data to a variable called "data"
			data = snapshot.val();
            dataArray = [];

			idArray = Object.keys(data);
			dataArrayValues = Object.values(data);

			// Tables are repeating user information when firebase information updates.
			cardrow.innerHTML = "";
			for (let i = idArray.length - 1; i >= 0; i--) {
				$("#reviews-cards").append(
                    `<div class="review col-lg-4 p-2 m-0 d-flex flex-column" 
                    data-company="${dataArrayValues[i].company}" 
                    data-date="${dataArrayValues[i].date}"
                    data-name="${dataArrayValues[i].name}" 
                    data-prodtype="${dataArrayValues[i].producttype}" 
                    data-skintype="${dataArrayValues[i].skintype}">
                        <a href="#" onclick="createModal.call(this);" class=" list-group-item-action flex-column align-items-start" data-toggle="modal" data-target="#modal">
                            <div class="card">
                                <img class="card-img-top" src="assets/images/${idArray[i]}.jpeg" onerror="this.onerror = null; this.src='assets/images/${idArray[i]}.jpg'" alt="Card image cap">
                                <div class="card-body">
                                    <h5 class="card-title">${dataArrayValues[i].name}</h5>
                                    <div class="content">
                                        <div class="embed-responsive embed-responsive-1by1 align-self-center w-50 mt-3 mb-5">
                                            <iframe src="${dataArrayValues[i].ytlink}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                        </div>
                                        <p class="card-text">
                                            ${dataArrayValues[i].description}
                                        </p>
                                        <p class="card-text">
                                            <b>Ingredients:</b>
                                        </p>
                                        <ul>
                                            ${parseList(dataArrayValues[i].ingredients)}
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

function parseList(str) {
    str = `<li>${str}</li>`
    return str.replace(/, /g, "</li><li>");
}
