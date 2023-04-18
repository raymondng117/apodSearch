const $Date_form = document.getElementById('date_request')
const $Date_input = document.getElementById('date_input');
const $Display_container = document.getElementById('Display_container')
const $Favorities_Block = document.getElementById('Favorities_block')
const $modal = document.querySelector('.modal')

const ls = localStorage.getItem('$favorities_list');
const $favorities_list = ls ? JSON.parse(ls) : [];
console.log($favorities_list);

renderFavorities($favorities_list)


//Functions to create the content of display
    function createImg(displayContent) {
    const $display_img = document.createElement('img')
    $display_img.classList.add('display_img')
    $display_img.src = displayContent.url
    $display_img.dataset.hdurl = displayContent.hdurl

    $display_img.addEventListener('click', function () {
        $modal.innerHTML = `
        <div class="modal-content">
          <img class="img_cover" src="${displayContent.hdurl}">
        </div>`
        $modal.classList.add('show')
    })
    return $display_img
    }
    function createTitle(displayContent) {
    const $display_title = document.createElement('p')
    $display_title.classList.add('display_title')
    $display_title.textContent = displayContent.title
    return $display_title
    }
    function createDate(displayContent) {
    const $display_date = document.createElement('p')
    $display_date.classList.add('display_date')
    $display_date.textContent = displayContent.date
    return $display_date
    }
    function createExplanation(displayContent) {
    const $display_explanation = document.createElement('p')
    $display_explanation.classList.add('display_explanation')
    $display_explanation.textContent = displayContent.explanation
    return $display_explanation
    }
    // assign the renderFavorities function when create saveButton at the same time 
    function saveButton(displayContent) {  
        const save_button = document.createElement('button')
        save_button.classList.add('save_button')
        save_button.id = 'save_button'
        save_button.textContent = 'Save to Favorites'
        save_button.addEventListener('click', function () {
            $Favorities_Block.innerHTML = ''
            $favorities_list.push(displayContent);
            localStorage.setItem('$favorities_list', JSON.stringify($favorities_list))
            console.log($favorities_list);
            renderFavorities($favorities_list); // Call function to render the updated favorites list
        });
        return save_button
    }

    //loop the favourties list to render records
    function renderFavorities(list) {      
        list.forEach((record) => {
            const $record_block = document.createElement('div')
            $record_block.classList.add('record_block')

            const fav_img_block = document.createElement('div')
            fav_img_block.classList.add('fav_img_block')
            fav_img_block.append(createImg(record))
            
            const fav_title_block = document.createElement('div')
            fav_title_block.classList.add('fav_title_block')
            fav_title_block.append(createTitle(record))
    
            const fav_date_block = document.createElement('div')
            fav_date_block.classList.add('fav_date_block')
            fav_date_block.append(createDate(record))

            const del_button_block = document.createElement('div')
            del_button_block.classList.add('del_button_block')
            del_button_block.append(deleteButton(record))

            
            $record_block.append(fav_img_block,fav_title_block,fav_date_block,del_button_block)
            $Favorities_Block.append($record_block)

            $record_block.style.display = 'grid'
        });   
    }

     // Call back four functions to append the content into Display_Block (including the saveButton with 'click' function)
     function createDisplay() {
        const $display_content = JSON.parse(localStorage.getItem('display'))

        const display_img_block = document.createElement('div')
        display_img_block.classList.add('display_img_block')
        display_img_block.append(createImg($display_content))
        
        const display_title_block = document.createElement('div')
        display_title_block.classList.add('display_title_block')
        display_title_block.append(createTitle($display_content))

        const display_date_block = document.createElement('div')
        display_date_block.classList.add('display_date_block')
        display_date_block.append(createDate($display_content))

        const display_explanation_block = document.createElement('div')
        display_explanation_block.classList.add('display_explanation_block')
        display_explanation_block.append(createExplanation($display_content))

        const save_button_block = document.createElement('div')
        save_button_block.classList.add('save_button_block')
        save_button_block.append(saveButton($display_content))


        $Display_container.append(display_img_block, display_title_block, display_date_block, display_explanation_block, save_button_block)

        $Display_container.style.display = 'grid'
    }



    function deleteButton(list) {
        const $deleteButton = document.createElement('button');
        $deleteButton.classList.add('delete-button');
        $deleteButton.dataset.title = list.title;
        if ($favorities_list.includes(list.title)) {
            $deleteButton.classList.add('delete');
        }
        $deleteButton.textContent = 'delete';
        return $deleteButton;
    }


//For getting picture each time, render the record first, then create display for the picture
$Date_form.addEventListener('submit', function(e){
    e.preventDefault();
    let $date = $Date_input.value;
    const api_key = 'cZ2WSGAHTLEc7vfRI8iYBiejt4KF0TmEwEdZd8ab';
    const enquire = 'https://api.nasa.gov/planetary/apod?api_key=';
    let $link = enquire + api_key + '&date=' + $date;

    $Display_container.innerHTML = '';

    fetch($link)
      .then(response => response.json())
      .then(data => {
        localStorage.setItem('display', JSON.stringify(data));
        createDisplay() // Move createDisplay() inside the fetch promise
      });    
});

$modal.addEventListener('click',function (e) {
    if (e.target.matches('.modal'))
    $modal.classList.remove('show')
  })


  $Favorities_Block.addEventListener('click', function (e) {
    if (e.target.matches('.delete-button')) {
        const index = $favorities_list.findIndex((fav) => fav.title === e.target.dataset.title);
        if (index !== -1) {
            $favorities_list.splice(index, 1);
            localStorage.setItem('$favorities_list', JSON.stringify($favorities_list)); // Update localStorage
            console.log($favorities_list);
        }


        const recordBlock = e.target.closest('.record_block');
        recordBlock.remove();
    }
});

