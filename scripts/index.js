document.addEventListener("DOMContentLoaded", () => {
	let cardrow = document.getElementById("posts-cards");
	let firebaseRef = firebase
		.database()
		.ref("1CWF0D-CWs-MV4Kr1qCJSyUk0EVzy7LeRsn9WMrIT7BA/Reviews/");

	// Attach an asynchronous callback to read the data at our posts reference
	firebaseRef.on(
		"value",
		function (snapshot) {
			// Setting firebase data to a variable called "data"
			let data = snapshot.val();
			let idArray = Object.keys(data);
			let dataArrayValues = Object.values(data);

			// Tables are repeating user information when firebase information updates.
			cardrow.innerHTML = "";
            for (let i = idArray.length - 1; i > idArray.length - 3; i--) {
				$("#posts-cards").append(
					`<div class="col-md-6">
                        <div class="card flex-md-row mb-4 box-shadow h-md-250">
                            <div class="card-body d-flex flex-column align-items-start w-100 w-lg-50">
                                <h4 class="mb-0">
                                    <a class="text-dark" href="reviews.html#${dataArrayValues[i].name}">${dataArrayValues[i].title}</a>
                                </h4>
                                <div class="mb-1 text-muted">${new Date(idArray[i]).toDateString()}</div>
                                <a href="reviews.html#${dataArrayValues[i].name}">Continue reading</a>
                            </div>
							<div class="d-none d-lg-flex flex-column align-items-center w-50" style="overflow: hidden;">
								<img class="card-img-right d-none d-lg-block" src="assets/images/${dataArrayValues[i].name}.jpg" onerror="this.onerror = null; this.src='assets/images/${dataArrayValues[i].name}.jpeg'" alt="Card image cap" style="object-fit: cover;">
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
