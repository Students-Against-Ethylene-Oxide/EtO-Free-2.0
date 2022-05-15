document.addEventListener("DOMContentLoaded", () => {
	let cardrow = document.getElementById("reviews-cards");
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
            for (let i = idArray.length - 1; i >= 0; i--) {
                $("#reviews-cards").append(
                    `<div id="${dataArrayValues[i].name}"class="review col-lg-4 p-2 m-0 d-flex flex-column"
                    data-filters='${JSON.stringify(dataArrayValues[i].filters)}'
                    data-company='${dataArrayValues[i].filters.company}'
                    data-producttype='${dataArrayValues[i].filters.producttype}'
                    data-skintype='${dataArrayValues[i].filters.skintype}'
                    data-date="${idArray[i]}"
                    data-name="${dataArrayValues[i].title}">
                        <a href="#" onclick="createModal.call(this);" class="list-group-item-action flex-column align-items-start" data-toggle="modal" data-target="#modal">
                            <div class="card">
                                <img class="card-img-top" src="assets/images/${dataArrayValues[i].name}.jpg" onerror="this.onerror = null; this.src=''" alt="Image of ${dataArrayValues[i].title}">
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
                                    <div class="mb-1 text-muted">${new Date(idArray[i]).toDateString()}</div>
                                    <a class="badge badge-light tags" href="#" data-click="no" onclick="filter.call(this, 'data-company', '${dataArrayValues[i].filters.company}');">#${dataArrayValues[i].filters.company.replace(/\s/g, '')}</a>
                                    <a class="badge badge-light tags" href="#" data-click="no" onclick="filter.call(this, 'data-producttype', '${dataArrayValues[i].filters.producttype}');">#${dataArrayValues[i].filters.producttype.toLowerCase()}</a>
                                </div>
                            </div>
                        </a>
                    </div>`
				);
            }
            addFilters(dataArrayValues);
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

function createModal() {
    let title, content;

    // get info from selected card
    title = this.querySelector("h5").innerText;
    content = this.querySelector('.content').innerHTML;

    // create the modal and add all necessary attributes, classes, and info
    let modal = document.createElement("div");
    modal.id = "modal";
    modal.className = "modal fade";
    modal.tabIndex = "-1";
    modal.role = "dialog";
    modal.innerHTML = `<div class="modal-dialog modal-lg modal-dialog-centered" role="document"><div class="modal-content"> <div class="modal-header"> <h5 class="modal-title" id="exampleModalLabel">${title}</h5> <button type="button" class="close" data-dismiss="modal" aria-label="Close"  onclick="modal.remove();"> <span aria-hidden="true">&times;</span> </button> </div> <div class="modal-body d-flex flex-column">${content}</div> <div class="modal-footer"> <button type="button" class="btn btn-secondary" data-dismiss="modal" onclick="modal.remove();">Close</button> </div> </div> </div>`;
    document.body.appendChild(modal); 

    // open the modal
    $("#modal").modal();
}

//  Filtering functions
$("#scrollToFilters").click(function () {
    $('html, body').animate({
        scrollTop: $("#filters").offset().top
    }, 2000);
});

function addFilters(dataArray) {
    let filterKeys = Object.keys(dataArray[0].filters);

    for (let key of filterKeys) {
        let filterSet = new Set;
        for (let dataSet of dataArray) {
            filterSet.add(dataSet.filters[key]);
        }

        filterSet = Array.from(filterSet).sort();

        for (let value of filterSet) {
            $(`#${key}`).append(
                `<button 
                    class="tag btn btn-dark rounded-0 w-100"
                    onclick="filter.call(this, 'data-${key}', '${value}');" 
                    ontouchstart="filter.call(this, 'data-${key}', '${value}');"
                    data-click="no">
                    ${value} 
                </button>`
            );
        }
    }
}

function clearFilters() {
    // get all applicable elements
    let cards = document.querySelectorAll(".review");
    let tags = document.querySelectorAll(".tag");

    // clear the search bar and filter array
	appliedFilters.length = 0;
    document.getElementById("filter-input").value = "";
    
    // show all the cards
	for (let elem of cards) {
        elem.classList.remove("d-none");
        elem.classList.add("d-flex");
    }
    
    // reset the filter buttons
	for (let tag of tags) {
		tag.setAttribute("data-click", "no");
    }

    // return the cards to their normal order
    cards = Array.prototype.slice.call(cards);
    cards.sort(function (a, b) {
        return a.getAttribute("data-date").localeCompare(b.getAttribute("data-date"));
    });
    Array.prototype.reverse.call(cards);
    for (let elem of cards) {
        let parent = elem.parentNode;
        let detatchedItem = parent.removeChild(elem);
        parent.appendChild(detatchedItem);
    }
    
    let defaults = {
        sortName: "off",
        sortCompany: "off",
        sortProduct: "off",
        sortDate: "reverse"
    }
    
    let sortOptions = document.querySelectorAll(`[data-sort-direction]`);
    for (let opt of sortOptions) {
        let thisDefault = defaults[opt.id];
        opt.setAttribute("data-sort-direction", thisDefault)
    }
}

function filterSearch() {
    let input, cards, content;
    // get input from text box
	input = document.getElementById("filter-input").value.trim();
	cards = document.getElementsByClassName("review");
    
    // hide all the cards
    for (let elem of cards) {
        elem.classList.remove('d-flex');
        elem.classList.add("d-none");
    }

    // shows any cards that contain the search term
	for (let elem of cards) {
		content = elem.innerHTML.toLowerCase();
        content = content.replace(/(<([^>]+)>)/gi, "");

        if (content.includes(input)) {
            elem.classList.remove("d-none");
            elem.classList.add("d-flex");
        }
	}
}

const appliedFilters = [];
function filter(attr, attrValue) {
	// declare variables
    let cards = document.querySelectorAll(".review");
    let selector = `[${attr}='${attrValue}']`;
    let selected = [];

    // hide all the cards
    for (let elem of cards) {
        elem.classList.remove("d-flex");
        elem.classList.add("d-none");
    }
	
    // if the filter has not already been applied, apply the filter
    if (!(appliedFilters.includes(selector))) {
        this.setAttribute("data-click", "yes");
        appliedFilters.push(selector);
    } else {
        this.setAttribute("data-click", "no");
        let index = appliedFilters.indexOf(selector);
        appliedFilters.splice(index);
    }

    console.log(appliedFilters);

    document.querySelectorAll(appliedFilters.join()).forEach(element => {
        if (!(selected.includes(element))) {
            selected.push(element);
        }
    });

    // show all cards that meet the criteria of the filters
    if (selected.length == 0) {
        for (let elem of cards) {
            elem.classList.remove("d-none");
            elem.classList.add("d-flex");
        }
    } else {
        for (let selection of selected) {
            selection.classList.remove("d-none");
            selection.classList.add("d-flex");
        }
    }
}

function sortBy(attr) {
    let sortDirection, cards, sortOptions;

    // get the current sorting direction of the filter
    sortDirection = this.getAttribute("data-sort-direction");

    // get all the cards to be sorted
    cards = document.querySelectorAll(".review");
    
	// magically coerce into an array first
	cards = Array.prototype.slice.call(cards);
	cards.sort(function (a, b) {
		return a.getAttribute(attr).localeCompare(b.getAttribute(attr));
    });

    // sort the cards in normal or reverse order
    if (sortDirection == "off") {
        this.setAttribute("data-sort-direction", "forward");
    } else if (sortDirection == "forward") {
        Array.prototype.reverse.call(cards);
        this.setAttribute("data-sort-direction", "reverse");
    } else if (sortDirection == "reverse") {
        cards.sort(function (a, b) {
            return a.getAttribute("data-date").localeCompare(b.getAttribute("data-date"));
        });
        Array.prototype.reverse.call(cards);
        this.setAttribute("data-sort-direction", "off");
    }

    // do the actual sorting
    for (let elem of cards) {
        // store the parent node so we can reattach the item
        let parent = elem.parentNode;
        // detach it from wherever it is in the DOM
        let detatchedItem = parent.removeChild(elem);
        // reattach it.
        parent.appendChild(detatchedItem);
    }

    // return the other sorting options to their default state
    // the default states for each sorting button
    let defaults = {
        sortName: "off",
        sortCompany: "off",
        sortProduct: "off",
        sortDate: "reverse"
    }

    // get all the sorting buttons not in use, then set their sort directions to default
    sortOptions = document.querySelectorAll(`[data-sort-direction]:not(#${this.id})`);
    for (let opt of sortOptions) {
        let thisDefault = defaults[opt.id];
        opt.setAttribute("data-sort-direction", thisDefault)
    }
}