var filters = [];

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

function search() {
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
    // clear filters
    filters = [];
    
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
