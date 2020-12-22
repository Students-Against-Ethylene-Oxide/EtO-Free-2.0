document.addEventListener("DOMContentLoaded", () => {
	cardrow = document.getElementById("posts-cards");
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
			// cardrow.innerHTML = "";
            for (let i = idArray.length - 1; i > idArray.length - 3; i--) {
                date = new Date(dataArrayValues[i].date)
                console.log(Date);
				$("#posts-cards").append(
					`<div class="col-md-6">
                        <div class="card flex-md-row mb-4 box-shadow h-md-250">
                            <div class="card-body d-flex flex-column align-items-start w-50">
                                <h4 class="mb-0">
                                    <a class="text-dark" href="reviews.html#${idArray[i]}">${dataArrayValues[i].name}</a>
                                </h4>
                                <div class="mb-1 text-muted">${date.toDateString()}</div>
                                <a href="reviews.html#${idArray[i]}">Continue reading</a>
                            </div>
                            <div class="w-50">
                                <img class="card-img-right img-fluid flex-auto d-none d-md-block" src="assets/images/${idArray[i]}.jpeg" onerror="this.onerror = null; this.src='assets/images/${idArray[i]}.jpg'"
                                alt="Card image cap">
                            </div>
                        </div>
                    </div>`
				);
			}
		},
		function (errorObject) {
			console.log("The read failed: " + errorObject.code);
		}
	);
});
