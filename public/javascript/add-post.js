const createPost = document.querySelector('#newPost');

async function newPostHandler(event){
    event.preventDefault();

    const title = document.querySelector('#postTitle').value.trim();
    const post_text = document.querySelector('#postBody').value.trim();
    const city = document.querySelector('#postCity').value.trim();
    const country = document.querySelector('#postCountry').value.trim();

    if(title && post_text && city && country) {

        let lat, long;
        const cityData = await fetch(`https://www.mapquestapi.com/geocoding/v1/address?key=pjtMs45lJi90EGCVfaBEDChiCmQFtGmI&location=${city}+${country}`).then(data => {
            return data.json();
        }).then(data => {
            [lat, long] = [data.results[0].locations[0].latLng.lat, data.results[0].locations[0].latLng.lng];
        });

        const response = await fetch('/api/posts', {
            method: 'POST',
            body: JSON.stringify({
                title,
                post_text,
                city,
                long,
                lat,
                country
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if(response.ok){
            document.location.reload();
        } else {
            alert(response.statusText);
        }
    }
}


createPost.addEventListener('submit', newPostHandler);

