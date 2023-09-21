// oberserver
const header = document.querySelector('.navbar');
const container = document.querySelectorAll('section');

const fire = document.getElementById("fire");
const air = document.getElementById("air");
const water = document.getElementById("water");
const earth = document.getElementById("earth");

//observe sections then slide in
const containerObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if(entry.isIntersecting){
            entry.target.classList.add('show-container');
        } else {
            entry.target.classList.remove('show-container');
        }
    });
});

//observe section then change color nav
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        console.log(entry)
        if(entry.isIntersecting){
            if(entry.target == fire){
                header.classList.add('navbar-fire');
            } else if(entry.target == air){
                header.classList.add('navbar-air');
            } else if(entry.target == water){
                header.classList.add('navbar-water');
            } else if(entry.target == earth) {
                header.classList.add('navbar-earth');
            }
        } else {
            header.classList.remove('navbar-fire');
            header.classList.remove('navbar-air');
            header.classList.remove('navbar-water');
            header.classList.remove('navbar-earth');
        }
    });
}, {
    threshold: [0.70]
});

container.forEach(section => {
    containerObserver.observe(section);
    observer.observe(section);
});

//scroll up
const scrollHeightNow = 0;
window.onscroll = function() {
    if (document.documentElement.scrollTop > 500 ||document.body.scrollTop > 500) {
        document.getElementById("scroll-up-btn").style.display = "block";
    } else {
        document.getElementById("scroll-up-btn").style.display = "none";
    }
};

function scrollToTop(){
    window.scrollTo(0,0);
}

//card

const overlayOne = document.querySelector('.overlay-one');
const returnBtnOne = document.querySelector('.fa-rotate-left');
const cardFrontOne = document.querySelector('.card-front-one');
const cardBackOne = document.querySelector('.card-back-one');

//front to back flip
overlayOne.addEventListener('click', () => {
    cardFrontOne.classList.add('active');
    cardBackOne.classList.add('active');

    if(cardFrontOne.classList.contains('active')){
        overlayOne.style.display = 'none';
    }
})
//back to front flip
returnBtnOne.addEventListener('click', () => {
    cardFrontOne.classList.remove('active');
    cardBackOne.classList.remove('active');

    if(!cardFrontOne.classList.contains('active')){
        overlayOne.style.display = 'flex';
    }
})

//videos

const carousel = document.querySelector(".carousel"),
firstImg = carousel.querySelectorAll("video")[0],
arrowIcons = document.querySelectorAll(".wrapper i");

let isDragStart = false, isDragging = false, prevPageX, prevScrollLeft, positionDiff;

const showHideIcons = () => {
    // showing and hiding prev/next icon according to carousel scroll left value
    let scrollWidth = carousel.scrollWidth - carousel.clientWidth; // getting max scrollable width
    arrowIcons[0].style.display = carousel.scrollLeft == 0 ? "none" : "block";
    arrowIcons[1].style.display = carousel.scrollLeft == scrollWidth ? "none" : "block";
}

arrowIcons.forEach(icon => {
    icon.addEventListener("click", () => {
        let firstImgWidth = firstImg.clientWidth + 14; // getting first img width & adding 14 margin value
        // if clicked icon is left, reduce width value from the carousel scroll left else add to it
        carousel.scrollLeft += icon.id == "left" ? -firstImgWidth : firstImgWidth;
        setTimeout(() => showHideIcons(), 60); // calling showHideIcons after 60ms
    });
});

const autoSlide = () => {
    // if there is no image left to scroll then return from here
    if(carousel.scrollLeft - (carousel.scrollWidth - carousel.clientWidth) > -1 || carousel.scrollLeft <= 0) return;

    positionDiff = Math.abs(positionDiff); // making positionDiff value to positive
    let firstImgWidth = firstImg.clientWidth + 14;
    // getting difference value that needs to add or reduce from carousel left to take middle img center
    let valDifference = firstImgWidth - positionDiff;

    if(carousel.scrollLeft > prevScrollLeft) { // if user is scrolling to the right
        return carousel.scrollLeft += positionDiff > firstImgWidth / 3 ? valDifference : -positionDiff;
    }
    // if user is scrolling to the left
    carousel.scrollLeft -= positionDiff > firstImgWidth / 3 ? valDifference : -positionDiff;
}

const dragStart = (e) => {
    // updatating global variables value on mouse down event
    isDragStart = true;
    prevPageX = e.pageX || e.touches[0].pageX;
    prevScrollLeft = carousel.scrollLeft;
}

const dragging = (e) => {
    // scrolling images/carousel to left according to mouse pointer
    if(!isDragStart) return;
    e.preventDefault();
    isDragging = true;
    carousel.classList.add("dragging");
    positionDiff = (e.pageX || e.touches[0].pageX) - prevPageX;
    carousel.scrollLeft = prevScrollLeft - positionDiff;
    showHideIcons();
}

const dragStop = () => {
    isDragStart = false;
    carousel.classList.remove("dragging");

    if(!isDragging) return;
    isDragging = false;
    autoSlide();
}

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("touchstart", dragStart);

document.addEventListener("mousemove", dragging);
carousel.addEventListener("touchmove", dragging);

document.addEventListener("mouseup", dragStop);
carousel.addEventListener("touchend", dragStop);

//piclist
const picWrapper = document.querySelector(".picwrapper");
const picCarousel = document.querySelector(".piccarousel");
const firstCardWidth = picCarousel.querySelector(".picturelist").offsetWidth;
const arrowBtnsPic = document.querySelectorAll(".picwrapper i");
const carouselChildrens = [...picCarousel.children];

let isDraggingPic = false, isautoPlayPic = true, startX, startScrollLeft, timeoutId;

// Get the number of cards that can fit in the picCarousel at once
let cardPerView = Math.round(picCarousel.offsetWidth / firstCardWidth);

// Insert copies of the last few cards to beginning of picCarousel for infinite scrolling
carouselChildrens.slice(-cardPerView).reverse().forEach(card => {
    picCarousel.insertAdjacentHTML("afterbegin", card.outerHTML);
});

// Insert copies of the first few cards to end of picCarousel for infinite scrolling
carouselChildrens.slice(0, cardPerView).forEach(card => {
    picCarousel.insertAdjacentHTML("beforeend", card.outerHTML);
});

// Scroll the picCarousel at appropriate postition to hide first few duplicate cards on Firefox
picCarousel.classList.add("no-transition");
picCarousel.scrollLeft = picCarousel.offsetWidth;
picCarousel.classList.remove("no-transition");

// Add event listeners for the arrow buttons to scroll the picCarousel left and right
arrowBtnsPic.forEach(btn => {
    btn.addEventListener("click", () => {
        picCarousel.scrollLeft += btn.id == "leftpic" ? -firstCardWidth : firstCardWidth;
    });
});

const dragStartPic = (e) => {
    isDraggingPic = true;
    picCarousel.classList.add("draggingPic");
    // Records the initial cursor and scroll position of the picCarousel
    startX = e.pageX;
    startScrollLeft = picCarousel.scrollLeft;
}

const draggingPic = (e) => {
    if(!isDraggingPic) return; // if isDraggingPic is false return from here
    // Updates the scroll position of the picCarousel based on the cursor movement
    picCarousel.scrollLeft = startScrollLeft - (e.pageX - startX);
}

const dragStopPic = () => {
    isDraggingPic = false;
    picCarousel.classList.remove("draggingPic");
}

const infiniteScrollPic = () => {
    // If the picCarousel is at the beginning, scroll to the end
    if(picCarousel.scrollLeft === 0) {
        picCarousel.classList.add("no-transition");
        picCarousel.scrollLeft = picCarousel.scrollWidth - (2 * picCarousel.offsetWidth);
        picCarousel.classList.remove("no-transition");
    }
    // If the picCarousel is at the end, scroll to the beginning
    else if(Math.ceil(picCarousel.scrollLeft) === picCarousel.scrollWidth - picCarousel.offsetWidth) {
        picCarousel.classList.add("no-transition");
        picCarousel.scrollLeft = picCarousel.offsetWidth;
        picCarousel.classList.remove("no-transition");
    }

    // Clear existing timeout & start autoPlayPic if mouse is not hovering over picCarousel
    clearTimeout(timeoutId);
    if(!picWrapper.matches(":hover")) autoPlayPic();
}

const autoPlayPic = () => {
    if(window.innerWidth < 800 || !isautoPlayPic) return; // Return if window is smaller than 800 or isautoPlayPic is false
    // autoPlayPic the picCarousel after every 2500 ms
    timeoutId = setTimeout(() => picCarousel.scrollLeft += firstCardWidth, 2000);
}
autoPlayPic();

picCarousel.addEventListener("mousedown", dragStartPic);
picCarousel.addEventListener("mousemove", draggingPic);
document.addEventListener("mouseup", dragStopPic);
picCarousel.addEventListener("scroll", infiniteScrollPic);
picWrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
picWrapper.addEventListener("mouseleave", autoPlayPic);