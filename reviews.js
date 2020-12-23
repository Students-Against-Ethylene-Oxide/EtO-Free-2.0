var filters = [];

document.addEventListener("DOMContentLoaded", () => {
	cardrow = document.getElementById("reviews-cards");
	let firebaseRef = firebase
		.database()
		.ref("1CWF0D-CWs-MV4Kr1qCJSyUk0EVzy7LeRsn9WMrIT7BA/Reviews/");

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
					`<div id="${dataArrayValues[i].name}"class="review col-lg-4 p-2 m-0 d-flex flex-column" 
                    data-company="${dataArrayValues[i].company}" 
                    data-date="${idArray[i]}"
                    data-name="${dataArrayValues[i].title}" 
                    data-prodtype="${dataArrayValues[i].producttype}" 
                    data-skintype="${dataArrayValues[i].skintype}">
                        <a href="#" onclick="createModal.call(this);" class="list-group-item-action flex-column align-items-start" data-toggle="modal" data-target="#modal">
                            <div class="card">
                                <img class="card-img-top" src="assets/images/${dataArrayValues[i].name}.jpeg" onerror="this.onerror = null; this.src='assets/images/${dataArrayValues[i].name}.jpg'" alt="Card image cap">
                                <div class="card-body">
                                    <h5 class="card-title">${dataArrayValues[i].title}</h5>
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
	str = `<li>${str}</li>`;
	return str.replace(/, /g, "</li><li>");
}

sortBy("data-name");

function sortBy(attr) {
	cards = document.getElementsByClassName("review");
	// magically coerce into an array first
	cards = Array.prototype.slice.call(cards);

	cards.sort(function (a, b) {
		return a.getAttribute(attr).localeCompare(b.getAttribute(attr));
	});
	for (var i = 0; i < cards.length; i++) {
		// store the parent node so we can reattach the item
		var parent = cards[i].parentNode;
		// detach it from wherever it is in the DOM
		var detatchedItem = parent.removeChild(cards[i]);
		// reattach it.  This works because we are iterating
		// over the items in the same order as they were re-
		// turned from being sorted.
		parent.appendChild(detatchedItem);
	}
}

// // function change(selector) {
//    element = document.querySelector(selector)
//   console.log(element)
//   if (element.classList) {
//     element.classList.toggle("change")
//   } else {
//     // For IE9
//     var classes = element.className.split(" ")
//     var i = classes.indexOf("change")

//     if (i >= 0)
//       classes.splice(i, 1)
//     else
//       classes.push("change")
//     element.className = classes.join(" ")
//   }
// }

// function changeThis() {
//   console.log(this)
//   if (this.classList) {
//     this.classList.toggle("change")
//   } else {
//     // For IE9
//     var classes = this.className.split(" ")
//     var i = classes.indexOf("change")

//     if (i >= 0)
//       classes.splice(i, 1)
//     else
//       classes.push("change")
//     this.className = classes.join(" ")
//   }
// }

function filterSearch() {
	let input, cards, content;
	input = document.getElementById("filter-input").value.trim();
	cards = document.getElementsByClassName("review");
    
    for (i = 0; i < cards.length; i++) {
        cards[i].classList.remove('d-flex');
        cards[i].classList.add("d-none");
    }

	for (i = 0; i < cards.length; i++) {
		content = cards[i].innerHTML.toLowerCase();
        content = content.replace(/(<([^>]+)>)/gi, "");

        if (content.includes(input)) {
            cards[i].classList.remove("d-none");
            cards[i].classList.add("d-flex");
        } else {
            cards[i].classList.remove("d-flex");
			cards[i].classList.add("d-none");
        }
	}
}

function filter(attr, attrValue) {
	// declare variables
	cards = document.getElementsByClassName("review");
	selector = `[${attr}=${attrValue}]`;
    console.log(this.getAttribute("data-click") == "no");
	// if the filter has not already been clicked, apply filter
    if (this.getAttribute("data-click") == "no") {
        // add the filter to an array of applied filters
        // set the 'clicked' property to yes
        filters.push(selector);
        this.setAttribute("data-click", "yes");

        // hide all the cards
        for (i = 0; i < cards.length; i++) {
            cards[i].classList.remove("d-flex");
            cards[i].classList.add("d-none");
        }

        // for each filter, show any cards that apply
        for (i = 0; i < filters.length; i++) {
            selected = document.querySelectorAll(filters[i]);

            for (a = 0; a < selected.length; a++) {
                selected[a].classList.remove("d-none");
                selected[a].classList.add("d-flex");
            }
        }
    } else {
        // get index of the filter and remove it from the array
        // set the 'clicked' property to yes
        index = filters.indexOf(selector);
        filters.splice(index, 1);
        this.setAttribute("data-click", "no");
        console.log(index, filters);
        
        // if the array is not empty, repeat the above filtering process
        if (filters.length != 0) {
            // hide all the cards
            for (i = 0; i < cards.length; i++) {
                cards[i].classList.remove("d-flex");
                cards[i].classList.add("d-none");
            }

            // for each filter, show any cards that apply
            for (i = 0; i < filters.length; i++) {
                // get a list of all the cards with that filter
                selected = document.querySelectorAll(filters[i]);
                console.log(selected);
                for (a = 0; a < selected.length; a++) {
                    selected[a].classList.toggle("d-none");
                    selected[a].classList.toggle("d-flex");
                }
            }
        // if the array is empty, show all the cards
        } else {
			// show all the cards
			for (i = 0; i < cards.length; i++) {
				cards[i].classList.remove("d-none");
				cards[i].classList.add("d-flex");
			}
		}
    }
}

function clearFilters() {
    // get all applicable elements
    cards = document.getElementsByClassName("review");
    tags = document.getElementsByClassName("tag");

    // clear the search bar and filter array
	filters = [];
    document.getElementById("filter-input").value = "";
    
    // show all the cards
	for (var i = 0; i < cards.length; i++) {
        cards[i].classList.remove("d-none");
        cards[i].classList.add("d-flex");
    }
    
    // reset the filter buttons
	for (var i = 0; i < tags.length; i++) {
		tags[i].setAttribute("data-click", "no");
    }
}

function showHint(str) {
	if (str.length == 0) {
		document.getElementById("txtHint").innerHTML = "";
		return;
	} else {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				document.getElementById(
					"txtHint"
				).innerHTML = this.responseText;
			}
		};
		xmlhttp.open("GET", "search.php?q=" + str, true);
		xmlhttp.send();
	}
}

function createModal() {
    var title, content, text;

    // get info from selected card
    title = this.querySelector("h5").innerText;
    content = this.querySelector('.content').innerHTML;

    // create the modal and add all necessary attributes, classes, and info
    modal = document.createElement("div");
    modal.id = "modal";
    modal.className = "modal fade";
    modal.tabIndex = "-1";
    modal.role = "dialog";
    modal.innerHTML = `<div class="modal-dialog modal-lg modal-dialog-centered" role="document"><div class="modal-content"> <div class="modal-header"> <h5 class="modal-title" id="exampleModalLabel">${title}</h5> <button type="button" class="close" data-dismiss="modal" aria-label="Close"  onclick="modal.remove();"> <span aria-hidden="true">&times;</span> </button> </div> <div class="modal-body d-flex flex-column">${content}</div> <div class="modal-footer"> <button type="button" class="btn btn-secondary" data-dismiss="modal" onclick="modal.remove();">Close</button> </div> </div> </div>`;
    document.body.appendChild(modal); 

    // open the modal
    $("#modal").modal();
}